# Replicate Grant Application Form

**Purpose**: Generate NextJS multi-step form from JSON schema

**Week 2 Task**: Days 9-12
**Command**: a03 (replicate)

---

## Task

Build NextJS form components:
1. Set up `front/grant-portal/` (Next.js 14 + Shadcn UI)
2. Implement `DynamicForm.tsx` component (schema → React)
3. Multi-step navigation
4. LocalStorage persistence
5. Test in browser

## Implementation

```bash
cd front/grant-portal
npm install
npm run dev
```

Navigate to `/applications/igp-2025` to test form.

## Success Criteria

- ✅ 2 NextJS forms render (IGP + BBI/VMA)
- ✅ Multi-step navigation works
- ✅ Zod validation functional
- ✅ LocalStorage saves progress
- ✅ Stakeholder confirms: "Matches government portal"

## Related

- **ADR-1001**: React Hook Form + Shadcn UI
- **ADR-1002**: Schema-Driven Forms
- **ADR-1003**: State Management
- **Issue #2**: Week 2
- **Next**: Week 3 - `/populate-application`
