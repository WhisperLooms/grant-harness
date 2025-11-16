# Issue #10: Known Issues from Week 2 Forms (Deferred to Week 3)

**Context**: Issues discovered during PR #13 review and manual testing of IGP Commercialisation 7-step form. These are non-blocking for Week 2 completion but should be addressed in Week 3 Streamlined Format (Issue #10).

---

## Step 6 (Budget) - Validation Dependency Issues

### Issue 1: Capital Expenditure Validation Timing

**Problem**:
- Capital expenditure field shows red error warning "Limited to 25% of total expenditure"
- Warning appears immediately, even when the value IS within 25% limit
- Warning persists until ALL other budget fields are filled in
- Poor UX: users see false errors before completing the form

**Root Cause**:
- Validation rule checks capital expenditure % against total expenditure
- Total expenditure calculation depends on ALL budget fields being filled
- Validation runs before dependencies are satisfied

**Expected Behavior**:
- Validation should wait until total expenditure is calculated
- OR show warning only if capital > 25% when total IS known
- OR defer validation until user attempts to click Next button

**Example**:
```
Capital Expenditure: $50,000
Total Expenditure: (incomplete - missing other fields)
Current: Shows "Limited to 25%" error immediately ❌
Expected: Wait until total is calculable, then validate ✅
```

---

### Issue 2: Travel Costs Validation Timing

**Problem**:
- Travel costs field shows red error warning "Must be less than 10%"
- Warning appears even when value IS less than 10%
- Warning persists until "Eligible Amount" field is filled in
- Same poor UX as Issue 1

**Root Cause**:
- Validation rule checks travel costs % against eligible amount
- Eligible amount may not be filled yet (or depends on other fields)
- Validation runs before dependencies are satisfied

**Expected Behavior**:
- Validation should wait until eligible amount is entered
- OR show warning only if travel > 10% when eligible amount IS known
- OR defer validation until user attempts to click Next button

**Example**:
```
Travel Costs: $5,000
Eligible Amount: (not filled yet)
Current: Shows "Must be less than 10%" error immediately ❌
Expected: Wait until eligible amount entered, then validate ✅
```

---

## Recommended Fixes for Issue #10

### Option 1: Conditional Validation (Preferred)

Update Zod schema to only validate percentages when dependencies are present:

```typescript
// Example for capital expenditure
capitalExpenditure: z.number().min(0).refine((val, ctx) => {
  const totalExpenditure = ctx.parent.totalExpenditure; // Calculate or get total
  if (totalExpenditure && totalExpenditure > 0) {
    return val <= totalExpenditure * 0.25;
  }
  return true; // Don't validate if total not available yet
}, {
  message: "Capital expenditure must not exceed 25% of total expenditure"
});
```

### Option 2: Defer Validation to Submit

- Remove real-time validation for percentage rules
- Add validation on Next button click
- Show clear error message if percentages exceed limits

### Option 3: Progressive Validation in Streamlined Format

For Issue #10 (Streamlined Format with AI chat):
- Use AI chat to guide user through budget allocation
- Calculate totals in real-time but defer validation warnings
- Show helpful hints instead of errors during entry
- Validate only when user confirms "I'm done with this section"

---

## Testing Evidence

**Discovered During**: PR #13 manual testing (2025-11-16)
**Tester**: User manual testing with IGP form
**Steps Affected**: Step 6 (Budget)
**Severity**: Non-blocking (users can still complete form, just confusing UX)
**Priority for Week 3**: Medium (improves UX, not critical for prototype)

---

## Related Files

**Schema File**: `front/grant-portal/src/lib/schemas/igp-commercialisation.ts`
- Look for `step6_budget` schema definition
- Capital expenditure and travel costs validation rules

**Page File**: `front/grant-portal/src/app/(public)/applications/igp-commercialisation/step6/page.tsx`
- Budget step UI
- Could add custom validation logic here

---

## Notes for Issue #10 Implementation

When implementing Streamlined Format (Week 3):
1. **Review all percentage-based validations** across Steps 2-7
2. **Use conditional validation** (only validate when dependencies present)
3. **Consider AI-guided progressive disclosure** for complex budget fields
4. **Test validation timing** with incomplete forms (don't show false errors)
5. **Add helpful hints** instead of error messages during entry

**Goal**: Week 3 Streamlined Format should feel conversational and helpful, not punishing users with premature validation errors.

---

**Last Updated**: 2025-11-16
**Status**: Documented for Issue #10
**Action Required**: Address during Week 3 Streamlined Format implementation
