---
description: Process and index uploaded company documents
---

# C04: Process Company Documents

Process user-uploaded company documents for inclusion in company profile and vector database.

## Usage

`/c04-company-docs <company-id> <docs-directory> [--types annual-report,financials,certifications]`

## Supported Document Types

- Annual reports
- Financial statements
- Product catalogs
- Case studies / project examples
- Certifications (ISO, industry-specific)
- Letters of support
- Previous grant applications

## Tasks

1. **Scan Directory**: Find all documents in specified directory

2. **Classify Documents**: Use LLM to categorize each document

3. **Extract Key Information**:
   - Financial data (from annual reports)
   - Project case studies (for grant examples)
   - Certifications and compliance
   - Key achievements

4. **Update Company Profile**: Merge extracted data into profile from `/c02`

5. **Add to Vector Store**: Upload to company vector database from `/c03`

6. **Save Manifest**: `.outputs/c04-company-docs/{company_id}/docs_manifest.json`

## Output

Enhanced company profile with:
- More accurate financial data
- Concrete project examples
- Verified certifications
- Ready-to-use content for applications

## Implementation

- `back/grant-prototype/profilers/document_processor.py`

## Next Steps

Re-run `/c02-company-profile` to update profile with document data.
