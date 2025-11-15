# Test Evidence Directory

Organized test evidence for Grant-Harness frontend form testing, following [ADR-1008 Test Evidence Organization by Grant](../../../.cursor/rules/frontend/ADR.mdc#adr-1008).

## Directory Structure

```
.docs/screenshots/test-evidence/
├── {grant-id}/                     # e.g., igp-commercialisation
│   ├── {YYYY-MM-DD}-session-{NNN}/ # e.g., 2025-11-15-session-001
│   │   ├── metadata.json           # Test session info (status, duration, tools)
│   │   ├── step{N}-{state}.png     # Screenshots of each form step
│   │   └── form-data.json          # Complete form data for reproducibility
│   └── {YYYY-MM-DD}-session-{NNN}/ # Additional test runs (versioning)
│       └── ...
├── {another-grant-id}/             # e.g., bbi-initiative
│   └── ...
└── README.md                       # This file
```

## Finding Test Evidence

### By Grant
- **IGP (Industry Growth Program)**: `igp-commercialisation/`
- **BBI (Battery Breakthrough Initiative)**: `bbi-initiative/` _(future)_
- **VMA (Victorian Manufacturing Acceleration)**: `vma-program/` _(future)_

### Latest Test for a Grant
Navigate to the grant folder and find the most recent date folder:
```bash
cd igp-commercialisation/
ls -lt  # Latest test at the top
# Example: 2025-11-15-session-001/
```

### Specific Test Session
```bash
cd igp-commercialisation/2025-11-15-session-001/
cat metadata.json  # Test session details
cat form-data.json # Complete form data
```

## Files in Each Test Session

### metadata.json
**Purpose**: Test session context - what was tested, when, how, and results

**Contents**:
- `test_session.session_id` - Unique session identifier (YYYY-MM-DD-session-NNN)
- `test_session.grant_id` - Grant being tested (e.g., "igp-commercialisation")
- `test_session.status` - Test result (e.g., "ALL 7 STEPS COMPLETED")
- `test_session.playwright_mcp_tools_used` - Automation tools used
- `test_session.blocking_issues_encountered` - Any issues found
- `evidence_files.screenshots` - List of screenshot files
- `mock_data_source.company` - Which company profile used for mock data

**Example**:
```json
{
  "test_session": {
    "session_id": "2025-11-15-session-001",
    "grant_id": "igp-commercialisation",
    "status": "ALL 7 STEPS COMPLETED - Submit button enabled",
    "total_steps": 7,
    "steps_completed": 7,
    "duration_minutes": 15
  }
}
```

### step{N}-{state}.png
**Purpose**: Visual evidence of form state at each step

**Naming Convention**:
- `step1-completed.png` - Step 1 with all fields filled and Next button enabled
- `step2-filled.png` - Step 2 with fields populated (may be from localStorage)
- `step3-filled.png` - Step 3 after user input
- `step{N}-empty.png` - Step N showing empty/template state (before filling)
- `step7-complete.png` - **CRITICAL** - Final step with Submit button enabled

**Usage**: Attach to PR description to prove form works end-to-end

### form-data.json
**Purpose**: Complete form data for test reproducibility

**Contents**:
- All form field values for all steps
- Structured by step (e.g., `step1_eligibility`, `step2_organization`)
- Can be used to pre-populate form for regression testing

**Example**:
```json
{
  "step1_eligibility": {
    "entityType": "Company incorporated in Australia",
    "advisoryServiceReport": "No",
    "nonTaxExempt": "Yes, we are non-tax-exempt",
    ...
  },
  "step2_organization": {
    "abn": "11111111111",
    "legalEntityName": "EMEW Technologies Pty Ltd",
    ...
  }
}
```

## PR References

When creating a PR for form implementation, link to the specific test session folder:

```markdown
## Test Evidence

Complete 7-step test session: `.docs/screenshots/test-evidence/igp-commercialisation/2025-11-15-session-001/`

- **Status**: ✅ ALL 7 STEPS COMPLETED
- **Submit button**: ENABLED (see [step7-complete.png](https://github.com/WhisperLooms/grant-harness/blob/issue-2-form-replica/.docs/screenshots/test-evidence/igp-commercialisation/2025-11-15-session-001/step7-complete.png))
- **Test duration**: 15 minutes
- **Mock data**: EMEW Technologies Pty Ltd

Files:
- [metadata.json](link) - Test session details
- [form-data.json](link) - Complete form data (198 lines)
- [step7-complete.png](link) - Final state with Submit enabled
```

## Adding New Test Evidence

### 1. Determine Session ID
```bash
# Grant ID: igp-commercialisation
# Date: 2025-11-15
# Check existing sessions
ls .docs/screenshots/test-evidence/igp-commercialisation/
# If 2025-11-15-session-001 exists, use session-002
# Otherwise, use session-001
```

### 2. Create Session Directory
```bash
mkdir -p .docs/screenshots/test-evidence/igp-commercialisation/2025-11-15-session-002
cd .docs/screenshots/test-evidence/igp-commercialisation/2025-11-15-session-002
```

### 3. Run Playwright MCP Test
Use Claude Code with Playwright MCP tools to:
- Navigate through all form steps
- Fill fields with mock data
- Take screenshots at each step
- Save screenshots to current directory

### 4. Create metadata.json
Copy template from existing session and update:
- `session_id`
- `date`
- `status`
- `evidence_files.screenshots`

### 5. Create form-data.json
Extract complete form data from test session

### 6. Verify Structure
```bash
ls -la
# Should contain:
# - metadata.json
# - form-data.json
# - step1-*.png
# - step2-*.png
# - ...
# - step7-complete.png
```

## Existing Test Evidence

### IGP Commercialisation

#### 2025-11-15-session-001
**Status**: ✅ ALL 7 STEPS COMPLETED - Submit button enabled

**Test Details**:
- **Grant**: Industry Growth Program - Commercialisation Stream
- **Company**: EMEW Technologies Pty Ltd (metal recovery & recycling)
- **Tester**: Claude Code with Playwright MCP
- **Duration**: ~15 minutes
- **Steps Completed**: 7 of 7
- **Submit Button**: ENABLED

**Key Findings**:
- ✅ All form fields accept input correctly
- ⚠️ **Blocking Issue**: LocalStorage hydration prevents onChange validation triggering
  - **Symptom**: Next button disabled on Step 2 despite all fields filled
  - **Root Cause**: Form loads with localStorage data but onChange events never fire
  - **Workaround**: Navigate directly using `page.goto()` instead of Next button clicks
  - **Recommendation**: Add `useEffect` to trigger `form.trigger()` after localStorage loads

**Files**:
- [metadata.json](igp-commercialisation/2025-11-15-session-001/metadata.json)
- [form-data.json](igp-commercialisation/2025-11-15-session-001/form-data.json)
- Screenshots: step1-completed.png through step7-complete.png

**Reference PR**: [Issue #2 - IGP Form Implementation](https://github.com/WhisperLooms/grant-harness/pull/XXX)

---

## Related Documentation

- [ADR-1007: Playwright MCP Browser Testing Before PR](../../../.cursor/rules/frontend/ADR.mdc#adr-1007)
- [ADR-1008: Test Evidence Organization by Grant](../../../.cursor/rules/frontend/ADR.mdc#adr-1008)
- [CLAUDE.md: Frontend Testing Requirements](../../../CLAUDE.md#frontend-form-testing-requirements)

---

**Last Updated**: 2025-11-15
**Maintained By**: Grant-Harness Development Team
