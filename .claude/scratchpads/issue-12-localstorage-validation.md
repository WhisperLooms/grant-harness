# Issue #12: Fix LocalStorage Hydration Validation Bug

**Issue Link**: https://github.com/WhisperLooms/grant-harness/issues/12

## Strategic Context

- **Epic/Tier**: Week 2-3 Transition (Between COMPLETED and Week 3)
- **Priority**: 🔴 IMMEDIATE (Before Week 3)
- **Dependencies**: Issue #2 (COMPLETED - PR #11)
- **Blocks**: Issue #3 (AI Population - Government Format), Issue #10 (Streamlined Format)
- **Strategic Impact**: Enables smooth stakeholder demos for Week 3 dual-format AI population

**Why This Matters**: This bug blocks the Week 3 AI population demos because:
- Users cannot navigate between steps after page reload with saved data
- Poor UX for stakeholders reviewing AI-populated forms
- Workaround (direct URL navigation) is not user-friendly for demos

## Problem Analysis

### Root Cause

React Hook Form's `mode: "onChange"` config triggers validation only on user interaction, not on programmatic value changes during component mount. When localStorage data is hydrated into the form via `defaultValues`, the form is technically valid but the validation state is not updated.

**Evidence**:
- Test session: `.docs/screenshots/test-evidence/igp-commercialisation/2025-11-15-session-002/metadata.json` (lines 21-25)
- Current workaround: Direct URL navigation (e.g., `/applications/igp-commercialisation/step3`)

### Affected Components

**Steps 2-6** of IGP Commercialisation form (7-step government format):
- `step2/page.tsx` - Organization Details
- `step3/page.tsx` - Contact Details
- `step4/page.tsx` - Project Details
- `step5/page.tsx` - Budget
- `step6/page.tsx` - Supporting Information

**Not Affected**:
- Step 1 (Eligibility) - Always starts fresh, no localStorage hydration
- Step 7 (Review & Submit) - No Next button, only Submit

### Current Implementation Pattern

All affected steps follow this pattern:
```tsx
const form = useForm<StepDataType>({
  mode: "onChange", // ← Real-time validation for Next button
  resolver: zodResolver(stepSchema),
  defaultValues: formData.stepX_data || { /* defaults */ },
});
```

The problem: `defaultValues` are set from localStorage, but validation doesn't run automatically.

## Layer & Workflow

**Layer**: Frontend (`front/grant-portal/src/`)

**Workflow Reference**: `.cursor/rules/frontend/ADR.mdc`
- ADR-1001: React Hook Form + Shadcn UI Foundation
- ADR-1003: Multi-Step Form State Management (localStorage hydration pattern)
- ADR-1007: Playwright MCP Browser Testing Before PR

**No workflow.mdc exists yet** - Frontend workflow is documented in ADRs only.

## Routing Plan

**Simple fix** - No agent routing needed. Direct implementation by this agent.

**Why**:
- Single-file pattern repeated across 5 step pages
- Tactical change with clear solution
- No architectural changes required

## Architectural Decision Check

**No ADR required** - Tactical change only

**Reasoning**:
- Uses existing React Hook Form API (`form.trigger()`)
- Does not change form state management architecture (ADR-1003)
- Does not affect localStorage hydration pattern
- Fixes validation timing only, not validation logic
- No new dependencies or patterns introduced

**Classification**: Bug fix, not architectural change

## Testing Strategy

**Framework**: Playwright E2E + Manual Browser Testing

**Test Modes** (per `.docs/specs/testing-guide.md`):
1. **Preflight**: Quick manual test in dev server (< 2 min)
2. **Full-flow**: Complete form fill from Step 1-7 with page reloads (5-10 min)

**Test Commands** (reference `.claude/commands/test-*`):
- Manual: `npm run dev` + browser F5 testing
- E2E: `npx playwright test tests/e2e/igp-form-navigation.spec.ts` (if exists)

**Pass Criteria**:
- [ ] Fill Step 2 completely
- [ ] Click "Save Draft"
- [ ] Reload browser (F5)
- [ ] **Verify Next button is ENABLED** (currently disabled - BUG)
- [ ] Click Next button successfully navigates to Step 3
- [ ] Repeat for Steps 3-6

**Evidence Location**:
- Screenshots: `.claude/scratchpads/issue-12-localstorage-validation.md` (this file)
- Or: `.docs/screenshots/test-evidence/igp-commercialisation/2025-11-15-issue-12-fix/`

## Implementation Plan

### Solution: Add `useEffect` Validation Trigger

Add this pattern to each affected step (2-6):

```tsx
import { useEffect } from "react";

export default function StepXPage() {
  // ... existing code ...

  const form = useForm<StepXData>({
    mode: "onChange",
    resolver: zodResolver(stepXSchema),
    defaultValues: formData.stepX_data || { /* defaults */ },
  });

  // ✅ NEW: Trigger validation after localStorage hydration
  useEffect(() => {
    // Only trigger if we have saved data from localStorage
    if (formData.stepX_data && Object.keys(formData.stepX_data).length > 0) {
      form.trigger(); // Re-run all validation rules
    }
  }, []); // Run once on mount (after defaultValues are set)

  // ... rest of component ...
}
```

**Key Points**:
- `form.trigger()` - React Hook Form API to manually trigger validation
- Empty dependency array `[]` - Run once on mount only
- Conditional check - Only trigger if localStorage data exists
- Works with existing `mode: "onChange"` and `canGoNext={form.formState.isValid}`

### Files to Modify

1. `front/grant-portal/src/app/(public)/applications/igp-commercialisation/step2/page.tsx`
2. `front/grant-portal/src/app/(public)/applications/igp-commercialisation/step3/page.tsx`
3. `front/grant-portal/src/app/(public)/applications/igp-commercialisation/step4/page.tsx`
4. `front/grant-portal/src/app/(public)/applications/igp-commercialisation/step5/page.tsx`
5. `front/grant-portal/src/app/(public)/applications/igp-commercialisation/step6/page.tsx`

### Implementation Steps

1. **Import useEffect**: Add to React imports at top of each file
2. **Add useEffect hook**: After `useForm()` declaration, before watchers
3. **Check localStorage data**: Use appropriate step data key (e.g., `formData.step2_organization`)
4. **Trigger validation**: Call `form.trigger()` if data exists

### Testing Checklist

**Per-Step Testing**:
- [ ] Step 2: Fill all fields → Save Draft → F5 → Next button enabled ✅
- [ ] Step 3: Fill all fields → Save Draft → F5 → Next button enabled ✅
- [ ] Step 4: Fill all fields → Save Draft → F5 → Next button enabled ✅
- [ ] Step 5: Fill all fields → Save Draft → F5 → Next button enabled ✅
- [ ] Step 6: Fill all fields → Save Draft → F5 → Next button enabled ✅

**Regression Testing**:
- [ ] Step 1 → Step 2 (first time, no localStorage) → Next button requires input ✅
- [ ] Fresh form (clear localStorage) → Step 2 → Next button disabled until valid ✅
- [ ] Full flow Step 1-7 without reloads → Works as before ✅

## Success Criteria

### Functional
- [x] `useEffect` added to Steps 2-6 that triggers `form.trigger()` after localStorage loads
- [ ] Next button enables immediately after page reload with saved data
- [ ] All 6 steps (2-6) tested to ensure validation works
- [ ] No regression: validation still works correctly on fresh forms
- [ ] Workaround (direct URL navigation) no longer needed

### Testing
- [ ] Manual browser testing completed for all 5 steps
- [ ] Test evidence documented in scratchpad or screenshots
- [ ] No console errors during validation trigger
- [ ] Form state properly reflects validity after reload

### Documentation
- [ ] Scratchpad documents implementation and test results
- [ ] PR description includes test evidence
- [ ] Commit message references Issue #12

## Related References

**GitHub**:
- Issue #2: Application Form Replication (Week 2) - COMPLETED
- PR #11: IGP Form Steps 2-7 Implementation - MERGED
- Issue #3: AI Population - Government Format (Week 3) - BLOCKED by this
- Issue #10: Streamlined Format (Week 3) - BLOCKED by this

**ADRs**:
- ADR-1003: Multi-Step Form State Management (localStorage pattern)
- ADR-1001: React Hook Form + Shadcn UI Foundation

**Testing**:
- `.docs/specs/testing-guide.md` - Test strategy framework
- `.docs/specs/test-guide-4-e2e.md` - Playwright E2E testing
- `.docs/screenshots/test-evidence/igp-commercialisation/2025-11-15-session-002/` - Original test evidence

## Estimated Effort

**~2 hours total**:
- Implementation: 30 minutes (5 files × 6 minutes each)
- Testing: 1 hour (5 steps × 12 minutes each)
- PR creation: 30 minutes (scratchpad update, commit, PR description)

**Status**: Ready to implement ✅
