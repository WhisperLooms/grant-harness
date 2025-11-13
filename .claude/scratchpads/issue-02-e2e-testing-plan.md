# Issue #2: E2E Testing Plan - IGP Application Form

**Document Purpose**: Comprehensive Playwright E2E test scenarios for IGP form
**Owner**: Testing Machine (separate machine will execute)
**Priority**: HIGH - Required before considering form complete
**Status**: Ready for Implementation

---

## Test Environment Setup

### Prerequisites
```bash
cd front/grant-portal
npm install @playwright/test --save-dev
npx playwright install  # Install browsers
```

### Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Test Suite 1: Full Application Flow

**File**: `tests/e2e/igp-application-flow.spec.ts`
**Purpose**: End-to-end user journey from landing page to form submission

### Test Case 1.1: Happy Path - Complete Application
```typescript
test('should complete full IGP application from start to finish', async ({ page }) => {
  // 1. Landing page
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Grant Portal');

  // 2. Find IGP grant card
  const igpCard = page.locator('[data-testid="grant-card-igp-commercialisation"]');
  await expect(igpCard).toBeVisible();
  await expect(igpCard.locator('h3')).toContainText('Industry Growth Program');

  // 3. Start application
  await igpCard.locator('button:has-text("Start Application")').click();
  await expect(page).toHaveURL(/\/applications\/igp-commercialisation\/step1/);

  // 4. Step 1: Eligibility Check
  await expect(page.locator('h2')).toContainText('Step 1: Eligibility Check');
  await page.locator('input[value="company_incorporated_australia"]').check();
  await page.locator('input[value="no"]').first().check(); // No advisory report
  await page.locator('input[value="yes"]').nth(1).check(); // Non-tax-exempt
  await page.locator('input[value="yes"]').nth(2).check(); // GST registered
  await page.locator('input[value="yes"]').nth(3).check(); // Innovative product in NRF
  await page.locator('input[value="yes"]').nth(4).check(); // Turnover under $20M
  await page.locator('input[value="yes"]').nth(5).check(); // IP ownership
  await page.locator('input[value="yes"]').nth(6).check(); // Funding evidence

  // 5. Navigate to Step 2
  await page.locator('button:has-text("Next")').click();
  await expect(page).toHaveURL(/\/applications\/igp-commercialisation\/step2/);
  await expect(page.locator('h2')).toContainText('Step 2: Organization Details');

  // 6. Fill Step 2 (ABN, addresses, financial data)
  // ... (to be implemented once Step 2 exists)

  // 7. Continue through all steps
  // ... (Steps 3-7)

  // 8. Final submission
  await page.locator('button:has-text("Submit Application")').click();
  await expect(page.locator('[data-testid="submission-success"]')).toBeVisible();
});
```

### Test Case 1.2: Navigation - Previous/Next Buttons
```typescript
test('should navigate between steps using Previous/Next buttons', async ({ page }) => {
  await page.goto('/applications/igp-commercialisation/step1');

  // Complete Step 1
  await fillEligibilityForm(page);
  await page.locator('button:has-text("Next")').click();
  await expect(page).toHaveURL(/step2/);

  // Go back to Step 1
  await page.locator('button:has-text("Previous")').click();
  await expect(page).toHaveURL(/step1/);

  // Data should persist
  const entityTypeChecked = await page.locator('input[value="company_incorporated_australia"]').isChecked();
  expect(entityTypeChecked).toBe(true);
});
```

### Test Case 1.3: Navigation - Progress Indicator Clicks
```typescript
test('should navigate to step by clicking progress indicator', async ({ page }) => {
  await page.goto('/applications/igp-commercialisation/step1');
  await fillEligibilityForm(page);
  await page.locator('button:has-text("Next")').click(); // Go to Step 2

  // Click Step 1 in progress indicator
  await page.locator('[data-testid="step-indicator-1"]').click();
  await expect(page).toHaveURL(/step1/);

  // Should show completed state
  await expect(page.locator('[data-testid="step-indicator-1"] svg')).toBeVisible(); // Check icon
});
```

---

## Test Suite 2: Form Validation

**File**: `tests/e2e/igp-form-validation.spec.ts`
**Purpose**: Verify all validation rules work correctly

### Test Case 2.1: Required Fields
```typescript
test('should show validation errors for required fields', async ({ page }) => {
  await page.goto('/applications/igp-commercialisation/step1');

  // Try to proceed without filling anything
  await page.locator('button:has-text("Next")').click();

  // Should show error messages
  await expect(page.locator('text=Please select your entity type')).toBeVisible();
  await expect(page.locator('text=Please indicate if you received an Advisory Service report')).toBeVisible();

  // Should NOT navigate to Step 2
  await expect(page).toHaveURL(/step1/);
});
```

### Test Case 2.2: Conditional Field Validation
```typescript
test('should validate advisory number when "Yes" is selected', async ({ page }) => {
  await page.goto('/applications/igp-commercialisation/step1');

  // Select "Yes" for advisory report
  await page.locator('input[value="yes"]').first().check();

  // Advisory number field should appear
  await expect(page.locator('input[placeholder*="IGP-ADV"]')).toBeVisible();

  // Try to submit without advisory number
  await fillEligibilityFormPartial(page); // Fill other fields
  await page.locator('button:has-text("Next")').click();

  // Should show error for missing advisory number
  await expect(page.locator('text=Application number required')).toBeVisible();
});
```

### Test Case 2.3: Character Limits (Step 3 - Business Description)
```typescript
test('should enforce character limits on text fields', async ({ page }) => {
  // Navigate to Step 3 (Business Information)
  await navigateToStep(page, 3);

  const textarea = page.locator('textarea[name="businessDescription"]');

  // Test minimum (50 chars)
  await textarea.fill('Short'); // 5 chars
  await page.locator('button:has-text("Next")').click();
  await expect(page.locator('text=Business description must be at least 50 characters')).toBeVisible();

  // Test maximum (500 chars)
  const longText = 'A'.repeat(501);
  await textarea.fill(longText);
  await page.locator('button:has-text("Next")').click();
  await expect(page.locator('text=Business description must be no more than 500 characters')).toBeVisible();

  // Test valid length (between 50-500)
  const validText = 'A'.repeat(250);
  await textarea.fill(validText);
  await page.locator('button:has-text("Next")').click();
  await expect(page).toHaveURL(/step4/); // Should proceed
});
```

### Test Case 2.4: Numeric Validation (Step 5 - Budget)
```typescript
test('should enforce budget validation rules', async ({ page }) => {
  await navigateToStep(page, 5);

  // Test minimum total expenditure ($200K)
  await page.locator('input[name="totalEligibleExpenditure"]').fill('100000');
  await page.locator('button:has-text("Next")').click();
  await expect(page.locator('text=Minimum total eligible expenditure is $200,000')).toBeVisible();

  // Test grant amount range ($100K-$5M)
  await page.locator('input[name="grantAmountSought"]').fill('50000');
  await page.locator('button:has-text("Next")').click();
  await expect(page.locator('text=Minimum grant amount is $100,000')).toBeVisible();

  await page.locator('input[name="grantAmountSought"]').fill('6000000');
  await page.locator('button:has-text("Next")').click();
  await expect(page.locator('text=Maximum grant amount is $5,000,000')).toBeVisible();

  // Test labour on-costs limit (30% of labour costs)
  await page.locator('input[name="labourCosts"]').fill('100000');
  await page.locator('input[name="labourOnCosts"]').fill('40000'); // 40% (invalid)
  await page.locator('button:has-text("Next")').click();
  await expect(page.locator('text=Labour on-costs limited to 30% of labour costs')).toBeVisible();

  // Test travel limit (10% of total)
  await page.locator('input[name="totalEligibleExpenditure"]').fill('500000');
  await page.locator('input[name="travelCosts"]').fill('60000'); // 12% (invalid)
  await page.locator('button:has-text("Next")').click();
  await expect(page.locator('text=Travel costs limited to 10% of total expenditure')).toBeVisible();
});
```

### Test Case 2.5: Email and Format Validation
```typescript
test('should validate email and special formats', async ({ page }) => {
  await navigateToStep(page, 7); // Contact & Declaration

  // Invalid email
  await page.locator('input[name="contactEmail"]').fill('invalid-email');
  await page.locator('button:has-text("Submit Application")').click();
  await expect(page.locator('text=Invalid email address')).toBeVisible();

  // ABN validation (Step 2)
  await navigateToStep(page, 2);
  await page.locator('input[name="abn"]').fill('12345'); // Only 5 digits
  await page.locator('button:has-text("Next")').click();
  await expect(page.locator('text=ABN must be 11 digits')).toBeVisible();

  // BSB validation (Step 7)
  await navigateToStep(page, 7);
  await page.locator('input[name="bankBsb"]').fill('12345'); // Only 5 digits
  await page.locator('button:has-text("Submit Application")').click();
  await expect(page.locator('text=BSB must be 6 digits')).toBeVisible();
});
```

---

## Test Suite 3: LocalStorage Persistence

**File**: `tests/e2e/igp-form-persistence.spec.ts`
**Purpose**: Verify form data saves and resumes correctly

### Test Case 3.1: Auto-Save on Field Change
```typescript
test('should auto-save form data to LocalStorage', async ({ page, context }) => {
  await page.goto('/applications/igp-commercialisation/step1');

  // Fill form
  await page.locator('input[value="company_incorporated_australia"]').check();
  await page.locator('input[value="yes"]').nth(1).check();

  // Wait for auto-save (debounced 1s)
  await page.waitForTimeout(1500);

  // Check LocalStorage
  const localStorage = await page.evaluate(() => window.localStorage.getItem('grant_portal_igp_commercialisation_form'));
  expect(localStorage).toBeTruthy();

  const formData = JSON.parse(localStorage);
  expect(formData.step1_eligibility.entityType).toBe('company_incorporated_australia');
  expect(formData.step1_eligibility.isNonTaxExempt).toBe('yes');
});
```

### Test Case 3.2: Resume After Page Reload
```typescript
test('should restore form data after page reload', async ({ page }) => {
  await page.goto('/applications/igp-commercialisation/step1');

  // Fill form
  await fillEligibilityForm(page);
  await page.locator('button:has-text("Next")').click();
  await expect(page).toHaveURL(/step2/);

  // Reload page
  await page.reload();

  // Should redirect to Step 2 (current step from LocalStorage)
  await expect(page).toHaveURL(/step2/);

  // Go back to Step 1
  await page.locator('button:has-text("Previous")').click();

  // Data should persist
  const entityTypeChecked = await page.locator('input[value="company_incorporated_australia"]').isChecked();
  expect(entityTypeChecked).toBe(true);
});
```

### Test Case 3.3: Save Draft Button
```typescript
test('should manually save draft when clicking Save Draft', async ({ page }) => {
  await page.goto('/applications/igp-commercialisation/step1');

  await fillEligibilityFormPartial(page); // Partially fill
  await page.locator('button:has-text("Save Draft")').click();

  // Should show confirmation (if implemented)
  // await expect(page.locator('text=Draft saved')).toBeVisible();

  // Reload and verify
  await page.reload();
  await expect(page).toHaveURL(/step1/); // Should stay on Step 1

  const entityTypeChecked = await page.locator('input[value="company_incorporated_australia"]').isChecked();
  expect(entityTypeChecked).toBe(true);
});
```

### Test Case 3.4: Clear Form Data
```typescript
test('should clear form data when requested', async ({ page }) => {
  await page.goto('/applications/igp-commercialisation/step1');

  // Fill form
  await fillEligibilityForm(page);

  // Clear form (if clear button exists, or via context menu)
  // await page.locator('button:has-text("Clear Form")').click();
  // await page.locator('button:has-text("Confirm")').click();

  // Manually clear for test
  await page.evaluate(() => {
    localStorage.removeItem('grant_portal_igp_commercialisation_form');
    localStorage.removeItem('grant_portal_igp_current_step');
  });

  await page.reload();

  // Should be empty
  const entityTypeChecked = await page.locator('input[value="company_incorporated_australia"]').isChecked();
  expect(entityTypeChecked).toBe(false);
});
```

---

## Test Suite 4: Error States and Edge Cases

**File**: `tests/e2e/igp-error-handling.spec.ts`
**Purpose**: Handle unexpected scenarios gracefully

### Test Case 4.1: Corrupted LocalStorage Data
```typescript
test('should handle corrupted LocalStorage data gracefully', async ({ page }) => {
  // Set invalid JSON in LocalStorage
  await page.goto('/applications/igp-commercialisation/step1');
  await page.evaluate(() => {
    localStorage.setItem('grant_portal_igp_commercialisation_form', 'INVALID_JSON{]');
  });

  await page.reload();

  // Should not crash, should show empty form
  await expect(page.locator('h2')).toContainText('Step 1: Eligibility Check');
  const entityTypeChecked = await page.locator('input[value="company_incorporated_australia"]').isChecked();
  expect(entityTypeChecked).toBe(false);
});
```

### Test Case 4.2: Direct URL Navigation to Invalid Step
```typescript
test('should handle direct navigation to non-existent step', async ({ page }) => {
  await page.goto('/applications/igp-commercialisation/step99');

  // Should redirect to Step 1 or show 404
  // Implementation dependent
});
```

### Test Case 4.3: Browser Back/Forward Buttons
```typescript
test('should handle browser back/forward navigation', async ({ page }) => {
  await page.goto('/applications/igp-commercialisation/step1');
  await fillEligibilityForm(page);
  await page.locator('button:has-text("Next")').click();
  await expect(page).toHaveURL(/step2/);

  // Browser back
  await page.goBack();
  await expect(page).toHaveURL(/step1/);

  // Data should persist
  const entityTypeChecked = await page.locator('input[value="company_incorporated_australia"]').isChecked();
  expect(entityTypeChecked).toBe(true);

  // Browser forward
  await page.goForward();
  await expect(page).toHaveURL(/step2/);
});
```

---

## Test Helpers / Fixtures

**File**: `tests/e2e/helpers.ts`
```typescript
import { Page } from '@playwright/test';

export async function fillEligibilityForm(page: Page) {
  await page.locator('input[value="company_incorporated_australia"]').check();
  await page.locator('input[value="no"]').first().check();
  await page.locator('input[value="yes"]').nth(1).check();
  await page.locator('input[value="yes"]').nth(2).check();
  await page.locator('input[value="yes"]').nth(3).check();
  await page.locator('input[value="yes"]').nth(4).check();
  await page.locator('input[value="yes"]').nth(5).check();
  await page.locator('input[value="yes"]').nth(6).check();
}

export async function fillEligibilityFormPartial(page: Page) {
  await page.locator('input[value="company_incorporated_australia"]').check();
  await page.locator('input[value="no"]').first().check();
  // Leave rest empty
}

export async function navigateToStep(page: Page, stepNumber: number) {
  // Helper to navigate directly to a step (assumes Step 1 is filled)
  await page.goto('/applications/igp-commercialisation/step1');
  await fillEligibilityForm(page);

  for (let i = 1; i < stepNumber; i++) {
    // Fill minimal data for each step and click Next
    // ... (to be implemented once all steps exist)
    await page.locator('button:has-text("Next")').click();
  }
}
```

---

## Test Execution Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/igp-application-flow.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Generate test report
npx playwright show-report

# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## Success Criteria

Before considering Issue #2 complete, all tests must:
- ✅ Pass on Chrome, Firefox, and Safari
- ✅ Handle validation errors correctly
- ✅ Persist data across page reloads
- ✅ Navigate between steps without data loss
- ✅ Complete full form flow from landing page to submission

---

## Implementation Priority

**Phase 1: Essential Tests (Week 2)**
1. Test Case 1.1: Happy Path - Complete Application
2. Test Case 1.2: Navigation - Previous/Next Buttons
3. Test Case 2.1: Required Fields Validation
4. Test Case 3.2: Resume After Page Reload

**Phase 2: Comprehensive Tests (Week 3)**
5. All validation tests (2.3-2.5)
6. All persistence tests (3.1-3.4)
7. Error handling tests (4.1-4.3)

**Phase 3: Edge Cases (Week 4)**
8. Browser compatibility tests
9. Performance tests (large forms)
10. Accessibility tests (keyboard navigation, screen readers)

---

**Document Status**: Ready for implementation on testing machine
**Next Action**: Set up Playwright config and begin implementing Test Suite 1
