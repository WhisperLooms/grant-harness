# Issue #2: Final Testing and Completion Plan

**Issue Link**: https://github.com/WhisperLooms/grant-harness/issues/2
**Branch**: `issue-2-form-replica`
**Created**: 2025-11-13
**Status**: Analysis Complete - Ready for Final Implementation

---

## Strategic Context

**Epic/Tier**: Phase 1 - Week 2 (Application-First Strategy)
**Priority**: 🔴 NEXT (Critical path for core value proposition)

**Dependencies**:
- ✅ Issue #1 (Week 1) - COMPLETED (grants ingested, EMEW data ready)
- ✅ ADR-1001 (React Hook Form + Shadcn UI) - Accepted
- ✅ ADR-1002 (Schema-Driven Form Generation) - Accepted
- ✅ ADR-1003 (Multi-Step Form State Management) - Accepted
- ✅ ADR-1006 (URL Structure Scalability) - Accepted

**Blocks**:
- Issue #3: AI-Powered Population & Review (Week 3)
- Issue #4: Collaboration & Export (Week 4)

---

## Layer

**Layer**: Frontend (`front/grant-portal/`)
**Workflow Reference**: `.cursor/rules/frontend/workflow.mdc` (placeholder - being established through this issue)

**Key Point**: This is the FIRST frontend implementation in Grant-Harness. We're establishing patterns that will be used for all future grant forms.

---

## Current State Analysis

### What's Been Completed ✅

Based on review of scratchpads, git commits, and issue comments:

1. **Next.js 15 + React 19 Project Setup**
   - Full project initialized with Shadcn UI components
   - Tailwind CSS configured
   - Route groups for Phase 1 `(public)` structure
   - Build passing with zero TypeScript errors

2. **IGP Complete 7-Step Schema**
   - `front/grant-portal/src/lib/schemas/igp-commercialisation.ts`
   - All validation rules matching government requirements
   - Character limits verified and implemented
   - Cross-field budget validation

3. **Step 1: Eligibility Check - FULLY IMPLEMENTED**
   - `front/grant-portal/src/app/(public)/applications/igp-commercialisation/step1/page.tsx`
   - 9 eligibility questions with radio inputs
   - Conditional logic (advisory number field)
   - Auto-save to LocalStorage
   - Form validation with inline errors

4. **Form Infrastructure**
   - `IGPFormContext` - auto-save, step tracking, clear
   - `FormProgress` component - visual progress bar
   - `FormNavigation` component - Previous/Next/Save buttons
   - LocalStorage utilities

5. **Landing Page**
   - Professional grant directory UI
   - IGP grant card with details
   - BBI placeholder

6. **Documentation**
   - ✅ README.md with setup instructions
   - ✅ E2E testing plan (300+ lines)
   - ✅ Progress summaries
   - ✅ User journey & UX architecture
   - ✅ ADR-1006 for scalability
   - ✅ Dual-format concept documented (future Phase 2-3)

### What's Pending ⏳

1. **Steps 2-7 Implementation**
   - Step 2: Organization Details (22 fields) - **BLOCKING** (404 error)
   - Step 3: Business Information (16 fields)
   - Step 4: Project Overview (12 fields)
   - Step 5: Project Budget (10 fields with complex validation)
   - Step 6: Assessment Criteria (4 long-form responses)
   - Step 7: Contact & Declaration (12 fields)

2. **E2E Testing Implementation**
   - Playwright tests not yet created
   - Test plan documented but not implemented
   - **Per issue comment**: "Ensure testing includes an end to end walk through by Claude confirming all pages open and character limits are correctly set"

3. **Dual-Format Concept (Future Issue)**
   - Per issue comment: "Dual form approach - please create a new issue to develop this concept"
   - Already documented in `.claude/scratchpads/issue-02-dual-format-concept.md`
   - **Out of scope for this issue** - defer to new GitHub issue

---

## Issue Requirements Analysis

### From Issue Description

**Week 2 Tasks**:
- [ ] Day 8: Form Analysis (IGP) ✅ DONE
- [ ] Day 9-10: NextJS Form Generation (IGP) ⏳ IN PROGRESS (Step 1 done, Steps 2-7 pending)
- [ ] Day 11-12: Form Replication (BBI or second grant) ❌ NOT STARTED

**Success Criteria**:
- ✅ 2 NextJS forms render in browser (IGP Step 1 done, need Steps 2-7 + BBI)
- ⏳ Forms match government portal structure (need to verify)
- ⏳ Multi-step navigation works (need Steps 2-7 to test)
- ⏳ Form validation with Zod (implemented, need to test all steps)
- ⏳ LocalStorage persistence (implemented, need to test)
- ❌ Stakeholder confirms "This looks like the real form" (needs testing)

### From Issue Comments

**Comment 1** (WhisperLooms):
- Recommends IGP + BBI as the two grants
- IGP: $100K-$5M, medium complexity, 5-8 steps
- BBI: $100K-$50M, high complexity, 10-15 steps
- Validates schema-driven generation at different scales

**Comment 2** (WhisperLooms):
- "Dual form approach - please create a new issue to develop this concept"
- Reference: `.claude/scratchpads/issue-02-dual-format-concept.md`
- **ACTION REQUIRED**: Create separate GitHub issue for dual-format (Government vs Collaboration)

**Comment 3** (WhisperLooms):
- **CRITICAL**: "Ensure testing includes an end to end walk through by Claude confirming all pages open and character limits are correctly set"
- This means we need to:
  1. Implement all steps (2-7)
  2. Test complete flow manually
  3. Verify character limits work in UI
  4. Create automated E2E tests

---

## ADR Reference

**Existing ADRs** (Implementation of):
- ✅ ADR-1001: React Hook Form + Shadcn UI Foundation
- ✅ ADR-1002: Schema-Driven Form Generation
- ✅ ADR-1003: Multi-Step Form State Management
- ✅ ADR-1005: PDF Export Strategy (for Week 4)
- ✅ ADR-1006: URL Structure Scalability

**ADR-1004** (Collaboration Backend): Currently "Proposed" - needs decision on Supabase vs Firebase for Week 3-4.

**New ADR Required**: **NO** - This is pure implementation of existing architectural decisions.

---

## Testing Strategy

**Test Framework**: Playwright E2E Tests
**Test Mode**: Visual + Functional

### Test Commands

```bash
# Frontend E2E tests
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
1. ✅ IGP form renders all 7 steps (currently only Step 1)
2. ❌ BBI form renders all 10-15 steps (not started)
3. ⏳ Multi-step navigation works (need Steps 2-7)
4. ⏳ Form validation with Zod errors displayed (need to test all steps)
5. ⏳ LocalStorage persistence (implemented, need to test)
6. ⏳ All field types render correctly (need to test all steps)

**Visual Compliance** (MANDATORY per /issue protocol):
- ⏳ Forms match government portal structure
- ⏳ Shadcn UI styling applied consistently
- ⏳ No console errors
- ⏳ Responsive design (desktop + tablet)
- ❌ Stakeholder confirms: "This looks like the real form"

### Evidence Locations

- `front/grant-portal/tests/e2e/` - Playwright test files (to be created)
- `front/grant-portal/tests/screenshots/` - Visual evidence (to be created)
- `.claude/scratchpads/issue-02-final-testing-and-completion.md` - Test execution logs (this file)

---

## Implementation Plan

### Task 1: Install Frontend Dependencies & Verify Build

**Goal**: Ensure development environment is ready

```bash
cd front/grant-portal
npm install
npm run build  # Verify no TypeScript errors
npm run dev    # Start dev server at http://localhost:3000
```

**Success Criteria**:
- ✅ All dependencies installed
- ✅ Build passes with zero errors
- ✅ Dev server starts successfully

### Task 2: Implement Steps 2-7 (Government Format)

**Priority Order** (following Step 1 pattern):

#### Step 2: Organization Details (22 fields)
**File**: `front/grant-portal/src/app/(public)/applications/igp-commercialisation/step2/page.tsx`

**Fields**:
- ABN (11 digits)
- Business address (street, suburb, state, postcode)
- Postal address (conditional if different)
- Financial data (turnover, total assets)
- Employee/contractor counts
- Indigenous status
- Conditional logic for "existed complete financial year"

**Pattern**: Copy Step 1 structure, replace form fields

#### Step 3: Business Information (16 fields)
**Fields**:
- Business description (50-500 chars)
- Website/video URLs
- Holding company details (conditional)
- 3 years trading performance
- Women-owned/led status

#### Step 4: Project Overview (12 fields)
**Fields**:
- Project title (10-100 chars)
- Brief description (50-200 chars)
- Detailed description (200-2000 chars)
- Commercialization stage
- NRF priority area
- Project dates, duration (12-24 months)
- Location

#### Step 5: Project Budget (10 fields with complex validation)
**Fields**:
- 6 cost categories (labour, contracts, capitalised, travel, other)
- Cross-field validation (totals must match)
- Percentage limits (labour on-costs ≤30%, travel ≤10%, capitalised ≤25%)
- Grant amount sought ($100K-$5M)

**CRITICAL**: Budget validation is most complex - requires custom refine() logic

#### Step 6: Assessment Criteria (4 long-form responses)
**Fields**:
- 4 criteria responses (200-5000 chars each)
- Criteria 1: Alignment with NRF priorities
- Criteria 2: Capacity to deliver
- Criteria 3: Market opportunity
- Criteria 4: Economic benefits

#### Step 7: Contact & Declaration (12 fields + Submit)
**Fields**:
- Primary contact details (name, position, email, phone)
- Bank account details (BSB 6 digits, account 6-10 digits)
- Conflict of interest declaration
- Privacy agreement + applicant declaration checkboxes
- **FINAL SUBMIT BUTTON**

**Success Criteria for All Steps**:
- ✅ All steps render without errors
- ✅ Navigation Previous/Next works
- ✅ Form validation displays inline errors
- ✅ Auto-save to LocalStorage on field change
- ✅ Data persists across page reloads

### Task 3: Manual End-to-End Testing

**Per issue comment requirement**: "Claude confirming all pages open and character limits are correctly set"

**Test Flow**:
1. Open http://localhost:3000
2. Click "Start Application" for IGP
3. **Step 1**: Fill eligibility (9 fields) → Click Next
4. **Step 2**: Fill organization (22 fields) → Click Next
5. **Step 3**: Fill business info (16 fields) → Click Next
6. **Step 4**: Fill project overview (12 fields) → Click Next
7. **Step 5**: Fill budget (10 fields, test cross-validation) → Click Next
8. **Step 6**: Fill assessment criteria (4 long responses) → Click Next
9. **Step 7**: Fill contact/declaration → Click Submit

**Character Limit Testing** (per comment requirement):
- Business description: Test 50 min, 500 max, 501 invalid
- Project brief: Test 50 min, 200 max, 201 invalid
- Project detailed: Test 200 min, 2000 max, 2001 invalid
- Assessment criteria: Test 200 min, 5000 max, 5001 invalid
- Contact name: Test 2 min, 100 max, 101 invalid

**LocalStorage Persistence Testing**:
- Fill Step 1-3
- Refresh page → Should restore to Step 3 with data
- Go back to Step 1 → Data should persist
- Click "Save Draft" → Reload → Data should persist

**Visual Compliance**:
- Take full-page screenshots of all 7 steps
- Verify Shadcn UI styling consistent
- Check console for errors
- Test responsive design (resize to 768px)

**Evidence**:
- Document all test results in this scratchpad
- Include screenshots in PR description
- Note any bugs or issues found

### Task 4: Implement Automated E2E Tests (Playwright)

**Reference**: `.claude/scratchpads/issue-02-e2e-testing-plan.md`

**Priority Tests** (Week 2 Essential):
1. Happy Path - Complete Application (landing → step 1 → ... → step 7 → submit)
2. Navigation - Previous/Next Buttons
3. Required Fields Validation
4. Resume After Page Reload
5. Character Limits (business description, project descriptions, assessment criteria)

**Implementation**:
```bash
cd front/grant-portal
npm install @playwright/test --save-dev
npx playwright install

# Create test files
mkdir -p tests/e2e
# Implement tests per plan
```

**Files to Create**:
- `tests/e2e/igp-application-flow.spec.ts` - Full form flow
- `tests/e2e/igp-form-validation.spec.ts` - Validation rules
- `tests/e2e/igp-form-persistence.spec.ts` - LocalStorage
- `tests/e2e/helpers.ts` - Test utilities

**Success Criteria**:
- ✅ All test suites pass
- ✅ Tests run on Chrome, Firefox, Safari
- ✅ Test evidence in `front/grant-portal/tests/playwright-report/`

### Task 5: BBI Form (Optional - If Time Permits)

**Status**: Lower priority than completing IGP + testing

**If we proceed**:
1. Analyze BBI grant documents
2. Create `front/grant-portal/src/lib/schemas/battery-breakthrough.ts`
3. Create route: `front/grant-portal/src/app/(public)/applications/battery-breakthrough/`
4. Reuse DynamicForm components
5. Estimated 10-15 steps (more complex than IGP)

**Recommendation**: Focus on completing IGP with full testing first. BBI can be added in a follow-up PR if needed.

### Task 6: Create Dual-Format Concept GitHub Issue

**Per issue comment**: "Please create a new issue to develop this concept"

**Reference**: `.claude/scratchpads/issue-02-dual-format-concept.md`

**Action**: Use `gh issue create` to create new issue with:
- Title: "Implement Collaboration Format for AI-Assisted Application Drafting"
- Body: Reference dual-format concept document
- Labels: enhancement, Phase 2
- Milestone: Week 3-4

---

## Success Criteria (Week 2 Deliverables)

From issue description:

- ⏳ `front/grant-portal/` Next.js app initialized ✅ DONE
- ⏳ Shadcn UI components installed and configured ✅ DONE
- ⏳ DynamicForm component renders schema-driven forms ⏳ PARTIALLY (Step 1 done)
- ⏳ IGP form (7 steps) complete and functional ⏳ IN PROGRESS (1/7 steps)
- ❌ BBI form (10-15 steps) complete and functional ❌ NOT STARTED
- ⏳ Multi-step navigation with LocalStorage persistence ✅ INFRASTRUCTURE DONE (need Steps 2-7 to test)
- ⏳ Form validation with Zod + error display ✅ IMPLEMENTED (need to test all steps)
- ❌ Stakeholder confirms visual accuracy ❌ PENDING TESTING

**Revised Success Criteria** (based on current state):

**Must Have** (Week 2 completion):
- ✅ IGP form all 7 steps implemented and functional
- ✅ Manual end-to-end test completed by Claude
- ✅ Character limits verified to work in UI
- ✅ Automated E2E tests passing (at minimum: happy path, validation, persistence)
- ✅ All steps visually consistent with Shadcn UI
- ✅ No console errors
- ✅ README.md with setup instructions

**Should Have** (if time permits):
- ⏳ BBI form schema created
- ⏳ BBI form partial implementation (at least 3-5 steps)

**Could Have** (defer to future):
- Dual-format collaboration mode (separate GitHub issue)
- Advanced validation error messaging
- Form submission to backend API (Phase 2)

---

## Known Issues & Risks

### Critical Issues

**1. Step 2 404 Error** (BLOCKING)
- **Issue**: Clicking "Next" on Step 1 navigates to non-existent `/step2`
- **Fix**: Create Step 2 implementation
- **Priority**: HIGHEST - blocking all form flow testing

**2. E2E Tests Not Implemented**
- **Issue**: Testing plan exists but no actual Playwright tests
- **Fix**: Implement priority tests per plan
- **Priority**: HIGH - required per issue comment

**3. Character Limits Not Verified in UI**
- **Issue**: Schema has limits but need to test they work in browser
- **Fix**: Manual testing + E2E tests for each field type
- **Priority**: HIGH - explicitly requested in issue comment

### Risks & Mitigations

**Risk 1**: BBI form may be too complex for Week 2 timeline
- **Mitigation**: Focus on IGP completion first, defer BBI if needed
- **Acceptable**: Issue says "2 forms" but IGP with 7 steps + full testing is significant work

**Risk 2**: Manual testing may reveal UX issues requiring refactoring
- **Mitigation**: Keep changes minimal, document issues for Week 3
- **Acceptable**: Week 2 is about proving form pattern, not perfection

**Risk 3**: Playwright tests may be time-consuming to implement
- **Mitigation**: Implement priority tests only (happy path, validation, persistence)
- **Acceptable**: Can expand test coverage in Week 3

---

## Routing Plan

**Complexity**: Medium-High (6 remaining form steps + testing)

**Agent Routing**: Direct implementation (no specialized agents needed)

**Recommendation**:
1. Implement Steps 2-7 following Step 1 pattern (straightforward)
2. Manual testing to verify all works
3. Automated E2E tests for critical paths
4. Create dual-format GitHub issue

---

## Test Execution Evidence

[To be added during implementation]

### Manual Testing Results

**Test Date**: [TBD]
**Tester**: Claude
**Browser**: Chrome [version]

#### Landing Page
- [ ] Loads at http://localhost:3000
- [ ] IGP grant card displays with details
- [ ] "Start Application" button works

#### Step 1: Eligibility Check
- [ ] All 9 questions render
- [ ] Radio buttons selectable
- [ ] Advisory number field appears conditionally
- [ ] Validation errors display
- [ ] Auto-save works
- [ ] Next button navigates to Step 2

#### Step 2: Organization Details
- [ ] All 22 fields render
- [ ] ABN validation (11 digits)
- [ ] Conditional postal address works
- [ ] Previous/Next navigation works
- [ ] Data persists on reload

#### Step 3: Business Information
- [ ] All 16 fields render
- [ ] Character limit: Business description (50-500)
- [ ] URL validation (website, video)
- [ ] Conditional holding company fields
- [ ] Previous/Next navigation works

#### Step 4: Project Overview
- [ ] All 12 fields render
- [ ] Character limit: Project title (10-100)
- [ ] Character limit: Brief description (50-200)
- [ ] Character limit: Detailed description (200-2000)
- [ ] Character limit: Expected outcomes (100-1000)
- [ ] Date validation
- [ ] Previous/Next navigation works

#### Step 5: Project Budget
- [ ] All 10 fields render
- [ ] Cross-field validation: Labour on-costs ≤30%
- [ ] Cross-field validation: Travel ≤10%
- [ ] Cross-field validation: Capitalised ≤25%
- [ ] Funding range validation ($100K-$5M)
- [ ] Minimum total expenditure ($200K)
- [ ] Previous/Next navigation works

#### Step 6: Assessment Criteria
- [ ] All 4 criteria fields render
- [ ] Character limit: Each response (200-5000)
- [ ] Textarea displays character count
- [ ] Previous/Next navigation works

#### Step 7: Contact & Declaration
- [ ] All 12 fields render
- [ ] Email validation
- [ ] Phone validation
- [ ] BSB validation (6 digits)
- [ ] Account number validation (6-10 digits)
- [ ] Checkboxes for declarations
- [ ] Submit button works

#### LocalStorage Persistence
- [ ] Data saves on field change
- [ ] Page reload restores current step
- [ ] Page reload restores form data
- [ ] Save Draft button works

#### Visual Compliance
- [ ] Consistent Shadcn UI styling
- [ ] No console errors
- [ ] Responsive at 768px (tablet)
- [ ] Progress bar shows correct step
- [ ] Navigation buttons styled correctly

### Character Limit Testing Results

**Business Description** (Step 3):
- [ ] 49 chars: Shows error "must be at least 50"
- [ ] 50 chars: Accepts (minimum)
- [ ] 500 chars: Accepts (maximum)
- [ ] 501 chars: Shows error "must be no more than 500"

**Project Brief Description** (Step 4):
- [ ] 49 chars: Error
- [ ] 50 chars: Accept
- [ ] 200 chars: Accept
- [ ] 201 chars: Error

**Project Detailed Description** (Step 4):
- [ ] 199 chars: Error
- [ ] 200 chars: Accept
- [ ] 2000 chars: Accept
- [ ] 2001 chars: Error

**Assessment Criteria Responses** (Step 6):
- [ ] 199 chars: Error
- [ ] 200 chars: Accept
- [ ] 5000 chars: Accept
- [ ] 5001 chars: Error

### Automated E2E Test Results

[To be added after Playwright implementation]

```bash
# Test execution command
cd front/grant-portal
npx playwright test

# Expected output:
# ✓ igp-application-flow.spec.ts (X tests)
# ✓ igp-form-validation.spec.ts (X tests)
# ✓ igp-form-persistence.spec.ts (X tests)
```

---

## Next Immediate Actions

**Priority 1** (BLOCKING):
1. Install frontend dependencies: `cd front/grant-portal && npm install`
2. Verify build: `npm run build`
3. Start dev server: `npm run dev`

**Priority 2** (CRITICAL):
4. Implement Step 2: Organization Details (fix 404 error)
5. Implement Steps 3-7 following Step 1 pattern
6. Manual end-to-end testing (all steps + character limits)

**Priority 3** (REQUIRED):
7. Implement Playwright E2E tests (priority tests)
8. Verify all tests pass
9. Document test evidence in this scratchpad

**Priority 4** (CLEANUP):
10. Create GitHub issue for dual-format concept
11. Update scratchpads with final status
12. Prepare for PR creation

---

## PR Preparation Checklist

Before creating PR:

**Code Quality**:
- [ ] All TypeScript errors resolved
- [ ] ESLint passing
- [ ] Build successful
- [ ] No console errors in browser

**Testing**:
- [ ] Manual E2E test completed (all 7 steps)
- [ ] Character limits verified
- [ ] LocalStorage persistence tested
- [ ] Automated E2E tests passing
- [ ] Visual screenshots taken

**Documentation**:
- [ ] README.md has setup instructions
- [ ] Test evidence in scratchpad
- [ ] ADRs up to date
- [ ] Known issues documented

**Commit Quality**:
- [ ] Commit messages follow Conventional Commits
- [ ] No unnecessary files committed
- [ ] .gitignore updated if needed

---

**Last Updated**: 2025-11-13
**Status**: Analysis Complete - Ready for Implementation
**Next Action**: Install dependencies and implement Steps 2-7
