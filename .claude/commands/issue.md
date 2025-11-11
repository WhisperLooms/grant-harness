Analyze and fix the GitHub issue: $ARGUMENTS.

Follow these steps:

# STRATEGIC CONTEXT

**Before starting**, understand the strategic landscape:

1. **Review tasks.md Roadmap** ([.docs/specs/tasks.md](.docs/specs/tasks.md)):
   - Which Epic/priority tier does this belong to?
   - What dependencies exist? (Check Mermaid diagram)
   - What issues does this block?
   - **Example**: Issue in "Epic 1 - 🔴 NEXT" with dependency on Issue #48 (completed), blocks Issue #72

2. **Note in Scratchpad**:
   ```markdown
   **Strategic Context**:
   - Epic/Tier: [e.g., Epic 1, GATE, POST-MVP]
   - Priority: [e.g., 🔴 NEXT, 🟠 LATER, 🟡 POST-MVP, 🟣 GATE]
   - Dependencies: [List blocking issues that must complete first]
   - Blocks: [List issues that depend on this]
   ```

# PLAN

1. **Use `gh issue view`** to get issue details and read all comments

2. **Understand the problem** described in the issue

3. **Ask clarifying questions** if necessary

4. **Understand prior art**:
   - Search scratchpads (`.claude/scratchpads/`)
   - Search PRs for history
   - Search codebase for relevant files

5. **Identify the layer** (determines workflow):
   - **Frontend** (`src/`) → Read [.cursor/rules/frontend/workflow.mdc](.cursor/rules/frontend/workflow.mdc)
   - **Backend** (`orc-adk/`) → Read [orc-adk/CLAUDE.md](orc-adk/CLAUDE.md) + [.cursor/rules/backend/workflow.mdc](.cursor/rules/backend/workflow.mdc)
   - **Platform** → Read [.cursor/rules/ADR.mdc](.cursor/rules/ADR.mdc)

   **MANDATORY**: Read the appropriate workflow file before proceeding. Contains architecture patterns, development rules, testing requirements, and guardrails.

6. **Break down into manageable tasks**

7. **Routing Plan** (for complex work):
   - Consult `tech-lead-orchestrator` agent for routing
   - Identify specialized agents needed (see [CLAUDE.md](CLAUDE.md) "Agent Orchestration Protocol")
   - Document routing plan in scratchpad

8. **Architectural Decision Check**:
   - Ask: "Does this change architectural patterns?"
     - **YES if**: Schema changes, API endpoints, state management, auth/security, UI patterns, external service integration, deployment config
     - **NO if**: Bug fixes, tactical changes, config tweaks, documentation

   - **If YES**: Create ADR stub (see [.cursor/rules/README.md](.cursor/rules/README.md) "ADR Workflow Guide")
     * Platform (0001-0999): `.cursor/rules/ADR.mdc`
     * Frontend (1000-1999): `.cursor/rules/frontend/ADR.mdc`
     * Backend (2000-9999): `.cursor/rules/backend/ADR.mdc`
     * **3-Stage Lifecycle**: Create (Proposed) → Review (Verify) → Close (Accepted + Evidence)
     * Add reference in scratchpad: "ADR-XXXX: <Title>"

   - **If NO**: Note "No ADR required - tactical change only"

9. **Testing Strategy Check**:
   - Review [.docs/specs/testing-guide.md](.docs/specs/testing-guide.md) "What Changed → Run This Test" table
   - Identify test modes needed:
     * **Preflight** - Quick smoke check (< 2 min)
     * **Full-flow** - Complete game test (3-10 min)
     * **AI-eval** - LLM quality/performance (5-10 min)
   - Note in scratchpad:
     * Test commands (reference `.claude/commands/test-*` commands)
     * Pass criteria
     * Evidence locations
   - For detailed framework, see [test-guide-0-index.md](.docs/specs/test-guide-0-index.md)

10. **Document plan** in scratchpad:
    - **Filename**: `.claude/scratchpads/issue-##-[name].md`
    - **Required sections**:
      * Issue link
      * Strategic Context (Epic, Priority, Dependencies, Blocks)
      * Layer (Frontend/Backend/Platform + workflow reference)
      * Routing Plan (if complex)
      * ADR Reference (if architectural) or "No ADR required"
      * Testing Strategy (modes, commands, evidence locations)
      * Implementation Plan
      * Success Criteria

# CREATE

1. **Create branch**:
   - Feature: `feature/issue-{number}-{description}`
   - Bugfix: `bugfix/issue-{number}-{description}`
   - Hotfix: `hotfix/issue-{number}-{description}`

2. **Set Peacock color**:
   - `npm run branch:color` (automated)
   - Manual: F1 → "Peacock: Change to a Favorite Color"
   - **Example colors**: feature/* (#ff8800), bugfix/* (#ff66cc), hotfix/* (#ff0000)

3. **Implement solution**:
   - Follow layer-specific workflow
   - Small, logical commits
   - Reference issue number in commits

# TEST

**CRITICAL**: Testing is mandatory. All changes must be validated before PR.

## Frontend Changes (`src/`)

**Framework**: Playwright E2E ([test-guide-4-e2e.md](.docs/specs/test-guide-4-e2e.md))

**Commands** (reference `.claude/commands/test-*`):
```bash
npm run test:e2e                                    # All tests
npx playwright test tests/e2e/[specific].spec.ts   # Specific test
npx playwright test --headed                        # Visible browser
```

**Visual Compliance** (MANDATORY for UI):
- Use `Claude_Playwright` MCP tools
- Verify against [.docs/specs/design.md](.docs/specs/design.md)
- Full page screenshots (1440px viewport)
- Check console errors
- See [.cursor/rules/frontend/workflow.mdc](.cursor/rules/frontend/workflow.mdc) "Visual Design Compliance" section

**Evidence**: `tests/playwright-report/` or screenshots in scratchpad

## Backend Changes (`orc-adk/`)

**Framework**: pytest + ADK Evaluation ([test-guide-1-smoke.md](.docs/specs/test-guide-1-smoke.md), [test-guide-6-adk-eval.md](.docs/specs/test-guide-6-adk-eval.md))

**Setup**:
```bash
# Terminal 1: Firebase emulator
firebase emulators:start --only firestore

# Terminal 2: Environment + tests
set FIRESTORE_EMULATOR_HOST=localhost:8080
set GOOGLE_CLOUD_PROJECT=byo-judge
set EVALUATION_MODE=true
```

**Commands** (reference `.claude/commands/test-*`):
```bash
cd orc-adk && pytest tests/integration/test_smoke_orc_adk.py -m smoke -v  # Preflight
cd orc-adk && pytest tests/ -v                                             # Full suite
cd orc-adk && adk web                                                       # Interactive GUI
# Multi-LLM: See .claude/commands/test-3.1-ai-eval-multi-llm.md
```

**Evidence**: `orc-adk/tests/output/` or pytest results in scratchpad

## Test Execution Validation

- Tests must be executable (no import errors, proper config)
- All tests must pass before PR
- If tests fail: debug, fix, re-run, document

## Document Test Evidence (REQUIRED)

**Add to scratchpad**:

```markdown
## Test Execution Evidence

**Test Mode**: [Preflight/Full-flow/AI-eval/UAT]

**Backend Tests** (if applicable):
- File: `orc-adk/tests/[file].py`
- Result: ✅ X/X passed
- Date: YYYY-MM-DD
- Duration: Xs

<details>
<summary>Test Output</summary>
[paste output]
</details>

**Frontend Tests** (if applicable):
- File: `tests/e2e/[file].spec.ts`
- Result: ✅ X/X passed
- Screenshots: `tests/screenshots/[location]/`
- Date: YYYY-MM-DD

**Visual Compliance** (if UI changes):
- Design.md: ✅ Verified
- Style-guide.md: ✅ Verified
- Console errors: ✅ None
- Accessibility: ✅ Compliant

**ADK Evaluation** (if backend/LLM):
- Evalset: `eval/evalsets/[file].yaml`
- Pass Rate: 100% (X/X)
- Performance: [metrics]
- Evidence: `orc-adk/eval/results/[file].json`
```

**Evidence Locations**:
- Backend: `orc-adk/tests/output/` or scratchpad
- Frontend: `tests/playwright-report/` or `tests/screenshots/`
- Evaluation: `orc-adk/eval/results/` or scratchpad
- UAT: `tests/uat-data-e2e/YYMMDD-N/`

# DEPLOY

1. **Return to main**:
   ```bash
   git checkout main
   npm run branch:color  # Reset to blue
   ```

2. **Create PR**:
   - Omit "Claude" commit footer
   - Include issue link on last line
   - **Example commit**:
     ```
     feat: [description] (Issue #XX)

     - Change 1
     - Change 2

     https://github.com/[org]/[repo]/issues/XX
     ```

3. **PR Body Template**:
   ```
   ## Summary
   [1-3 bullets]

   ## Testing
   See scratchpad for evidence:
   - [Mode]: ✅ Passed
   - Files: [list]
   - Evidence: [location]

   ## ADR
   [ADR-XXXX: Title - Proposed] OR [No ADR required]

   ## Related
   Closes #XX
   Dependencies: #YY (if any)
   Blocks: #ZZ (if any)
   ```

4. **Use `/reviewpr <number>`** for PR review (verifies ADR Stage 2)

5. **After merge, use `/issue-close <number>`** (finalizes ADR Stage 3, updates tasks.md)

---

## Key Principles

### Testing is Mandatory
- All changes require test evidence before PR
- Test failures block PR creation
- See [testing-guide.md](.docs/specs/testing-guide.md) and [test-guide-0-index.md](.docs/specs/test-guide-0-index.md)
- Use `.claude/commands/test-*` commands for test execution

### ADR is a 3-Stage Process
1. `/issue` (step 8): Create stub (Proposed)
2. `/reviewpr`: Verify complete
3. `/issue-close`: Finalize (Accepted + Evidence)
- See [.cursor/rules/README.md](.cursor/rules/README.md) "ADR Workflow Guide"

### Workflow Files are Mandatory
- Frontend: [.cursor/rules/frontend/workflow.mdc](.cursor/rules/frontend/workflow.mdc)
- Backend: [orc-adk/CLAUDE.md](orc-adk/CLAUDE.md) + [.cursor/rules/backend/workflow.mdc](.cursor/rules/backend/workflow.mdc)
- Platform: [.cursor/rules/ADR.mdc](.cursor/rules/ADR.mdc)

### Strategic Context Matters
- Check tasks.md before starting
- Validate dependencies complete
- Understand Epic structure and priority

### Use the Right Tools
- `gh` CLI for GitHub operations
- `npm run branch:color` for Peacock
- `Claude_Playwright` MCP for visual validation
- `tech-lead-orchestrator` for routing
- Specialized agents per layer

---

Remember to use GitHub CLI (`gh`) for all GitHub-related tasks.
