# CRITICAL: Step 2 Still Requires Save+Refresh to Proceed

**Reported**: 2025-11-16 (Post PR #13 review fixes)
**Status**: 🔴 BLOCKING for final version
**Severity**: High (prototype workaround exists, production blocker)

---

## Problem Description

**Symptom**:
- Fill Step 2 completely with valid data
- Next button remains DISABLED
- Save Draft → Refresh Page (F5) → Next button becomes ENABLED
- **Same behavior as original Issue #12** despite fixes applied

**User Report**:
> "In order to proceed beyond Step 2, you must save draft and refresh page. This glitch needs to be fixed in final version."

---

## Root Cause Analysis

### What We Fixed (But Didn't Fully Solve)

**PR #13 Original Fix**:
- Added `useEffect(() => form.trigger(), [form])` to trigger validation after mount
- Removed split component pattern from Step 2
- TypeScript compilation passes

**Why It Still Fails**:

The issue is **hydration timing**:

1. **Step 2 component mounts**
2. **`useForm` initializes** with `defaultValues: formData.step2_organization`
   - At this point, `formData` is STILL EMPTY `{}` (hydration hasn't completed yet)
3. **`useEffect` runs** with `form.trigger()` - validates the EMPTY form
4. **THEN `isHydrated` becomes true** in context provider (after mount)
5. **`formData` updates** with localStorage data
6. **BUT `defaultValues` is only read ONCE on mount** - form never gets the data!

**Evidence**:
```typescript
// Context provider (igp-form-context.tsx)
const [isHydrated, setIsHydrated] = useState(false);

useEffect(() => {
  const savedFormData = getFromLocalStorage<Partial<IGPFormData>>(STORAGE_KEY);
  if (savedFormData) {
    setFormData(savedFormData); // Updates AFTER Step 2 has already mounted
  }
  setIsHydrated(true);
}, []); // Runs on mount, AFTER Step 2's useForm()
```

```typescript
// Step 2 (step2/page.tsx)
const { formData, ... } = useIGPFormContext(); // Empty on first render

const form = useForm<Step2OrganizationData>({
  defaultValues: formData.step2_organization || { /* defaults */ },
  // ☝️ This is EMPTY {} on mount because hydration hasn't run yet!
});

useEffect(() => {
  form.trigger(); // Validates empty form ❌
}, [form]);
```

---

## Why Save+Refresh Works

**Workaround Flow**:
1. User fills form → Click Save Draft → localStorage updated
2. User refreshes page (F5)
3. Context provider `useEffect` runs → loads from localStorage
4. Step 2 mounts with `formData` ALREADY populated (hydration complete)
5. `form.trigger()` validates the populated form ✅
6. Next button enables

**Key Insight**: On refresh, hydration completes BEFORE Step 2 mounts, so `defaultValues` gets the correct data.

---

## Proper Fix Required

### Option 1: Wait for Hydration Before Initializing Form (Recommended)

**Restore split component pattern** (the one I incorrectly removed):

```typescript
export default function Step2OrganizationPage() {
  const { formData, isHydrated, ... } = useIGPFormContext();

  // Wait for hydration to complete
  if (!isHydrated) {
    return <LoadingState />;
  }

  // Now formData is guaranteed to have localStorage data
  return <Step2Form formData={formData} ... />;
}

function Step2Form({ formData, ... }) {
  const form = useForm({
    defaultValues: formData.step2_organization || { /* defaults */ },
    // ☝️ Now this has the correct data from localStorage
  });

  useEffect(() => {
    form.trigger(); // Validates populated form ✅
  }, [form]);

  // ... rest of component
}
```

**Why This Works**:
- Component doesn't mount until `isHydrated === true`
- By then, `formData` is populated from localStorage
- `defaultValues` gets correct data on first render
- `form.trigger()` validates populated form

**Why I Removed It**: Mistakenly thought it was unnecessary complexity. It's actually REQUIRED for hydration safety.

---

### Option 2: Use form.reset() After Hydration (Alternative)

```typescript
const { formData, isHydrated, ... } = useIGPFormContext();

const form = useForm({
  defaultValues: formData.step2_organization || { /* defaults */ },
});

// Reset form with loaded data after hydration completes
useEffect(() => {
  if (isHydrated && formData.step2_organization) {
    form.reset(formData.step2_organization);
    form.trigger(); // Validate after reset
  }
}, [isHydrated, formData.step2_organization, form]);
```

**Why This Works**:
- Form initializes with empty defaults
- When `isHydrated` becomes true, `form.reset()` updates all values
- `form.trigger()` validates the updated form

**Tradeoff**: More complex dependency array, risk of infinite loops if not careful

---

### Option 3: Server-Side Rendering Safe Pattern (Future)

For production (Phase 2):
- Use Next.js server components for static parts
- Client component only for form logic
- Proper SSR/CSR hydration handling
- No localStorage (use database + server state)

---

## Testing Required

### Test Cases

**Test 1: Fresh Form (No localStorage)**
1. Clear localStorage
2. Navigate to Step 2
3. Fill all fields with valid data
4. **Expected**: Next button enables immediately ✅
5. Click Next → Navigate to Step 3

**Test 2: Returning User (localStorage Has Data)**
1. Navigate to Step 2 (localStorage has saved data from previous session)
2. **Expected**: Form pre-fills with saved data ✅
3. **Expected**: Next button is ENABLED immediately (form is valid) ✅
4. Click Next → Navigate to Step 3

**Test 3: Save Draft Mid-Entry**
1. Navigate to Step 2
2. Fill half the fields
3. Click Save Draft
4. **Expected**: Next button still disabled (form incomplete)
5. Fill remaining fields
6. **Expected**: Next button enables ✅
7. Click Next → Navigate to Step 3

**Test 4: Page Refresh Mid-Entry**
1. Fill half of Step 2 fields
2. Click Save Draft
3. Refresh page (F5)
4. **Expected**: Form pre-fills with partial data
5. **Expected**: Next button disabled (form still incomplete)
6. Fill remaining fields
7. **Expected**: Next button enables ✅

---

## Implementation Plan

### Immediate Fix (PR #13)

1. **Restore split component pattern to Step 2**
   - Add `isHydrated` check back
   - Separate loading state from form component
   - Ensure `defaultValues` gets localStorage data

2. **Apply to Steps 3-7 if needed**
   - Test if they have same issue
   - Apply same pattern for consistency

3. **Verify with manual testing**
   - Cannot rely on TypeScript compilation alone
   - MUST test browser behavior with localStorage

### Code Changes Required

**File**: `front/grant-portal/src/app/(public)/applications/igp-commercialisation/step2/page.tsx`

**Restore Pattern**:
```typescript
export default function Step2OrganizationPage() {
  const router = useRouter();
  const { formData, isHydrated, updateStepData, setCurrentStep, saveProgress } = useIGPFormContext();

  // Don't initialize form until after hydration completes
  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto">
        <FormProgress currentStep={2} totalSteps={IGP_STEPS.length} steps={IGP_STEPS.map((s) => ({ id: s.id, title: s.title }))} />
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Organization Details</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <Step2Form formData={formData} updateStepData={updateStepData} setCurrentStep={setCurrentStep} saveProgress={saveProgress} router={router} />;
}

// Separate component ensures useForm only called after hydration
function Step2Form({ formData, updateStepData, setCurrentStep, saveProgress, router }: {
  formData: Partial<IGPFormData>;
  updateStepData: (step: number, data: unknown) => void;
  setCurrentStep: (step: number) => void;
  saveProgress: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const form = useForm<Step2OrganizationData>({
    mode: "onChange",
    resolver: zodResolver(step2OrganizationSchema),
    defaultValues: formData.step2_organization || { /* defaults */ },
  });

  // Trigger validation after form loads (Issue #12 fix)
  useEffect(() => {
    form.trigger();
  }, [form]);

  // ... rest of component (unchanged)
}
```

---

## Verification Checklist

Before closing this issue:
- [ ] Split component pattern restored to Step 2
- [ ] `isHydrated` check prevents premature form initialization
- [ ] TypeScript compiles cleanly
- [ ] **CRITICAL**: Manual browser test - fill Step 2 → Next enables WITHOUT save+refresh
- [ ] Test with empty localStorage (fresh form)
- [ ] Test with existing localStorage (returning user)
- [ ] Test Steps 3-7 for same issue
- [ ] Apply same fix to Steps 3-7 if needed

---

## Notes

**Why Previous Fix Failed**:
- I focused on TypeScript errors and pattern consistency
- I didn't understand the hydration timing issue
- I removed the split component pattern thinking it was unnecessary
- **The split component pattern was actually THE SOLUTION**, not a problem

**Lesson Learned**:
- Always test browser behavior, not just TypeScript compilation
- Hydration timing in React is critical for forms with localStorage
- "Simpler" code isn't always better if it breaks functionality

**Priority**: 🔴 BLOCKING for final version (prototype can use save+refresh workaround)

---

**Last Updated**: 2025-11-16
**Status**: Needs immediate fix
**Action**: Restore split component pattern, test manually, commit
