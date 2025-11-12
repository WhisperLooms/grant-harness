---
description: Extract questions and fields from application form
---

# A02: Extract Application Fields

Extract all questions/fields from grant application form (Phase 2).

## Usage
`/a02-app-extract <grant-id>`

## Tasks
1. Load form from `/a01-app-identify`
2. Extract all questions, field types, word limits, requirements
3. Identify: text fields, dropdowns, file uploads, budgets
4. Map to schema: `{section, question, type, required, max_length}`
5. Output: `.outputs/a02-app-extract/{grant_id}_questions.json`

## Next
`/a03-app-replicate` to create NextJS form
