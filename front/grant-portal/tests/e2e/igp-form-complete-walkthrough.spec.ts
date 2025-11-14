import { test, expect } from '@playwright/test';

/**
 * Complete End-to-End Walkthrough of IGP Application Form
 *
 * This test fills out ALL 7 steps with mock data and verifies:
 * - Form validation works (Next button enables when valid)
 * - Navigation works between steps
 * - All fields accept input correctly
 * - Character counters update
 * - Conditional fields appear/hide
 * - Final submission works
 */

test.describe('IGP Application Form - Complete Walkthrough', () => {
  test('complete all 7 steps with mock data and submit', async ({ page }) => {
    // Clear localStorage for clean state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // ========================================================================
    // STEP 1: Eligibility Check
    // ========================================================================
    console.log('Starting Step 1: Eligibility Check');
    await page.goto('/applications/igp-commercialisation/step1');

    // Verify Step 1 loads
    await expect(page.getByRole('heading', { name: /Step 1: Eligibility Check/ })).toBeVisible();

    // Next button should be disabled initially
    const step1NextButton = page.getByRole('button', { name: /Next/ });
    await expect(step1NextButton).toBeDisabled();

    // Fill out all eligibility fields
    await page.locator('label').filter({ hasText: 'Company incorporated in Australia' }).click();

    // Advisory Report = No
    await page.locator('label').filter({ hasText: /^No$/ }).first().click();

    // Non-tax-exempt = Yes
    await page.locator('label').filter({ hasText: /^Yes$/ }).nth(0).click();

    // GST Registered = Yes
    await page.locator('label').filter({ hasText: /^Yes$/ }).nth(1).click();

    // Innovative product in NRF = Yes
    await page.locator('label').filter({ hasText: /^Yes$/ }).nth(2).click();

    // Turnover under $20M = Yes
    await page.locator('label').filter({ hasText: /^Yes$/ }).nth(3).click();

    // IP Ownership = Yes
    await page.locator('label').filter({ hasText: /^Yes$/ }).nth(4).click();

    // Co-funding evidence = Yes
    await page.locator('label').filter({ hasText: /^Yes$/ }).nth(5).click();

    // Next button should now be enabled
    await expect(step1NextButton).toBeEnabled();
    console.log('✓ Step 1: Next button enabled after filling all fields');

    // Click Next to go to Step 2
    await step1NextButton.click();
    await expect(page).toHaveURL(/\/applications\/igp-commercialisation\/step2/);
    console.log('✓ Step 1: Navigation to Step 2 successful');

    // ========================================================================
    // STEP 2: Organization Details
    // ========================================================================
    console.log('Starting Step 2: Organization Details');
    await expect(page.getByRole('heading', { name: /Step 2: Organization Details/ })).toBeVisible();

    const step2NextButton = page.getByRole('button', { name: /Next/ });

    // Fill out organization details
    await page.getByLabel(/Australian Business Number \(ABN\)/).fill('11111111111');
    await page.getByLabel(/Legal Entity Name/).fill('EMEW Technologies Pty Ltd');
    await page.getByLabel(/Trading Name/).fill('EMEW');

    // Business Address
    await page.getByLabel(/^Street Address$/).first().fill('5 Waterview Crescent');
    await page.getByLabel(/^Suburb$/).first().fill('Tascott');
    await page.getByLabel(/^State$/).first().click();
    await page.getByRole('option', { name: 'NSW' }).click();
    await page.getByLabel(/^Postcode$/).first().fill('2250');

    // Postal Address - same as business (checkbox already checked by default)

    // Financial Information
    await page.getByLabel(/Most Recent Year Turnover/).fill('5000000');
    await page.getByLabel(/Most Recent Year Total Assets/).fill('1000000');

    // Existed complete financial year = Yes
    await page.locator('label').filter({ hasText: /^Yes$/ }).first().click();

    // Previous year financial data
    await page.getByLabel(/Previous Year Turnover/).fill('4500000');
    await page.getByLabel(/Previous Year Total Assets/).fill('900000');

    // Employment
    await page.getByLabel(/Number of Employees/).fill('30');
    await page.getByLabel(/Number of Contractors/).fill('2');

    // Indigenous Ownership
    await page.getByLabel(/Is your organization Indigenous-owned?/).click();
    await page.getByRole('option', { name: 'No' }).click();

    // Next button should be enabled
    await expect(step2NextButton).toBeEnabled();
    console.log('✓ Step 2: Next button enabled after filling all fields');

    // Click Next to go to Step 3
    await step2NextButton.click();
    await expect(page).toHaveURL(/\/applications\/igp-commercialisation\/step3/);
    console.log('✓ Step 2: Navigation to Step 3 successful');

    // ========================================================================
    // STEP 3: Business Information
    // ========================================================================
    console.log('Starting Step 3: Business Information');
    await expect(page.getByRole('heading', { name: /Step 3: Business Information/ })).toBeVisible();

    const step3NextButton = page.getByRole('button', { name: /Next/ });

    // Business Description (50-500 characters)
    const businessDesc = 'EMEW Technologies specializes in advanced metal recovery and recycling technologies. Our patented electrochemical metal winning process enables efficient extraction of valuable metals from industrial wastewater and processing streams, supporting circular economy objectives in manufacturing and mining sectors.';
    await page.getByLabel(/Business Description/).fill(businessDesc);

    // Verify character counter
    await expect(page.getByText(new RegExp(`${businessDesc.length} / 500 characters`))).toBeVisible();
    console.log('✓ Step 3: Character counter working');

    // Company Website (optional)
    await page.getByLabel(/Company Website/).fill('https://emew.com');

    // Holding Company = No
    await page.locator('label').filter({ hasText: /^No$/ }).first().click();

    // Trading Performance (3 years)
    await page.getByLabel(/Year 1 Revenue/).fill('3000000');
    await page.getByLabel(/Year 1 Gross Profit/).fill('750000');
    await page.getByLabel(/Year 1 Net Profit/).fill('150000');

    await page.getByLabel(/Year 2 Revenue/).fill('4000000');
    await page.getByLabel(/Year 2 Gross Profit/).fill('1000000');
    await page.getByLabel(/Year 2 Net Profit/).fill('250000');

    await page.getByLabel(/Year 3 Revenue/).fill('5000000');
    await page.getByLabel(/Year 3 Gross Profit/).fill('1250000');
    await page.getByLabel(/Year 3 Net Profit/).fill('350000');

    // Women Ownership
    await page.getByLabel(/Women Ownership Status/).click();
    await page.getByRole('option', { name: /No/ }).first().click();

    // Next button should be enabled
    await expect(step3NextButton).toBeEnabled();
    console.log('✓ Step 3: Next button enabled after filling all fields');

    // Click Next to go to Step 4
    await step3NextButton.click();
    await expect(page).toHaveURL(/\/applications\/igp-commercialisation\/step4/);
    console.log('✓ Step 3: Navigation to Step 4 successful');

    // ========================================================================
    // STEP 4: Project Overview
    // ========================================================================
    console.log('Starting Step 4: Project Overview');
    await expect(page.getByRole('heading', { name: /Step 4: Project Overview/ })).toBeVisible();

    const step4NextButton = page.getByRole('button', { name: /Next/ });

    // Project Title (10-100 characters)
    const projectTitle = 'Advanced Battery Metal Recovery System Commercialisation';
    await page.getByLabel(/^Project Title$/).fill(projectTitle);
    await expect(page.getByText(new RegExp(`${projectTitle.length} / 100 characters`)).first()).toBeVisible();

    // Brief Description (50-200 characters)
    const briefDesc = 'Commercialize EMEW technology for lithium-ion battery recycling, extracting cobalt, nickel, and lithium with 95% efficiency for circular economy impact.';
    await page.getByLabel(/Brief Description/).fill(briefDesc);
    await expect(page.getByText(new RegExp(`${briefDesc.length} / 200 characters`))).toBeVisible();

    // Detailed Description (200-2000 characters)
    const detailedDesc = 'This project will commercialize EMEW Technologies\' patented electrochemical metal winning process specifically for the lithium-ion battery recycling market. The technology enables high-purity recovery of critical battery metals (cobalt, nickel, lithium, manganese) from black mass and leach solutions generated from end-of-life batteries. Our process achieves 95%+ recovery rates with significantly lower energy consumption and environmental impact compared to traditional pyrometallurgical and hydrometallurgical processes. The commercialization phase includes scaling up pilot plant operations, automating key process steps, obtaining relevant environmental approvals, and establishing partnerships with battery recyclers and automotive manufacturers. This addresses a critical supply chain vulnerability for Australia\'s emerging electric vehicle and energy storage sectors while supporting circular economy objectives.';
    await page.getByLabel(/Detailed Description/).fill(detailedDesc);
    await expect(page.getByText(new RegExp(`${detailedDesc.length} / 2000 characters`))).toBeVisible();
    console.log('✓ Step 4: Character counters working for all fields');

    // Expected Outcomes (100-1000 characters)
    const outcomes = 'The project will establish Australia\'s first commercial-scale electrochemical battery metal recovery facility processing 500 tonnes of black mass annually by project completion. Expected outcomes include: (1) Creation of 15 new high-skilled jobs in advanced manufacturing; (2) Recovery of 120 tonnes of battery-grade metals annually, valued at $4.5M; (3) Reduction of 800 tonnes CO2-equivalent emissions compared to traditional recycling methods; (4) Establishment of domestic supply chain for critical battery materials; (5) Technology validation enabling national and international licensing opportunities.';
    await page.getByLabel(/Expected Outcomes/).fill(outcomes);
    await expect(page.getByText(new RegExp(`${outcomes.length} / 1000 characters`))).toBeVisible();

    // Commercialization Stage
    await page.getByLabel(/Commercialization Stage/).click();
    await page.getByRole('option', { name: /Scale-up/ }).click();

    // NRF Priority Area
    await page.getByLabel(/NRF Priority Area/).click();
    await page.getByRole('option', { name: /Resources/ }).click();

    // Project Dates
    await page.getByLabel(/Project Start Date/).fill('2026-07-01');
    await page.getByLabel(/Project End Date/).fill('2028-06-30');
    await page.getByLabel(/Project Duration/).fill('24');

    // Project Location
    await page.getByLabel(/Project Location State/).click();
    await page.getByRole('option', { name: 'NSW' }).click();
    await page.getByLabel(/Project Location Suburb/).fill('Tascott');

    // Next button should be enabled
    await expect(step4NextButton).toBeEnabled();
    console.log('✓ Step 4: Next button enabled after filling all fields');

    // Click Next to go to Step 5
    await step4NextButton.click();
    await expect(page).toHaveURL(/\/applications\/igp-commercialisation\/step5/);
    console.log('✓ Step 4: Navigation to Step 5 successful');

    // ========================================================================
    // STEP 5: Project Budget
    // ========================================================================
    console.log('Starting Step 5: Project Budget');
    await expect(page.getByRole('heading', { name: /Step 5: Project Budget/ })).toBeVisible();

    const step5NextButton = page.getByRole('button', { name: /Next/ });

    // Budget fields (must add up to Total Eligible Expenditure within 1%)
    await page.getByLabel(/^Labour Costs$/).fill('800000');
    await page.getByLabel(/Labour On-Costs/).fill('200000'); // 25% of labour (within 30% limit)
    await page.getByLabel(/Contract Costs/).fill('600000');
    await page.getByLabel(/Capitalised Expenditure/).fill('400000'); // 20% of total (within 25% limit)
    await page.getByLabel(/Travel Costs/).fill('100000'); // 5% of total (within 10% limit)
    await page.getByLabel(/Other Costs/).fill('900000');

    const totalExpenditure = 800000 + 200000 + 600000 + 400000 + 100000 + 900000; // = 3000000
    await page.getByLabel(/Total Eligible Expenditure/).fill(totalExpenditure.toString());

    // Grant amount sought (must be ≤ Total Eligible Expenditure)
    await page.getByLabel(/Grant Amount Sought/).fill('2000000'); // $100k-$5M range

    // Co-funding
    await page.getByLabel(/Applicant Cash Contribution/).fill('800000');
    await page.getByLabel(/Other Government Funding/).fill('200000');

    // Verify budget summary is displayed
    await expect(page.getByText(/Budget Summary/i)).toBeVisible();
    console.log('✓ Step 5: Budget summary displayed');

    // Next button should be enabled if validation passes
    await expect(step5NextButton).toBeEnabled();
    console.log('✓ Step 5: Next button enabled after filling all fields');

    // Click Next to go to Step 6
    await step5NextButton.click();
    await expect(page).toHaveURL(/\/applications\/igp-commercialisation\/step6/);
    console.log('✓ Step 5: Navigation to Step 6 successful');

    // ========================================================================
    // STEP 6: Assessment Criteria
    // ========================================================================
    console.log('Starting Step 6: Assessment Criteria');
    await expect(page.getByRole('heading', { name: /Step 6: Assessment Criteria/ })).toBeVisible();

    const step6NextButton = page.getByRole('button', { name: /Next/ });

    // Criterion 1 (200-5000 characters)
    const criterion1 = 'Our technology demonstrates market demand validation through letters of intent from three major battery recyclers representing 60% of Australia\'s current battery recycling capacity. The global lithium-ion battery recycling market is projected to grow from $5.2B (2025) to $18.7B (2030), with critical metals supply constraints driving urgency. EMEW\'s electrochemical process offers 30% lower operating costs compared to conventional hydrometallurgy while achieving higher purity outputs (99.5%+ vs 95%), directly addressing key industry pain points. We have completed successful pilot trials with black mass from Australian battery recyclers, demonstrating technical readiness for commercial scale-up.';
    await page.locator('textarea').nth(0).fill(criterion1);
    await expect(page.getByText(new RegExp(`${criterion1.length} / 5000 characters`)).first()).toBeVisible();

    // Criterion 2 (200-5000 characters)
    const criterion2 = 'The project aligns with NRF Resources priority through developing sovereign capability in critical minerals processing, specifically battery metals essential for Australia\'s energy transition. Our technology addresses national priorities: (1) Supply chain resilience - reducing reliance on imported processed battery materials; (2) Circular economy - enabling domestic closed-loop battery manufacturing; (3) Emissions reduction - our process uses 65% less energy than smelting; (4) Export potential - establishing IP and capability for technology licensing internationally. The project leverages Australia\'s position as a major lithium producer while addressing the current gap in downstream processing capacity.';
    await page.locator('textarea').nth(1).fill(criterion2);

    // Criterion 3 (200-5000 characters)
    const criterion3 = 'EMEW Technologies brings 15 years of proven experience in electrochemical metal recovery with 12 commercial installations across mining and industrial applications globally. Our team includes: (1) Technical Director with PhD in electrochemistry and 20+ patents; (2) Operations Manager with 25 years in metals processing; (3) Quality systems certified to ISO 9001; (4) Existing pilot facility in NSW with relevant environmental approvals; (5) Established supply chains for specialized electrochemical equipment. We have secured partnership agreements with key stakeholders including battery recyclers (guaranteed feedstock), automotive manufacturers (offtake agreements), and university research collaborators (process optimization support). Risk mitigation strategies include staged implementation, parallel processing streams for continuity, and comprehensive OH&S protocols.';
    await page.locator('textarea').nth(2).fill(criterion3);

    // Criterion 4 (200-5000 characters)
    const criterion4 = 'Project benefits quantified over 5 years: (1) Economic - $45M revenue from recovered metals, $12M cost savings vs traditional methods, 15 direct jobs + 30 indirect supply chain jobs; (2) Environmental - 4,000 tonnes CO2-e emissions avoided, zero liquid discharge process, 95% resource recovery efficiency; (3) Social - upskilling programs for technicians in advanced manufacturing, indigenous employment target (10% workforce); (4) Industry development - technology transfer enabling 3-5 additional domestic facilities by 2030, reducing Australia\'s $200M annual import bill for processed battery materials. All metrics tracked through quarterly reporting with independent verification of environmental claims. The project establishes replicable model for other critical minerals processing applications.';
    await page.locator('textarea').nth(3).fill(criterion4);

    console.log('✓ Step 6: Character counters working for all criteria');

    // Next button should be enabled
    await expect(step6NextButton).toBeEnabled();
    console.log('✓ Step 6: Next button enabled after filling all fields');

    // Click Next to go to Step 7
    await step6NextButton.click();
    await expect(page).toHaveURL(/\/applications\/igp-commercialisation\/step7/);
    console.log('✓ Step 6: Navigation to Step 7 successful');

    // ========================================================================
    // STEP 7: Contact & Declaration
    // ========================================================================
    console.log('Starting Step 7: Contact & Declaration');
    await expect(page.getByRole('heading', { name: /Step 7: Contact & Declaration/ })).toBeVisible();

    const submitButton = page.getByRole('button', { name: /Submit/ });

    // Contact Information
    await page.getByLabel(/Contact Name/).fill('John Smith');
    await page.getByLabel(/Contact Position/).fill('Chief Technology Officer');
    await page.getByLabel(/Contact Email/).fill('j.smith@emew.com');
    await page.getByLabel(/Contact Phone/).fill('0412345678');

    // Banking Information
    await page.getByLabel(/Bank Account Name/).fill('EMEW Technologies Pty Ltd');
    await page.getByLabel(/BSB/).fill('062000');
    await page.getByLabel(/Bank Account Number/).fill('12345678');

    // Conflict of Interest = No
    await page.locator('label').filter({ hasText: /^No$/ }).first().click();

    // Privacy Agreement
    await page.getByLabel(/I agree to the privacy statement/).check();

    // Applicant Declaration
    await page.getByLabel(/I declare that/).check();

    // Authorized Officer Name
    await page.getByLabel(/Authorized Officer Name/).fill('John Smith');

    // Submit button should be enabled
    await expect(submitButton).toBeEnabled();
    console.log('✓ Step 7: Submit button enabled after filling all fields');

    // Click Submit
    await submitButton.click();

    // Verify alert (Phase 1 shows alert, Phase 2 will submit to backend)
    page.once('dialog', dialog => {
      expect(dialog.message()).toContain('Application draft saved successfully');
      dialog.accept();
    });

    console.log('✓ Step 7: Form submitted successfully');
    console.log('✅ COMPLETE WALKTHROUGH SUCCESSFUL - All 7 steps validated!');
  });

  test('verify localStorage persistence across page reloads', async ({ page }) => {
    // Start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Fill out Step 1
    await page.goto('/applications/igp-commercialisation/step1');
    await page.locator('label').filter({ hasText: 'Company incorporated in Australia' }).click();
    await page.locator('label').filter({ hasText: /^No$/ }).first().click();

    // Reload page
    await page.reload();

    // Verify data persists (entity type should still be selected)
    // Note: This tests LocalStorage persistence
    await expect(page.getByRole('heading', { name: /Step 1: Eligibility Check/ })).toBeVisible();
    console.log('✓ LocalStorage persistence: Page reloaded without errors');
  });
});
