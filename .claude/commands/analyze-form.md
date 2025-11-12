# Analyze Grant Application Form

**Purpose**: Extract form structure and generate JSON schema from grant application

**Week 2 Task**: Day 8
**Consolidates**: a01 (identify), a02 (extract)

---

## Task

Analyze grant application form to extract:
1. Form structure (steps, sections)
2. Field definitions (label, type, validation, required)
3. Generate JSON schema
4. Create Zod validation schema

## Implementation

Use AI to analyze the grant PDF/portal and generate:

```typescript
// front/grant-portal/lib/schemas/igp-2025.ts
export const industryGrowthProgramSchema = {
  grant_id: "igp-2025",
  grant_name: "Industry Growth Program",
  steps: [
    {
      id: "eligibility",
      name: "Eligibility Check",
      fields: [
        {
          id: "abn",
          type: "text",
          label: "Australian Business Number (ABN)",
          required: true,
          validation: { pattern: /^\d{11}$/ }
        },
        // ... more fields
      ]
    },
    // ... more steps
  ]
}
```

## Success Criteria

- ✅ JSON schema generated for 2 grants (IGP + BBI/VMA)
- ✅ Zod schemas created
- ✅ Field types mapped (text, number, select, textarea, date)
- ✅ Ready for `/replicate-form`

## Related

- **ADR-1002**: Schema-Driven Form Generation
- **Issue #2**: Week 2
- **Next**: `/replicate-form`
