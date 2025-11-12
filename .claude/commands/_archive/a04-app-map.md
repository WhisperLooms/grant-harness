---
description: Map company/grant data to application form fields
---

# A04: Map Data to Application

Map company and grant context to application fields (Phase 2).

## Usage
`/a04-app-map <company-id> <grant-id>`

## Tasks
1. Load: company profile, grant details, application fields
2. Map obvious fields: company name, ABN, address → form fields
3. Identify questions answerable from company vector DB
4. Mark fields for AI population vs. manual input
5. Output: `.outputs/a04-app-map/{company_id}_{grant_id}_field_mapping.json`

## Mapping Types
- **Direct**: ABN → ABN field
- **AI-Generated**: "Describe R&D" → query company vector DB
- **Manual**: Budget details → human input required

## Next
`/p01-populate-ai` to auto-fill fields
