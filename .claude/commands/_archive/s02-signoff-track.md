---
description: Monitor signoff approval status
---

# S02: Track Signoff Status

Monitor approval workflow progress (Phase 2).

## Usage
`/s02-signoff-track <company-id> <grant-id>`

## Display
```
Signoff Status: Recycling Modernisation Fund Application

Progress: 3/5 approvers ✓

✓ CEO (John Smith): Approved - 2025-11-10
✓ CFO (Jane Doe): Approved with comment - 2025-11-11
✓ Consultant (Expert Co): Approved - 2025-11-12
⏳ Technical Lead (Bob Jones): Pending (sent 2025-11-09)
⏳ Legal (Law Firm): Pending (sent 2025-11-09)

Comments/Changes Requested:
- CFO: "Update budget Section 3.2 - increase R&D allocation"

Next Action: Resolve CFO comment, then re-request approval
Deadline: 15 days until grant closes
```

## Next
`/s03-signoff-changes` if changes requested
