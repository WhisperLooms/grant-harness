---
description: Generate NextJS form replicating grant application
---

# A03: Replicate Application Form

Generate NextJS form component replicating grant application (Phase 2).

## Usage
`/a03-app-replicate <grant-id>`

## Tasks
1. Load questions from `/a02-app-extract`
2. Generate NextJS/React form components
3. Add validation (required fields, word limits)
4. Include: auto-save, progress tracking, collaboration features
5. Output: `front/grant-portal/components/applications/{grant_id}-form.tsx`

## Tech Stack
- NextJS, React Hook Form, Zod validation
- Real-time collaboration (Firebase/Supabase)
- Multi-user editing with comments

## Next
`/a04-app-map` to map company data to fields
