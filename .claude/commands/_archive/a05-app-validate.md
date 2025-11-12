---
description: Validate application form completeness
---

# A05: Validate Application Form

Check application completeness and requirement compliance (Phase 2).

## Usage
`/a05-app-validate <company-id> <grant-id>`

## Checks
- All required fields filled
- Word limits not exceeded
- File attachments present
- Budget calculations correct
- Consistency across sections

## Output
Validation report with errors/warnings

## Next
`/s01-signoff-request` when validated
