---
description: Identify and analyze grant application form structure
---

# A01: Identify Application Form

Detect application form structure from grant documents (Phase 2).

## Usage
`/a01-app-identify <grant-id>`

## Tasks
1. Load grant docs from `/g02-grant-docs`
2. Identify application form (PDF/Word/Online)
3. Detect form type: structured (fields), narrative (essays), or hybrid
4. Count sections, questions, attachments
5. Output: `.outputs/a01-app-identify/{grant_id}_form_structure.json`

## Implementation
`back/grant-prototype/application/form_analyzer.py` - PDF/Word form parsing

## Next
`/a02-app-extract` to extract questions
