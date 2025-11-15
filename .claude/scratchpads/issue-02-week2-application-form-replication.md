# Issue #2: Application Form Replication (Week 2)

**Issue Link**: https://github.com/WhisperLooms/grant-harness/issues/2

**Created**: 2025-11-12
**Status**: Planning

---

## Strategic Context

**Epic/Tier**: Phase 1 - Week 2 (Application-First Strategy)
**Priority**: 🔴 NEXT (Critical path for core value proposition)
**Dependencies**:
- Issue #1 (Week 1) - ✅ COMPLETED (grants ingested, EMEW data ready)
- ADR-1001 (React Hook Form + Shadcn UI) - Accepted
- ADR-1002 (Schema-Driven Form Generation) - Accepted
- ADR-1003 (Multi-Step Form State Management) - Accepted
- ADR-1004 (Collaboration Backend) - Proposed
- ADR-1005 (PDF Export Strategy) - Accepted

**Blocks**:
- Issue #3: AI-Powered Population & Review (Week 3)
- Issue #4: Collaboration & Export (Week 4)

**Strategic Importance**: Per ADR-0003 (Application-First Strategy), this validates the CORE VALUE PROPOSITION - helping clients complete applications efficiently. Success Metric: Forms must look identical to government portals and support multi-step navigation.

---

## Layer

**Layer**: Frontend (`front/grant-portal/`)
**Workflow Reference**: `.cursor/rules/frontend/workflow.mdc` (currently placeholder - to be established)

**Key Decision**: This is the FIRST frontend implementation in Grant-Harness. We're establishing patterns that will be used for all future grant forms.

---

## Routing Plan

**Complexity**: High (first frontend implementation, multi-step forms, schema-driven generation)

**Agent Routing**: Consider specialized approach for:
1. **NextJS Setup** - Straightforward (do directly)
2. **Shadcn UI Integration** - Follow template (do directly)
3. **Schema Extraction from PDFs** - May need document analysis agent
4. **Dynamic Form Generator** - Core implementation (do directly)

**Recommendation**: Direct implementation with careful planning. Use `shadcn-nextjs-multistep-form-example` as foundation.

---

## ADR Reference

**Existing ADRs** (Implementation of):
- **ADR-1001**: React Hook Form + Shadcn UI Foundation
- **ADR-1002**: Schema-Driven Form Generation
- **ADR-1003**: Multi-Step Form State Management
- **ADR-1005**: PDF Export Strategy (for Week 4)

**ADR-1004** (Collaboration Backend): Currently "Proposed" - needs decision on Supabase vs Firebase for Week 3-4.

**New ADR Required**: **NO** - This is pure implementation of existing architectural decisions. All patterns already documented.

**Tech Stack Update** (2025-11-12): ADR-1001 updated to specify **Next.js 15 + React 19** as optimal stack (vs Next.js 14 in original ADR). See ADR-1001 for rationale.

---

## User Journey & UX Architecture

**Reference Document**: `.claude/scratchpads/issue-02-user-journey-and-ux-architecture.md`

**Key Decisions**:

### Two-Phase Design Strategy

**Phase 1 (Week 2 - Issue #2 Scope)**:
- Public access to replica application forms (no authentication)
- Direct navigation to `/applications/[grantId]`
- LocalStorage for save/resume functionality
- Simple landing page with grant directory

**Phase 2 (Week 5+ - Future Growth)**:
- User authentication (Firebase Email/Password + Google Sign-In)
- Protected dashboard (`/dashboard`)
- Saved applications in Firestore
- Multi-tenant collaboration workflow

**Design Philosophy**: Build Phase 1 features (replica forms) while structuring codebase to accommodate Phase 2 auth without refactoring.

### Firebase Template Integration

**Template Assessed**: `agency-ai-solutions/nextjs-firebase-ai-coding-template`

**Verdict**: ✅ Suitable with modifications

**What we're using from template**:
- Auth folder structure (`src/auth/`)
- Firebase operations abstraction
- AuthProvider pattern
- Protected route patterns

**What we're replacing**:
- Material-UI → Shadcn UI (per ADR-1001)
- Event broker (may be overkill for our use case)

**Integration Timeline**:
- **Week 2**: No Firebase yet, structure folders for Phase 2
- **Week 5**: Copy auth folder, adapt to Shadcn UI, implement sign-in/sign-up

### Route Structure (Next.js 15 App Router Groups)

```
src/app/
├── (public)/                    # Phase 1 - No auth required
│   ├── page.tsx                # Landing page (grant directory)
│   └── applications/
│       └── [grantId]/          # IGP, BBI forms
│           └── page.tsx
├── (auth)/                      # Phase 2 - Auth pages
│   ├── signin/
│   └── signup/
└── (protected)/                 # Phase 2 - Requires auth
    ├── dashboard/
    └── my-applications/
```

**Benefits**:
- Clean separation of public vs protected routes
- Easy to add auth guards at group level (Phase 2)
- Week 2 implementation stays in `(public)` folder only

### Component Reuse (Adaptive Design)

**Header Component**: Adapts based on auth state
- Phase 1: Just "Grant Directory" link
- Phase 2: Shows "Sign In" or "Dashboard" based on `useAuth()` hook

**DynamicForm Component**: Dual-mode storage
- Phase 1: Auto-save to LocalStorage
- Phase 2: If `user` exists, save to Firestore; otherwise LocalStorage

**Migration Path**: When user signs up in Phase 2, detect LocalStorage applications → prompt import to Firestore

---

## Testing Strategy

**Test Framework**: Playwright E2E Tests (per ADR-1001 Compliance section)
**Test Mode**: Visual + Functional

### Test Commands

```bash
# Frontend E2E tests (to be created)
cd front/grant-portal
npm run test:e2e

# Visual regression testing
npx playwright test --headed

# Specific form tests
npx playwright test tests/e2e/igp-form.spec.ts
npx playwright test tests/e2e/bbi-form.spec.ts
```

### Pass Criteria

**Functional**:
1. ✅ IGP form renders all 5-8 steps
2. ✅ BBI form renders all 10-15 steps
3. ✅ Multi-step navigation works (Next/Previous)
4. ✅ Form validation with Zod errors displayed
5. ✅ LocalStorage persistence (save/resume)
6. ✅ All field types render correctly (text, select, radio, checkbox, textarea)

**Visual Compliance** (MANDATORY per /issue protocol):
- ✅ Forms match government portal structure
- ✅ Shadcn UI styling applied consistently
- ✅ No console errors
- ✅ Responsive design (desktop + tablet)
- ✅ Stakeholder confirms: "This looks like the real form"

### Evidence Locations

- `front/grant-portal/tests/e2e/` - Playwright test files
- `front/grant-portal/tests/screenshots/` - Visual evidence
- `.claude/scratchpads/issue-02-week2-application-form-replication.md` - Test execution logs
- PR description: Link to deployed preview (if available)

---

## Implementation Plan

### Prerequisites: Template & Environment Setup

**Clone Base Template**:
```bash
# Clone shadcn-nextjs-multistep-form-example
git clone https://github.com/63r6o/shadcn-nextjs-multistep-form-example front/grant-portal-template

# Copy to project structure
mkdir -p front/grant-portal
cp -r front/grant-portal-template/* front/grant-portal/
rm -rf front/grant-portal-template
```

**Environment Setup**:
```bash
cd front/grant-portal
npm install
npm run dev  # Test template works at http://localhost:3000
```

### Task 1: Analyze IGP Application Form (Day 8)

**Goal**: Extract form structure from IGP Commercialisation & Growth guidelines

**Input Files**:
- `back/grant-prototype/.inputs/grants/federal/industry-growth-program/IGP-Commercialisation-and-Growth-Guidelines.pdf`
- `back/grant-prototype/.inputs/grants/federal/industry-growth-program/IGP-Program-Information-Guide.pdf`

**Analysis Method**:
1. Manual review of PDFs to identify:
   - Number of form steps/sections
   - Field types (text, select, radio, textarea, file upload)
   - Validation rules (required, min/max, regex patterns)
   - Conditional fields (show/hide based on other fields)
2. Map to JSON schema structure

**Output**: `front/grant-portal/lib/schemas/igp-commercialisation.ts`

**Expected Schema Structure**:
```typescript
import { z } from "zod";

export const igpFormSchema = z.object({
  step1_eligibility: z.object({
    businessName: z.string().min(1, "Business name required"),
    abn: z.string().regex(/^\d{11}$/, "ABN must be 11 digits"),
    annualRevenue: z.number().max(20000000, "Revenue must be under $20M"),
    state: z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"]),
    // ... more fields
  }),
  step2_project: z.object({
    projectTitle: z.string().min(1).max(100),
    projectDescription: z.string().min(100).max(2000),
    // ... more fields
  }),
  // ... 5-8 steps total
});

export type IGPFormData = z.infer<typeof igpFormSchema>;
```

**Success Criteria**:
- ✅ Schema captures all IGP application fields
- ✅ Validation rules match PDF requirements
- ✅ TypeScript types generated from schema
- ✅ 5-8 steps identified

### Task 2: Generate IGP NextJS Form (Day 9-10)

**Goal**: Create dynamic form component that renders IGP schema

**Files to Create**:
1. `front/grant-portal/components/forms/DynamicForm.tsx` - Schema renderer
2. `front/grant-portal/components/forms/DynamicField.tsx` - Field type router
3. `front/grant-portal/components/forms/FormStep.tsx` - Step container
4. `front/grant-portal/app/applications/igp-commercialisation/page.tsx` - IGP application page

**Implementation Pattern** (from ADR-1002):
```tsx
// DynamicForm.tsx
interface DynamicFormProps {
  schema: z.ZodObject<any>;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function DynamicForm({ schema, onSubmit, initialData }: DynamicFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Render fields dynamically from schema */}
      </form>
    </Form>
  );
}
```

**Shadcn UI Components to Install**:
```bash
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add progress
```

**Multi-Step Navigation** (from template):
- Context API for step management
- LocalStorage for auto-save
- Progress indicator (Step 1 of 8)
- Previous/Next buttons with validation

**Success Criteria**:
- ✅ IGP form renders at `/applications/igp-commercialisation`
- ✅ All 5-8 steps display correctly
- ✅ Field types match schema (text, select, etc.)
- ✅ Validation errors show on blur
- ✅ Can navigate between steps
- ✅ LocalStorage saves progress

### Task 3: Analyze BBI Application Form (Day 11)

**Goal**: Extract form structure from Battery Breakthrough Initiative materials

**Input Files**:
- `back/grant-prototype/.inputs/grants/federal/battery-breakthrough/02-Battery-Breakthrough-Initiative-Focus-Areas-2025.pdf`
- `back/grant-prototype/.inputs/grants/federal/battery-breakthrough/03-Battery-Breakthrough-Initiative-Frequently-Asked-Questions.pdf`
- `back/grant-prototype/.inputs/grants/federal/battery-breakthrough/04-BBI-Consultation-Summary-Paper.pdf`

**Analysis Method**:
1. Review BBI focus areas to understand program structure
2. Infer application form structure from:
   - Eligibility criteria (FAQ)
   - Project types (Focus Areas)
   - Consultation feedback (common fields)
3. Estimate 10-15 steps based on program complexity

**Output**: `front/grant-portal/lib/schemas/battery-breakthrough.ts`

**Expected Complexity**:
- More steps than IGP (10-15 vs 5-8)
- Complex eligibility (battery value chain positioning)
- Multi-stage funding (Early, Mid, Late)
- Technical fields (battery chemistry, capacity, etc.)

**Success Criteria**:
- ✅ Schema captures BBI-specific fields
- ✅ Validation rules inferred from PDFs
- ✅ 10-15 steps identified
- ✅ Battery-specific field types included

### Task 4: Generate BBI NextJS Form (Day 11-12)

**Goal**: Reuse DynamicForm component for BBI application

**Files to Create**:
1. `front/grant-portal/lib/schemas/battery-breakthrough.ts` - BBI schema
2. `front/grant-portal/app/applications/battery-breakthrough/page.tsx` - BBI application page

**Implementation**:
```tsx
// app/applications/battery-breakthrough/page.tsx
import { DynamicForm } from "@/components/forms/DynamicForm";
import { bbiFormSchema } from "@/lib/schemas/battery-breakthrough";

export default function BBIApplicationPage() {
  return (
    <DynamicForm
      schema={bbiFormSchema}
      onSubmit={(data) => console.log("BBI submission:", data)}
    />
  );
}
```

**Success Criteria**:
- ✅ BBI form renders at `/applications/battery-breakthrough`
- ✅ All 10-15 steps display correctly
- ✅ Reuses DynamicForm component (no duplication)
- ✅ Battery-specific fields render correctly
- ✅ Multi-step navigation works

### Task 5: Testing & Stakeholder Review (Day 12)

**Goal**: Validate forms match government portals

**Test Cases**:
1. **Functional Testing**:
   - [ ] Submit valid IGP application (all fields filled)
   - [ ] Submit valid BBI application (all fields filled)
   - [ ] Trigger validation errors (missing required fields)
   - [ ] Navigate backwards/forwards through steps
   - [ ] Refresh page (LocalStorage persistence)
   - [ ] Clear form and restart

2. **Visual Testing**:
   - [ ] IGP form looks like business.gov.au portal
   - [ ] BBI form looks like ARENA portal
   - [ ] Shadcn UI styling consistent
   - [ ] Responsive on tablet (768px)
   - [ ] No console errors or warnings

3. **Stakeholder Review**:
   - [ ] Gordon reviews IGP form: "Does this match the real form?"
   - [ ] Gordon reviews BBI form: "Does this match the real form?"
   - [ ] Consultant feedback on usability

**Evidence**:
- Screenshots of both forms (all steps)
- Playwright test results
- Stakeholder confirmation email/comment

---

## Success Criteria

### Week 2 Deliverables

- ✅ `front/grant-portal/` Next.js 14 app initialized
- ✅ Shadcn UI components installed and configured
- ✅ DynamicForm component renders schema-driven forms
- ✅ IGP form (5-8 steps) complete and functional
- ✅ BBI form (10-15 steps) complete and functional
- ✅ Multi-step navigation with LocalStorage persistence
- ✅ Form validation with Zod + error display
- ✅ Stakeholder confirms visual accuracy

### Technical Evidence

- `front/grant-portal/package.json` - Dependencies installed
- `front/grant-portal/lib/schemas/` - Form schemas
- `front/grant-portal/components/forms/` - Reusable form components
- `front/grant-portal/app/applications/` - Grant-specific pages
- `front/grant-portal/tests/e2e/` - Playwright tests
- Screenshots in scratchpad or PR description

---

## Test Execution Evidence

[To be added during implementation]

---

## Notes

### Key Decisions

1. **Template Choice**: Using `shadcn-nextjs-multistep-form-example` as base
   - Pros: Multi-step pattern pre-built, LocalStorage included, Shadcn UI already configured
   - Cons: Need to adapt for schema-driven generation

2. **Grant Selection**: IGP + BBI (from Issue #1 matching results)
   - IGP: Standard SME grant (5-8 steps, medium complexity)
   - BBI: Large-scale program (10-15 steps, high complexity)
   - Validates schema-driven approach at different scales

3. **Schema First**: Extract schemas before building forms
   - Ensures type safety
   - Enables AI population in Week 3
   - Supports validation consistency

### Risks & Mitigations

**Risk 1**: PDFs may not contain complete form structure
- **Mitigation**: Combine multiple PDFs (guidelines + FAQ + info guide)
- **Fallback**: Use government portal screenshots for reference

**Risk 2**: Dynamic form generation may not support all field types
- **Mitigation**: Start with common types (text, select, textarea, radio, checkbox)
- **Fallback**: Hard-code complex fields in Step components

**Risk 3**: Forms may not visually match government portals
- **Mitigation**: Shadcn UI provides clean, government-appropriate styling
- **Fallback**: Custom CSS to match specific portal styles

### Dependencies

**External**:
- Node.js 18+ installed
- npm or yarn
- Grant PDFs downloaded (from Week 1)

**Internal**:
- Week 1 complete (Issue #1 closed)
- ADRs 1001-1005 accepted

### Next Steps (Week 3)

After Week 2 completion, Week 3 will:
1. Query EMEW company corpus to auto-fill form fields
2. Implement AI-powered field population
3. Add expert review workflow
4. Target: 70% of fields auto-populated

---

**Last Updated**: 2025-11-12
**Status**: Plan Complete - Ready for Implementation
