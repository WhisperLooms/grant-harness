# /issue-status - Issue Progress Review Command

Perform a comprehensive, objective review of work completed on GitHub Issue: **$ARGUMENTS**.

**Purpose**: Provide critical assessment of current progress against issue requirements, including implementation completeness, testing coverage, and remaining work.

**Scope**: Analyze code changes, test results, documentation updates, and ADR compliance to give honest status report.

---

## Usage

- `/issue-status <issue number>`: Review progress on specified issue
- `/issue-status`: Auto-detect issue from current branch name

---

## Preflight (one-time per session)

1. Verify GitHub CLI is installed and authenticated:
   - `gh --version`
   - `gh auth status`
2. Ensure permissions to run shell commands and read files for this session:
   - Allow tools: `Bash(gh:*)`, `Read`, `Grep`, `Glob`
3. Windows/PowerShell friendly: commands use standard `gh` invocations

---

## Auto-detect Current Issue (when no arguments provided)

When called without arguments:

1. Extract issue number from current branch name:
   - Pattern: `feature/issue-{number}-*` → extract {number}
   - Pattern: `bugfix/issue-{number}-*` → extract {number}
   - Pattern: `hotfix/issue-{number}-*` → extract {number}
   - Command: `git rev-parse --abbrev-ref HEAD`
2. If no issue number found in branch name:
   - List recent open issues: `gh issue list --state open --limit 10`
   - Ask user to specify issue number or re-run `/issue-status <number>`

---

## Data Gathering

For the target issue (auto-detected or provided):

1. **Fetch Issue Details**:
   - `gh issue view <issue> --json number,title,body,labels,milestone,assignees,createdAt,updatedAt`
   - Parse acceptance criteria, requirements, and scope from issue body

2. **Read Issue Scratchpad** (if exists):
   - Search `.claude/scratchpads/issue-<number>-*.md`
   - Extract implementation plan, routing plan, ADR references

3. **Identify Changed Files**:
   - Compare current branch vs base branch (usually `main`):
   - `git diff main...HEAD --name-only`
   - Categorize: Frontend (src/), Backend (orc-adk/), Tests, Docs

4. **Check Test Coverage**:
   - Frontend tests: Search for new/modified `.spec.ts` files in `tests/`
   - Backend tests: Search for new/modified test files in `orc-adk/tests/`
   - Evaluation: Search for new/modified evalsets in `orc-adk/eval/evalsets/`

5. **Review ADR Compliance** (if architectural):
   - Check scratchpad for ADR-XXXX reference
   - If ADR referenced, verify ADR exists and status (Proposed/Accepted)
   - Location: `.cursor/rules/ADR.mdc`, `.cursor/rules/backend/ADR.mdc`, `.cursor/rules/frontend/ADR.mdc`

6. **Check Documentation Updates**:
   - CLAUDE.md, orc-adk/CLAUDE.md updated?
   - Relevant specs updated (design.md, requirements.md, etc.)?
   - README updates if new patterns introduced?

---

## Critical Review Process

### 1. Implementation Completeness

**Acceptance Criteria Check**:
- [ ] Parse acceptance criteria from issue body
- [ ] For each criterion, assess: ✅ Complete | ⚠️ Partial | ❌ Not Started
- [ ] Identify missing functionality vs. issue scope
- [ ] Flag scope creep (work done outside issue requirements)

**Code Quality Assessment**:
- Frontend (if `src/` modified):
  - [ ] React/Next.js best practices followed?
  - [ ] TypeScript types complete and correct?
  - [ ] State management patterns appropriate?
  - [ ] No anti-patterns or code smells?
- Backend (if `orc-adk/` modified):
  - [ ] ADK compliance maintained?
  - [ ] PEP8 and type hints present?
  - [ ] No Unicode in orchestrator files? (ADR-2002)
  - [ ] Google-style docstrings for functions?

**Performance Impact** (if backend modified):
- [ ] Token usage within targets (≤320 tokens/round)?
- [ ] Execution time within limits (≤11.1s)?
- [ ] No unnecessary Firestore reads/writes?

### 2. Testing Coverage

**Unit Tests**:
- Frontend: Playwright tests for new features?
- Backend: Pytest tests in `orc-adk/tests/` for new functionality?
- Coverage: Are critical paths tested?

**Integration Tests**:
- E2E tests updated for new flows?
- Firebase emulator tests if schema/data changes?

**Evaluation (Backend only)**:
- ADK evalsets updated in `orc-adk/eval/evalsets/`?
- Evaluation pass rate ≥95%?
- New scenarios covered?

**Test Execution Status**:
- [ ] Have tests been run? (check for test output, logs, or scratchpad documentation)
- [ ] What are the test results? (report pass/fail counts, any blockers)
- [ ] Is test evidence documented? (scratchpad section or file path reference)
  - Check for "Test Execution Evidence" section in scratchpad
  - Verify evidence includes: test files, execution date, results summary
- [ ] Are tests executable? (note any import errors, configuration issues, or infrastructure blockers)

**Note**: PR reviews require test execution evidence. Document test results or execution blockers in scratchpad.

### 3. ADR Compliance (if architectural)

**ADR Status**:
- [ ] Does issue introduce architectural changes? (schema, API, state, auth, UI patterns, integrations)
- [ ] If YES: ADR-XXXX referenced in scratchpad?
- [ ] ADR exists in appropriate file? (Platform 0001-0999, Frontend 1000-1999, Backend 2000-9999)
- [ ] ADR follows ADR_AGENT_PROTOCOL v1.0? (4-digit ID, anchor, Index, all fields)
- [ ] ADR status appropriate? (Proposed during work, should be Accepted before merge)

**If No ADR**:
- [ ] Verify change is purely tactical (bug fix, config, documentation)
- [ ] Confirm scratchpad noted "No ADR required - tactical change only"

### 4. Documentation Updates

**Required Documentation**:
- [ ] CLAUDE.md updated if new patterns/workflows introduced?
- [ ] orc-adk/CLAUDE.md updated if backend changes significant?
- [ ] Relevant specs updated:
  - [ ] `.docs/specs/design.md` (if UI/UX changes)
  - [ ] `.docs/specs/requirements.md` (if requirements satisfied)
  - [ ] `.docs/specs/firestore-schema-*.md` (if database changes)
  - [ ] `.docs/specs/qr-url-generation-mgt.md` (if QR/coaster changes)
  - [ ] `.docs/specs/style-guide.md` (if visual design changes)

**Code Documentation**:
- [ ] Complex logic commented?
- [ ] Public functions have docstrings?
- [ ] README updates for new features?

### 5. Visual Compliance (if frontend modified)

**Design Adherence**:
- [ ] Changes align with `.docs/specs/design.md`?
- [ ] Brand colors from `.docs/specs/style-guide.md` used?
- [ ] Responsive design considerations?
- [ ] Accessibility (ARIA labels, keyboard navigation)?

**Visual Evidence**:
- [ ] Screenshots taken for changed views?
- [ ] Evidence stored in appropriate location?

---

## Status Report Format

Generate an objective status report with this structure:

```markdown
## Issue #<number> Status Report

**Issue**: <Title>
**Branch**: <current-branch>
**Last Updated**: <timestamp>

---

### Executive Summary

[1-2 sentences: Overall progress, critical blockers if any]

**Overall Progress**: <X>% complete
**Status**: 🟢 On Track | 🟡 At Risk | 🔴 Blocked

---

### Implementation Completeness

**Acceptance Criteria** (from issue body):

| Criterion | Status | Evidence | Notes |
|-----------|--------|----------|-------|
| 1. <criterion text> | ✅ Complete | <file:line> | <notes> |
| 2. <criterion text> | ⚠️ Partial | <file:line> | <missing work> |
| 3. <criterion text> | ❌ Not Started | - | <reason> |

**Code Changes Summary**:
- Frontend: <X> files modified (<list key files>)
- Backend: <X> files modified (<list key files>)
- Tests: <X> files added/modified
- Documentation: <X> files updated

**Code Quality Issues**:
- [ ] **Critical**: <issue> (<file:line>)
- [ ] **Warning**: <issue> (<file:line>)
- [ ] **Suggestion**: <improvement> (<file:line>)

---

### Testing Coverage

**Unit Tests**:
- ✅ Frontend: <X> tests added/modified (<pass/fail status>)
- ✅ Backend: <X> tests added/modified (<pass/fail status>)

**Integration Tests**:
- ✅ E2E: <scenario coverage>
- ⚠️ Emulator: <missing scenarios>

**Evaluation** (Backend):
- ✅ Evalsets updated: <X> scenarios
- ✅ Pass rate: <X>% (target: ≥95%)

**Test Execution Status**:
- Last run: <timestamp or "NOT RUN">
- Tests executable: <YES/NO/PARTIAL - note any issues>
- Results: <X passed, Y failed, Z skipped>
- Evidence location: <scratchpad section reference or file path, or "NOT DOCUMENTED">

**Testing Gaps**:
- [ ] Missing test for: <scenario>
- [ ] Untested edge case: <case>
- [ ] Test execution evidence: <documented/missing>

---

### ADR Compliance

**Architectural Decision**:
- Architectural change? <YES/NO>
- ADR Required? <YES/NO>
- ADR Reference: <ADR-XXXX or "N/A - tactical change">
- ADR Status: <Proposed/Accepted or "N/A">
- ADR Location: <file path or "N/A">

**ADR Quality** (if applicable):
- [ ] Follows ADR_AGENT_PROTOCOL v1.0
- [ ] All required fields filled
- [ ] Evidence and file references included
- [ ] Index table updated

**Issues**:
- [ ] <ADR compliance issue if any>

---

### Documentation Updates

**Updated Documentation**:
- ✅ <file> - <what was updated>
- ⚠️ <file> - <incomplete, missing X>
- ❌ <file> - <not updated, but should be>

**Missing Documentation**:
- [ ] <required update not completed>

---

### Remaining Work

**To Complete This Issue**:

1. **Implementation**:
   - [ ] <remaining feature work>
   - [ ] <bug fixes needed>

2. **Testing**:
   - [ ] <test scenarios to add>
   - [ ] <run full test suite>

3. **ADR** (if applicable):
   - [ ] <finalize ADR with evidence>
   - [ ] <update Index status>

4. **Documentation**:
   - [ ] <required doc updates>

**Estimated Effort**: <X hours/days>

---

### Blockers

**Critical Blockers**:
- 🔴 <blocker description> - <resolution needed>

**Dependencies**:
- ⏳ Waiting on: <dependency>

---

### Recommendations

**Before Merge**:
1. <critical action required>
2. <recommended improvement>

**For Follow-up** (create new issues):
- <scope creep to defer>
- <enhancement discovered during work>

---

### Next Steps

1. <immediate next action>
2. <verification needed>
3. <ready for /reviewpr or continue work>

```

---

## Objectivity Guidelines

**Be Honest**:
- Report actual status, not aspirational
- Don't sugarcoat incomplete work
- Flag quality issues even if tests pass
- Identify technical debt introduced

**Be Specific**:
- Reference file paths and line numbers
- Cite evidence (test results, screenshots, metrics)
- Quantify progress (X% complete, X tests passing)

**Be Constructive**:
- Explain why something is incomplete/problematic
- Suggest concrete next steps
- Prioritize blockers vs. nice-to-haves

**Be Fair**:
- Acknowledge completed work
- Consider scope (don't expect work outside issue)
- Recognize constraints (time, dependencies)

---

## Example Status Report

```markdown
## Issue #80 Status Report

**Issue**: Documentation Infrastructure Consolidation
**Branch**: feature/issue-80-documentation-infrastructure
**Last Updated**: 2025-10-06 16:45 AEDT

---

### Executive Summary

Phase 1 & 2 complete (tasks.md transformation + ADR workflow integration). Phase 3 pending (verification, cleanup). ADR workflow successfully baked into /issue, /reviewpr, /issue-close commands.

**Overall Progress**: 75% complete
**Status**: 🟢 On Track

---

### Implementation Completeness

**Acceptance Criteria**:

| Criterion | Status | Evidence | Notes |
|-----------|--------|----------|-------|
| 1. Transform tasks.md to strategic roadmap | ✅ Complete | .docs/specs/tasks.md:1-218 | 90% reduction (719→218 lines) |
| 2. Integrate ADR workflow into commands | ✅ Complete | .claude/commands/*.md | /issue, /reviewpr, /issue-close enhanced |
| 3. Create ADR workflow guide | ✅ Complete | .cursor/rules/README.md:244-408 | 165 lines, 3 examples |
| 4. Gap analysis (tasks not in Issues) | ✅ Complete | .docs/specs/tasks.md:93-171 | 11 tasks identified |
| 5. Verify workflow clarity | ⚠️ Partial | - | Quick Reference table confusing (this review) |

**Code Changes Summary**:
- Workflow commands: 3 files (.claude/commands/)
- Documentation: 5 files (.docs/, .cursor/rules/, CLAUDE.md)
- Archive: 1 file (.docs/archive/2025-10-tasks-detailed.md)
- Repository cleanup: 185 deletions

**Code Quality Issues**:
- [ ] **Warning**: Quick Reference table mixes internal step numbers with workflow sequence (.cursor/rules/README.md:401-407)

---

### Testing Coverage

**Unit Tests**: N/A (documentation changes only)

**Manual Validation**:
- ✅ tasks.md transformed to table format
- ✅ Gap analysis complete (11 tasks identified)
- ✅ ADR workflow documented
- ⚠️ Commands not yet tested in practice

**Testing Gaps**:
- [ ] Test /issue with architectural change (create ADR stub)
- [ ] Test /reviewpr with ADR verification checklist
- [ ] Test /issue-close with ADR finalization

---

### ADR Compliance

**Architectural Decision**: NO
**ADR Required**: NO
**Reason**: Documentation restructuring, no code/schema/API changes

---

### Documentation Updates

**Updated Documentation**:
- ✅ .docs/specs/tasks.md - Strategic roadmap created
- ✅ .cursor/rules/README.md - ADR workflow guide added
- ✅ .claude/commands/issue.md - Step 7 ADR check added
- ✅ .claude/commands/reviewpr.md - Section 4 ADR verification added
- ✅ .claude/commands/issue-close.md - Step 2 ADR finalization added
- ✅ CLAUDE.md - Task management reference updated

**Missing Documentation**: None

---

### Remaining Work

**To Complete This Issue**:

1. **Documentation Clarity**:
   - [ ] Fix Quick Reference table in README.md (remove internal step numbers)
   - [ ] Verify all cross-references accurate

2. **Validation**:
   - [ ] Test workflow with next architectural issue (Issue #85?)
   - [ ] Confirm scratchpad → ADR stub → verification → finalization flow works

3. **Cleanup**:
   - [ ] Review all modified files for typos, consistency
   - [ ] Ensure commit message accurate

**Estimated Effort**: 30 minutes

---

### Blockers

**Critical Blockers**: None

**Dependencies**: None

---

### Recommendations

**Before Merge**:
1. Fix Quick Reference table clarity (remove internal step numbers)
2. Test workflow with one architectural issue to validate

**For Follow-up** (create new issues):
- Gap analysis identified 11 tasks → create GitHub Issues

---

### Next Steps

1. Fix Quick Reference table in README.md
2. Final review of all documentation changes
3. Run /reviewpr on self (when PR created)
4. Ready for PR after Quick Ref fix
```

---

## Notes & Best Practices

- **Objectivity**: Report actual status, not aspirational
- **Evidence**: Always cite file paths, line numbers, test results
- **Honesty**: Flag incomplete work, quality issues, technical debt
- **Constructive**: Explain problems, suggest solutions, prioritize actions
- **Scope**: Only assess work within issue scope (don't expect extras)
- **User Value**: Frame status in terms of issue completion, not personal achievement

---

**Philosophy**: This command serves the user by providing honest, evidence-based progress assessment. The goal is clarity and accountability, not praise or blame.
