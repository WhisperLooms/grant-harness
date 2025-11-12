---
description: Request signoff from company/consultants
---

# S01: Request Signoff

Initiate approval workflow for completed application (Phase 2).

## Usage
`/s01-signoff-request <company-id> <grant-id> [--approvers email1,email2]`

## Workflow
1. Validate application complete (`/a05-app-validate`)
2. Generate final PDF for review
3. Send signoff requests to approvers
4. Track approval status
5. Collect electronic signatures

## Approver Types
- Company CEO/Director
- CFO (for financials)
- Grant consultant
- Technical expert (for R&D claims)
- Legal (if required)

## Notifications
Email with:
- Application summary
- PDF attachment
- Approve/Request Changes buttons
- Deadline (grant closing date - buffer)

## Next
`/s02-signoff-track` to monitor approval progress
