---
description: Submit application to government grant portal
---

# S05: Submit to Grant Portal

Submit finalized application to government portal (Phase 3).

## Usage
`/s05-submit-portal <company-id> <grant-id> [--portal-credentials file]`

## Portals Supported
- GrantConnect (Federal)
- SmartyGrants (VIC, NSW, QLD)
- Custom state portals

## Tasks
1. Load portal credentials (secure)
2. Navigate to grant application page
3. Upload application PDF + attachments
4. Complete portal-specific fields
5. Review submission
6. Submit application
7. Capture confirmation number
8. Download submission receipt

## Automation
- Playwright for portal automation
- Handle CAPTCHAs, 2FA if required
- Retry logic for network issues

## Output
```
✓ Application Submitted Successfully

Grant: Recycling Modernisation Fund (GC2026001)
Company: EMEW Corporation
Submitted: 2025-11-12 14:30:22
Confirmation: GC2026001-SUB-12345
Receipt: .outputs/s05-submit-portal/submission_receipt.pdf

Post-Submission:
- Confirmation email sent to applicants
- Application archived in system
- Tracking number added to CRM
- Follow-up reminders scheduled

Next Steps:
- Monitor email for acknowledgment
- Prepare for potential clarification requests
- Track assessment timeline (8-12 weeks)
```

## Security
- Encrypted credential storage
- Audit log of submission
- Portal session management

## Workflow Complete
Application journey: g → c → m → a → p → s ✓
