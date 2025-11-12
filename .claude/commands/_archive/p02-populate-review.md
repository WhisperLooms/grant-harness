---
description: Flag fields needing human review or input
---

# P02: Mark Fields for Review

Identify and flag fields requiring human review/input (Phase 2).

## Usage
`/p02-populate-review <company-id> <grant-id>`

## Review Categories
- **AI-Generated**: Review for accuracy
- **Missing Data**: Company info not available
- **Strategic**: Requires business decision (budget, timeline)
- **Attachments**: Files to be uploaded

## Output
Review task list with priorities

## Next
`/p03-populate-comment` for collaborative review
