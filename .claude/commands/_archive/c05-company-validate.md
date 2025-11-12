---
description: Validate company profile data quality and completeness
---

# C05: Validate Company Profile

Validate company profile for completeness and data quality before grant matching.

## Usage

`/c05-company-validate <company-id> [--fix-errors] [--output-report]`

## Validation Checks

### Required Fields
- company_name, state, sectors, annual_revenue, employee_count

### Data Quality
- ABN format (11 digits)
- Revenue and employee count consistency
- State code valid (VIC, NSW, QLD, etc.)
- Sectors match grant taxonomy
- Contact details format

### Completeness Score
- **Excellent (90-100%)**: All fields, rich description, documents
- **Good (70-89%)**: Core fields, basic description
- **Poor (<70%)**: Missing critical data

### Grant Readiness
- Eligibility indicators present
- Matching keywords identified
- At least one "looking_for" area specified

## Output

```
 Company Profile Validation

Company: EMEW Corporation (emew_20251112)
Completeness: 92% (Excellent)

Required Fields:  All present
Data Quality:  Passed (2 warnings)
Grant Readiness:  Ready for matching

Warnings:
- Revenue is estimate, not verified
- No financial documents uploaded

Recommendations:
1. Upload annual report for accurate financials
2. Add more specific "looking_for" criteria
3. Verify ABN with official register

Profile Status: APPROVED for grant matching
```

## Implementation

- `back/grant-prototype/validators/company_validator.py`

## Next Steps

If validated, run `/m01-match-grants` to find relevant grants.
