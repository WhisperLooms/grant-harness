---
description: Validate scraped grant data quality and completeness
---

# G05: Validate Grant Data

You are assisting with the Grant-Harness project's grant discovery workflow. Your task is to validate scraped grant data for quality, completeness, and schema compliance.

## Context

This command performs quality assurance on scraped grant data before uploading to Gemini or matching to companies. It ensures data integrity and identifies issues early.

## Usage

`/g05-grant-validate [--source g01|g02] [--fix-errors] [--output-report]`

**Arguments**:
- `--source` (optional): Validate g01 (lists) or g02 (detailed docs) (default: both)
- `--fix-errors` (optional): Auto-fix common errors where possible (default: false)
- `--output-report` (optional): Save validation report to file (default: true)

## Tasks

### 1. Validate G01 Grant Lists

If `--source=g01` or `both`:

**Load Latest Grant List**:
- Find most recent `g01-grant-list_*.csv`
- Parse CSV into Grant objects

**Schema Validation**:
- Check required fields present: grant_id, title, agency, jurisdiction, url, status
- Validate field types: dates (YYYY-MM-DD), funding (positive integers), status (enum)
- Check grant_id format: `{JUR}{YEAR}{NUM}` (e.g., GC2026001, VIC2026042)

**Data Quality Checks**:
- **Date logic**: `opens` <= `closes` (if both present)
- **Funding logic**: `funding_min` <= `funding_max` (if both present)
- **URL accessibility**: Sample 10% of URLs to verify they return 200 OK
- **Duplicate detection**: Same title + agency + jurisdiction
- **Orphaned grants**: Grant ID referenced but missing data

**Common Issues**:
- Missing closing dates (warn if null)
- Past closing dates (warn if closes < today)
- Unusually high/low funding (flag if > $50M or < $1K)
- Invalid jurisdiction codes
- Malformed URLs

### 2. Validate G02 Grant Details

If `--source=g02` or `both`:

**Load Grant Details Index**:
- Read `g02-grant-docs/index.json`
- Iterate through each grant folder

**Detailed Schema Validation**:
For each grant's `{grant_id}_details.json`:
- Required fields: grant_id, scraped_at, source_url, basic_info, details
- Details sub-fields: full_description, eligibility, assessment_criteria

**Content Quality Checks**:
- **Description length**: >= 200 characters (flag if shorter)
- **Eligibility completeness**: Not just "See guidelines" (check for substantive text)
- **Assessment criteria**: At least 2 criteria listed
- **Contact info**: Email or phone present
- **Key dates**: At least opening and closing dates

**Document Validation**:
- Check files exist at specified paths
- Verify file sizes match recorded sizes
- Validate checksums (if recorded)
- Check file types match extensions (.pdf, .docx, .xlsx)
- Flag missing documents (guidelines, application forms)

**Cross-Reference Validation**:
- Grant in g02 must exist in g01
- Basic info matches between g01 and g02
- No grants in g01 missing from g02 (if scraped)

### 3. Generate Validation Report

**Summary Statistics**:
```
 Grant Data Validation Report

Dataset: g01-grant-list_20251112T143022.csv
Total grants: 89

Schema Validation:
- Passed: 85 grants (95.5%)
- Failed: 4 grants (4.5%)

Data Quality:
- Excellent: 72 grants (80.9%) - All fields complete
- Good: 13 grants (14.6%) - Minor issues (missing optional fields)
- Poor: 4 grants (4.5%) - Major issues (missing required fields)

Common Issues Found:
1. Missing closing dates: 12 grants
2. Past closing dates: 3 grants
3. Invalid URLs: 2 grants (404 errors)
4. Duplicate grants: 1 pair (GC2026005 = GC2026008)

Critical Errors (must fix):
- GC2026012: Missing title
- VIC2026007: Invalid grant_id format
- NSW2026015: Closing date before opening date
- QLD2026003: Negative funding amount

Warnings (review recommended):
- 12 grants missing funding information
- 5 grants with unusually high funding (> $10M)
```

**Detailed Error List**:
Create `.outputs/g05-grant-validate/validation-errors_{timestamp}.json`:
```json
{
  "validation_timestamp": "2025-11-12T14:30:22Z",
  "dataset": "g01-grant-list_20251112T143022.csv",
  "total_grants": 89,
  "passed": 85,
  "failed": 4,
  "errors": [
    {
      "grant_id": "GC2026012",
      "severity": "critical",
      "field": "title",
      "issue": "Missing required field",
      "fix_suggestion": "Manual review required - check source URL"
    },
    {
      "grant_id": "VIC2026007",
      "severity": "critical",
      "field": "grant_id",
      "issue": "Invalid format (expected VIC2026XXX, got VIC26007)",
      "fix_suggestion": "Rename to VIC2026007",
      "auto_fixable": true
    }
  ],
  "warnings": [
    {
      "grant_id": "GC2026015",
      "severity": "warning",
      "field": "funding_max",
      "issue": "Unusually high funding amount: $25,000,000",
      "fix_suggestion": "Verify amount from source"
    }
  ]
}
```

### 4. Auto-Fix Common Errors

If `--fix-errors=true`:

**Fixable Issues**:
- Grant ID format errors (e.g., VIC26007 ’ VIC2026007)
- Extra whitespace in titles/descriptions
- Inconsistent date formats (convert to YYYY-MM-DD)
- URL encoding issues
- Duplicate grant removal (keep most recent scrape)

**Report Fixes**:
```
Auto-Fix Summary:
- Fixed grant IDs: 2
- Trimmed whitespace: 15 fields
- Standardized dates: 8
- Removed duplicates: 1

Remaining issues require manual review: 3
```

### 5. Validation Best Practices

**Before Uploading to Gemini**:
- Run `/g05-grant-validate --source g02` to check detailed data
- Fix critical errors before upload
- Review warnings to improve matching quality

**Regular Validation**:
- After `/g01-grant-lists`: Validate lists before scraping details
- After `/g02-grant-docs`: Validate details before Gemini upload
- After `/g04-grant-sync`: Validate new/updated grants

**Quality Metrics**:
- Target: > 95% grants pass validation
- Target: < 5% grants with warnings
- Target: 0% grants with critical errors

## Expected Output

Files created:
- `.outputs/g05-grant-validate/validation-report_{timestamp}.txt` - Human-readable summary
- `.outputs/g05-grant-validate/validation-errors_{timestamp}.json` - Machine-readable error list
- `.outputs/g05-grant-validate/validation-passed_{timestamp}.csv` - List of valid grants

## Implementation Location

- `back/grant-prototype/validators/grant_validator.py`
- `back/grant-prototype/validators/schema_validator.py`
- `back/grant-prototype/models/entities.py` (use Pydantic validation)

## Error Handling

- **Invalid CSV format**: Report error, attempt to parse with liberal settings
- **Missing files**: Log warning, continue with available data
- **Corrupt JSON**: Report error, skip that grant, continue

## Integration with Workflow

```
Recommended workflow:
1. /g01-grant-lists (scrape lists)
2. /g05-grant-validate --source g01 --fix-errors (validate & fix)
3. /g02-grant-docs (scrape details for valid grants)
4. /g05-grant-validate --source g02 --fix-errors (validate details)
5. /g03-gemini-upload (upload validated data)
```

## Next Steps

After validation passes:
- If errors: Fix manually or run `--fix-errors`, then re-validate
- If passed: Run `/g03-gemini-upload` to upload to vector database
