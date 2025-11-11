---
description: AI auto-fill application fields from company context
---

# P01: AI Populate Application

Auto-fill application fields using AI and company vector database (Phase 2).

## Usage
`/p01-populate-ai <company-id> <grant-id> [--fields all|specific]`

## Tasks
1. Load field mappings from `/a04-app-map`
2. For each AI-generatable field:
   - Query company vector DB
   - Query grant details
   - Generate response using Gemini
   - Respect word limits, formatting requirements
3. Mark AI-generated fields for review
4. Save draft application

## Examples
- "Describe your R&D capabilities" → Query company docs about R&D
- "Environmental impact" → Extract sustainability initiatives
- "Export markets" → Pull from company profile

## Output
Partially populated application with AI-generated content marked for review

## Next
`/p02-populate-review` to flag fields needing human review
