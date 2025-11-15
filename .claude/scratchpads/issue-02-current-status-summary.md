# Issue #2: Current Status Summary

**Date**: 2025-11-13
**Branch**: `issue-2-form-replica`
**Last Commit**: `36af788` - docs: add dual-format concept for AI-assisted collaboration mode

---

## ✅ What's Been Completed

### 1. Dependencies Installed
```bash
cd front/grant-portal
npm install  # ✅ 428 packages installed successfully
```

### 2. Missing Infrastructure Files Created

**`src/lib/utils.ts`** - Shadcn UI utility
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**`src/lib/utils/localStorage.ts`** - Complete LocalStorage utilities (80 lines)
- `saveFormData()`, `loadFormData()`, `clearFormData()`
- `saveCurrentStep()`, `loadCurrentStep()`
- Legacy exports: `getFromLocalStorage`, `saveToLocalStorage`, `removeFromLocalStorage`
- STORAGE_KEYS constant

**`src/lib/schemas/igp-commercialisation.ts`** - **COMPLETE 7-STEP SCHEMA** (505 lines)

#### Step 1: Eligibility Check (9 fields)
```typescript
- entityType: enum (4 options)
- receivedAdvisoryReport: "yes" | "no"
- advisoryApplicationNumber: string (conditional)
- isNonTaxExempt: "yes" | "no"
- isGSTRegistered: "yes" | "no"
- hasInnovativeProductInNRF: "yes" | "no"
- annualTurnoverUnder20M: "yes" | "no"
- hasIPOwnership: "yes" | "no"
- canProvideFundingEvidence: "yes" | "no"
```

#### Step 2: Organization Details (22 fields)
```typescript
- abn: 11 digits
- legalEntityName, tradingName
- Business address: street, suburb, state, postcode
- Postal address: (conditional if different)
- Financial data: turnover, total assets (current + previous year)
- Employment: numberOfEmployees, numberOfContractors
- indigenousOwnership: enum (3 options)
```

#### Step 3: Business Information (16 fields)
```typescript
- businessDescription: min(50).max(500)
- companyWebsite, companyVideo: URL, max(200)
- Holding company: name, ABN (conditional)
- 3 years trading: revenue, gross profit, net profit (year 1-3)
- womenOwnershipStatus: enum (3 options)
```

#### Step 4: Project Overview (12 fields)
```typescript
- projectTitle: min(10).max(100)
- projectBriefDescription: min(50).max(200)
- projectDetailedDescription: min(200).max(2000)
- projectExpectedOutcomes: min(100).max(1000)
- commercializationStage: enum (5 options)
- nrfPriorityArea: enum (7 options)
- projectStartDate, projectEndDate: YYYY-MM-DD
- projectDurationMonths: min(12).max(24)
- projectLocationState, projectLocationSuburb
```

#### Step 5: Project Budget (10 fields) - **COMPLEX CROSS-VALIDATION**
```typescript
- labourCosts, labourOnCosts, contractCosts, capitalisedExpenditure, travelCosts, otherCosts
- totalEligibleExpenditure: min($200,000)
- grantAmountSought: min($100,000).max($5,000,000)
- applicantCashContribution
- otherGovernmentFunding (optional)

// Cross-field validation:
- labourOnCosts ≤ labourCosts * 0.3 (30% limit)
- travelCosts ≤ totalEligibleExpenditure * 0.1 (10% limit)
- capitalisedExpenditure ≤ totalEligibleExpenditure * 0.25 (25% limit)
- sum of costs ≈ totalEligibleExpenditure (1% variance allowed)
- grantAmountSought ≤ totalEligibleExpenditure
```

#### Step 6: Assessment Criteria (4 long-form responses)
```typescript
- criterion1Response: min(200).max(5000)  // Alignment with NRF
- criterion2Response: min(200).max(5000)  // Capacity to deliver
- criterion3Response: min(200).max(5000)  // Market opportunity
- criterion4Response: min(200).max(5000)  // Economic benefits
```

#### Step 7: Contact & Declaration (12 fields)
```typescript
- contactName: min(2).max(100)
- contactPosition: min(2).max(100)
- contactEmail: email()
- contactPhone: regex (8-20 chars)
- Bank details: accountName, bsb (6 digits), accountNumber (6-10 digits)
- hasConflictOfInterest: "yes" | "no"
- conflictOfInterestDetails: string (conditional)
- privacyAgreement: boolean (must be true)
- applicantDeclaration: boolean (must be true)
- authorizedOfficerName: string
```

### 3. Schema Field Names Fixed

Updated to match existing Step 1 implementation:
- ✅ `receivedAdvisoryReport` (not `hasAdvisoryReport`)
- ✅ `isGSTRegistered` (not `isGstRegistered`)
- ✅ `hasInnovativeProductInNRF` (not `hasInnovativeProductInNrf`)
- ✅ `annualTurnoverUnder20M` (not `hasTurnoverUnder20M`)
- ✅ `hasIPOwnership` (not `hasIpOwnership`)
- ✅ `canProvideFundingEvidence` (not `hasFundingEvidence`)

### 4. Legacy Exports Added

For compatibility with existing code:
```typescript
// Schema exports
export const step1EligibilitySchema = step1Schema;
export const step2OrganizationSchema = step2Schema;
export const step3BusinessSchema = step3Schema;
export const step4ProjectSchema = step4Schema;
export const step5BudgetSchema = step5Schema;
export const step6AssessmentSchema = step6Schema;
export const step7ContactSchema = step7Schema;

// Type exports
export type Step1EligibilityData = Step1Data;
export type Step2OrganizationData = Step2Data;
export type Step3BusinessData = Step3Data;
export type Step4ProjectData = Step4Data;
export type Step5BudgetData = Step5Data;
export type Step6AssessmentData = Step6Data;
export type Step7ContactData = Step7Data;

// Navigation metadata
export const IGP_STEPS = [
  { id: 1, title: "Eligibility Check", name: "eligibility" },
  { id: 2, title: "Organization Details", name: "organization" },
  { id: 3, title: "Business Information", name: "business" },
  { id: 4, title: "Project Overview", name: "project" },
  { id: 5, title: "Project Budget", name: "budget" },
  { id: 6, title: "Assessment Criteria", name: "assessment" },
  { id: 7, title: "Contact & Declaration", name: "contact" },
] as const;
```

### 5. Build Verified Successful

```bash
cd front/grant-portal
npm run build  # ✅ SUCCESS

Route (app)                                       Size  First Load JS
┌ ○ /                                          3.46 kB         105 kB
├ ○ /applications/igp-commercialisation        1.05 kB         103 kB
├ ○ /applications/igp-commercialisation/step1  15.9 kB         149 kB
```

**Note**: LocalStorage warnings during build are expected (server-side rendering limitation). Client-side code will work correctly.

---

## ⏳ What Still Needs to Be Done

### CRITICAL: Steps 2-7 Implementation

**Problem**: Step 1 works but clicking "Next" → 404 error (Step 2 doesn't exist yet)

**Solution**: Create 6 more step pages following Step 1 pattern

#### File Structure to Create:
```
front/grant-portal/src/app/(public)/applications/igp-commercialisation/
├── step1/
│   └── page.tsx  ✅ EXISTS
├── step2/
│   └── page.tsx  ❌ MISSING (22 fields: ABN, addresses, financial data)
├── step3/
│   └── page.tsx  ❌ MISSING (16 fields: business description, trading history)
├── step4/
│   └── page.tsx  ❌ MISSING (12 fields: project overview, dates, location)
├── step5/
│   └── page.tsx  ❌ MISSING (10 fields: budget breakdown, validation)
├── step6/
│   └── page.tsx  ❌ MISSING (4 criteria: long-form responses 200-5000 chars)
└── step7/
    └── page.tsx  ❌ MISSING (12 fields: contact, bank, declarations + submit)
```

### Pattern Template (Step 2 Example)

**File**: `src/app/(public)/applications/igp-commercialisation/step2/page.tsx`

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  step2OrganizationSchema,
  Step2OrganizationData,
  IGP_STEPS,
} from "@/lib/schemas/igp-commercialisation";
import { useIGPFormContext } from "../igp-form-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormProgress } from "@/components/forms/form-progress";
import { FormNavigation } from "@/components/forms/form-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Step2OrganizationPage() {
  const router = useRouter();
  const { formData, updateStepData, setCurrentStep, saveProgress } = useIGPFormContext();

  const form = useForm<Step2OrganizationData>({
    resolver: zodResolver(step2OrganizationSchema),
    defaultValues: formData.step2_organization || {
      abn: "",
      legalEntityName: "",
      tradingName: "",
      businessStreetAddress: "",
      businessSuburb: "",
      businessState: undefined,
      businessPostcode: "",
      postalAddressSameAsBusiness: true,
      mostRecentYearTurnover: 0,
      mostRecentYearTotalAssets: 0,
      existedCompleteFinancialYear: undefined,
      numberOfEmployees: 0,
      numberOfContractors: 0,
      indigenousOwnership: undefined,
    },
  });

  const postalAddressSameAsBusiness = form.watch("postalAddressSameAsBusiness");
  const existedCompleteFinancialYear = form.watch("existedCompleteFinancialYear");

  const onSubmit = (data: Step2OrganizationData) => {
    updateStepData(2, data);
    setCurrentStep(3);
    router.push("/applications/igp-commercialisation/step3");
  };

  const handlePrevious = () => {
    router.push("/applications/igp-commercialisation/step1");
  };

  const handleSaveDraft = () => {
    const currentData = form.getValues();
    updateStepData(2, currentData);
    saveProgress();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <FormProgress
        currentStep={2}
        totalSteps={IGP_STEPS.length}
        steps={IGP_STEPS.map((s) => ({ id: s.id, title: s.title }))}
      />

      <Card>
        <CardHeader>
          <CardTitle>Step 2: Organization Details</CardTitle>
          <CardDescription>
            Provide your organization's legal and financial information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* ABN */}
              <FormField
                control={form.control}
                name="abn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Australian Business Number (ABN)</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678901" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Legal Entity Name */}
              <FormField
                control={form.control}
                name="legalEntityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legal Entity Name</FormLabel>
                    <FormControl>
                      <Input placeholder="ACME Pty Ltd" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trading Name */}
              <FormField
                control={form.control}
                name="tradingName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trading Name</FormLabel>
                    <FormControl>
                      <Input placeholder="ACME Solutions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Address Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Business Address</h3>

                {/* Street Address */}
                <FormField
                  control={form.control}
                  name="businessStreetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Suburb */}
                <FormField
                  control={form.control}
                  name="businessSuburb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suburb</FormLabel>
                      <FormControl>
                        <Input placeholder="Melbourne" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* State */}
                  <FormField
                    control={form.control}
                    name="businessState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NSW">NSW</SelectItem>
                            <SelectItem value="VIC">VIC</SelectItem>
                            <SelectItem value="QLD">QLD</SelectItem>
                            <SelectItem value="SA">SA</SelectItem>
                            <SelectItem value="WA">WA</SelectItem>
                            <SelectItem value="TAS">TAS</SelectItem>
                            <SelectItem value="NT">NT</SelectItem>
                            <SelectItem value="ACT">ACT</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Postcode */}
                  <FormField
                    control={form.control}
                    name="businessPostcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input placeholder="3000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Postal Address Checkbox */}
              <FormField
                control={form.control}
                name="postalAddressSameAsBusiness"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Postal address is the same as business address
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {/* Conditional Postal Address Fields */}
              {!postalAddressSameAsBusiness && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Postal Address</h3>
                  {/* Add postal address fields here - same structure as business address */}
                </div>
              )}

              {/* Financial Data Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Financial Data</h3>

                {/* Most Recent Year Turnover */}
                <FormField
                  control={form.control}
                  name="mostRecentYearTurnover"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Most Recent Year Turnover ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1000000"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Continue with remaining 11 fields... */}
              </div>

              <FormNavigation
                currentStep={2}
                totalSteps={IGP_STEPS.length}
                onPrevious={handlePrevious}
                onSave={handleSaveDraft}
                canGoNext={form.formState.isValid}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Field Types to Use

**Schema**: All fields defined in `src/lib/schemas/igp-commercialisation.ts`

**Shadcn Components**:
- `Input` - Text, number fields
- `Select` - Dropdowns (state, entity type, enums)
- `Checkbox` - Boolean flags
- `Textarea` - Long-form text (business description, assessment criteria)
- `RadioGroup` - Yes/no questions

**Character Limit Display** (for Steps 3, 4, 6):
```tsx
<FormField
  control={form.control}
  name="businessDescription"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Business Description (50-500 characters)</FormLabel>
      <FormControl>
        <Textarea
          placeholder="Describe your business..."
          {...field}
          rows={5}
        />
      </FormControl>
      <FormDescription>
        {field.value?.length || 0} / 500 characters
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Testing Plan

### Manual Testing (After Steps 2-7 Complete)

**Per issue comment**: "Ensure testing includes an end to end walk through by Claude confirming all pages open and character limits are correctly set"

```bash
cd front/grant-portal
npm run dev  # Open http://localhost:3000
```

**Test Flow**:
1. Landing page → Click "Start Application" for IGP
2. Step 1: Fill 9 eligibility fields → Click "Next"
3. Step 2: Fill 22 organization fields → Click "Next"
4. Step 3: Fill 16 business fields + test character limits (50-500) → Click "Next"
5. Step 4: Fill 12 project fields + test character limits (50-200, 200-2000, 100-1000) → Click "Next"
6. Step 5: Fill 10 budget fields + test cross-validation → Click "Next"
7. Step 6: Fill 4 assessment criteria (200-5000 each) → Click "Next"
8. Step 7: Fill 12 contact/declaration fields → Click "Submit"

**Character Limit Tests** (per issue comment):
- Business description (Step 3): 49 chars = error, 50 = accept, 500 = accept, 501 = error
- Project brief (Step 4): 49 = error, 50 = accept, 200 = accept, 201 = error
- Project detailed (Step 4): 199 = error, 200 = accept, 2000 = accept, 2001 = error
- Assessment criteria (Step 6): 199 = error, 200 = accept, 5000 = accept, 5001 = error

**LocalStorage Persistence**:
- Fill Steps 1-3 → Refresh page → Should restore to Step 3 with data
- Go back to Step 1 → Data should persist
- Click "Save Draft" → Reload → Data should persist

### Automated E2E Tests (Playwright)

**Reference**: `.claude/scratchpads/issue-02-e2e-testing-plan.md` (300+ lines)

**Priority Tests**:
1. Happy Path - Complete Application
2. Navigation - Previous/Next Buttons
3. Required Fields Validation
4. Resume After Page Reload
5. Character Limits

---

## Dual-Format Concept (Future Issue)

**Per issue comment**: "Dual form approach - please create a new issue to develop this concept"

**Action**: Create GitHub issue after completing Steps 2-7

**Title**: "Implement Collaboration Format for AI-Assisted Application Drafting"

**Reference**: `.claude/scratchpads/issue-02-dual-format-concept.md` (617 lines)

**Summary**: Two formats for same form data:
1. **Government Format** (current) - Exact replica of official PDF
2. **Collaboration Format** (future Phase 2-3) - AI-assisted, per-field chat, document upload

---

## Success Criteria (Week 2)

From issue description:

- ⏳ `front/grant-portal/` Next.js app initialized ✅ DONE
- ⏳ Shadcn UI components installed and configured ✅ DONE
- ⏳ Complete 7-step IGP schema ✅ DONE
- ⏳ IGP form (7 steps) complete and functional ⏳ 1/7 steps implemented
- ❌ BBI form (10-15 steps) ❌ NOT STARTED (lower priority)
- ⏳ Multi-step navigation ✅ INFRASTRUCTURE READY
- ⏳ Form validation with Zod ✅ SCHEMA COMPLETE
- ⏳ LocalStorage persistence ✅ UTILITIES READY
- ❌ End-to-end testing ❌ PENDING Steps 2-7 completion

---

## Next Steps

1. **Implement Steps 2-7** (highest priority - fixes 404 error)
2. **Manual end-to-end test** (all 7 steps + character limits)
3. **Implement Playwright E2E tests** (priority tests)
4. **Create dual-format GitHub issue**
5. **Prepare PR** with test evidence

---

**Status**: Build verified successful. Complete 7-step schema created. Steps 2-7 need page implementations.
