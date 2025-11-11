# /reviewpr - Pull Request Critical Review Command

Critically review the GitHub Pull Request: **$ARGUMENTS**.

**Scope:** Analyze the PR diff for backend Python changes (ADK agents, prototypes, utilities). Provide a concise summary, highlight any issues or improvements following best practices, and conclude with a recommendation to merge or request changes.

**Repository Context**: EMEW Agents - Multi-agent system for electrowinning technology documentation (Knowledge Agent RAG) and marketing automation (Marketing Agent prototype/ADK).

## Usage

- `/reviewpr <PR number|PR URL>`: Critically review the specified PR.
- `/reviewpr` (no arguments): Auto-detect the current PR for the checked-out branch using GitHub CLI.

## Preflight (one-time per session)

1. Verify GitHub CLI is installed and authenticated:
   - `gh --version`
   - `gh auth status`
2. Ensure permissions to run shell and edit files are allowed for this session:
   - Allow tools: `Bash(gh:*)`, `Edit`
3. Windows/PowerShell friendly: commands use standard `gh` invocations and work in PowerShell 7.

## Auto-detect current PR (when no arguments provided)

When called without arguments, perform:

1. Try to resolve PR for the current branch:
   - `gh pr view --json number,url,headRefName,baseRefName,title,author,mergeStateStatus,mergeable -q .number`
2. If not attached to a PR, fallback to list open PRs:
   - `gh pr list --state open --limit 20`
   - Select the appropriate PR or re-run `/reviewpr <PR number>`.

## Data gathering

For the target PR (auto-detected or provided):

1. Fetch metadata:
   - `gh pr view <PR> --json number,url,title,author,baseRefName,headRefName,mergeStateStatus,mergeable,additions,deletions,changedFiles,labels,createdAt,updatedAt`
2. Fetch changed files:
   - `gh pr view <PR> --json files -q ".files[].path"`
3. Fetch diff for detailed review:
   - `gh pr diff <PR>`
4. **Verify test execution evidence**:
   - Check for CI/CD test results: `gh pr checks <PR>`
   - Search for test output files: `Glob **/*test*output*.txt` and `Glob **/*pytest*.log`
   - For new test files, search for references to test execution in commit messages or PR comments
   - If tests exist but no execution evidence found, **attempt to run the tests** to verify they pass

Proceed with the Review Process below using the metadata and diff. If `gh` is unavailable, instruct the user to provide the PR number or URL explicitly.

> Notes (best practices): Prefer using CLI tools and a structured checklist; allow only necessary tools; keep context focused. See Anthropic’s guidance on Claude Code custom commands and tool allowlists.

## Review Process

### 1. Summary
- Briefly summarize what the PR changes or adds (files affected, feature or bugfix addressed)
- **CRITICAL**: Identify the folder pattern to determine review rigor:
  - **Prototype** (`back/*-prototype/`): Flexible patterns, no ADK compliance required
  - **ADK Agent** (`back/*-adk/`): Strict ADK patterns, full compliance checks required
  - **Frontend** (`front/*`): Next.js/React standards apply
  - **Platform** (`.cursor/rules/`, `.docs/`, `.claude/`): Documentation and architecture
- Identify any breaking changes or dependencies

### 2. Prototype Review (`back/*-prototype/`)

**IMPORTANT**: Prototype folders are for rapid iteration and do NOT require ADK compliance.

#### If prototype files are modified (any `back/*-prototype/` folder):

**Logic & Correctness:**
- Functionality works as intended for manual testing
- Edge cases handled (API failures, missing data, rate limits)
- No regressions in existing prototype features
- Output format is correct and complete (CSV, JSON, etc.)

**Code Quality (Relaxed Standards):**
- Code is readable and maintainable
- Type hints encouraged but not required
- Comments for complex logic
- No exposed secrets or API keys (use `.env` files)
- **Unicode allowed** (prototypes don't have ADK performance constraints)

**Dependencies:**
- `pyproject.toml` updated if new packages added
- Use `uv add <package>` for dependency management
- No unnecessary dependencies

**Testing (Prototype Level):**
- Manual testing evidence (output files, screenshots, command outputs)
- Unit tests encouraged but not required for early phases
- Integration tests if interacting with external APIs
- **No ADK evalsets required** (prototypes use manual validation)

**Slash Command Integration (if applicable):**
- `.claude/commands/*.md` files updated if adding new commands
- Command outputs are human-readable (CSV, formatted text)
- Error messages guide user on how to fix issues

### 3. ADK Agent Review (`back/*-adk/`)

**CRITICAL**: ADK folders MUST follow strict Google ADK patterns and conventions.

#### If ADK agent files are modified (any `back/*-adk/` folder):

**Logic & Correctness:**
- Agent logic follows ADK `Agent` class patterns
- Tools properly defined with clear descriptions
- No out-of-band operations (all logic via tools or agent reasoning)
- Edge cases handled with proper error messages
- No regressions in existing agent functionality

**ADK Compliance (STRICT):**
- **MANDATORY**: Follows Google ADK patterns documented at `https://google.github.io/adk-docs/`
- Uses ADK `Agent` class (not custom LLM wrappers)
- Tools use ADK tool decorators and schemas
- System prompts in separate `prompts.py` file
- Agent configuration in `agent.py`
- **NO UNICODE in ADK Python files** (causes 9x performance degradation - see ADR-2002)
- No direct LLM API calls (use ADK abstractions)
- Proper error handling and fallbacks

**Performance:**
- Query/operation latency within acceptable range for agent type
- Token usage optimized (system prompts concise)
- No unnecessary Vertex AI API calls
- Efficient algorithm choices

**Code Style (STRICT):**
- PEP8 compliance
- Type hints present and correct for all functions
- Google-style docstrings for all functions and classes
- Meaningful variable names
- No debug code or sensitive data logging
- ASCII-only characters (see ADR-2002)

**Testing & Evaluation (REQUIRED):**
- **CRITICAL**: Verify test execution evidence (CI/CD checks, test output files, manual test run)
- Unit tests updated (`tests/`)
- Integration tests cover agent behavior changes
- **ADK evalsets updated** if agent output format changed
- Test via ADK Web UI (`uv run adk web`) for integration testing
- Performance benchmarks still pass
- **If new tests added without execution evidence**: Tests must be executable and passing before approval

**Deployment:**
- Deployment scripts updated if agent configuration changed (`deployment/`)
- Environment variables documented in `.env.example`
- Vertex AI compatibility verified (project ID, region, resource paths)

### 4. Frontend Review (Next.js) - `front/*`

**Note**: Frontend development is planned but not yet implemented. Use this section when frontend PRs are submitted.

#### If frontend files are modified (any `front/*` folder):

**Code Quality:**
- React/Next.js best practices (proper hooks usage, component structure)
- TypeScript typing completeness and correctness
- State management patterns (Context, hooks, stores)
- No direct DOM manipulation or anti-patterns
- Proper error boundaries and loading states

**UI/UX & Accessibility:**
- Responsive design considerations
- ARIA labels and semantic HTML
- Keyboard navigation support
- Performance (useMemo/useCallback where appropriate)
- Image optimization (Next.js Image component usage)

**Testing:**
- Playwright E2E test coverage for new features
- Unit tests for utility functions
- Integration tests for API interactions
- Test data fixtures properly maintained

**Integration with Backend:**
- API endpoints properly typed and documented
- Error handling for backend failures
- Loading states for async operations
- Authentication/authorization properly implemented

### 5. Architecture Decision Review (ADR Compliance)

**Critical**: Verify all architectural changes are documented in ADR system.

**EMEW Agents ADR Number Range Convention**:
- **Platform ADRs**: 0001-0999 → `.cursor/rules/ADR.mdc`
- **Frontend ADRs**: 1000-1999 → `.cursor/rules/frontend/ADR.mdc`
- **Backend Infrastructure**: 2000-2099 → `.cursor/rules/backend/ADR.mdc`
- **Knowledge Prototype**: 2050-2099 → `.cursor/rules/backend/ADR.mdc` (tactical decisions)
- **Knowledge ADK**: 2100-2449 → `.cursor/rules/backend/ADR.mdc` (production RAG agent)
- **Marketing Prototype**: 2450-2499 → `.cursor/rules/backend/marketing-prototype/ADR.mdc`
- **Marketing ADK**: 2500-2899 → `.cursor/rules/backend/ADR.mdc` (production marketing agent)
- **Future agents**: Additional ranges will be allocated as new agents are added (see CLAUDE.md)

**ADR Documentation Check**:
- [ ] Does PR introduce new agent capabilities or tools? → Requires ADR
- [ ] Does PR integrate with external services/APIs? → Requires ADR
- [ ] Does PR change deployment configuration? → Requires ADR
- [ ] Does PR establish new architectural patterns? → Requires ADR
- [ ] Does PR change RAG/retrieval implementation? → Requires ADR
- [ ] Does PR modify authentication/authorization? → Requires ADR
- [ ] Does PR change package management approach? → Requires ADR

**If ADR Required**:
- [ ] ADR created/updated following ADR_AGENT_PROTOCOL v1.0 format
- [ ] 4-digit zero-padded ID assigned (ADR-0001, not ADR-1)
- [ ] Explicit anchor `<a id="adr-XXXX"></a>` present
- [ ] Index table updated and sorted by ID descending
- [ ] All required fields filled (Date, Status, Owner, Context, Alternatives, Decision, Consequences)
- [ ] Compliance/Verification section includes file references and AI agent guidance
- [ ] Issue references ADR-XXXX in body or GitHub Issue scratchpad
- [ ] ADR location correct (use number ranges above)
- [ ] ADR number matches folder scope (e.g., Knowledge ADK changes use 2100-2449 range)

**Red Flags**:
- New capabilities/tools introduced without ADR documentation
- External API/service integration without decision record
- "Temporary" solutions that establish new patterns
- Cross-cutting changes without platform-level ADR
- ADR in wrong file location (check number ranges above)
- ADR missing from prototype when establishing reusable patterns

**If No ADR Required**:
- [ ] Verify change is purely tactical (bug fix, config tweak, documentation)
- [ ] Confirm no new patterns introduced
- [ ] PR description or Issue scratchpad notes "No ADR required - tactical change only"

### 5. Overall Quality Checks

**Documentation:**
- Code comments for complex logic
- README updates if needed
- CLAUDE.md updates for new patterns
- API documentation current

**Security:**
- No exposed secrets or API keys in code
- All sensitive configuration in `.env` files (each agent folder has own `.env`)
- `.env` files listed in `.gitignore` (verify not committed)
- `.env.example` files documented with required variables (no actual keys)
- Input validation for external API responses
- No sensitive company/prospect data committed to repository

**Dependencies:**
- Package versions specified
- No unnecessary dependencies added
- Security vulnerabilities checked
- License compatibility verified

**Git Hygiene:**
- Commits are atomic and well-messaged (follow Conventional Commits)
- No merge conflicts
- Branch is up-to-date with `master` (main branch for EMEW Agents)
- No large binary files committed
- Commit messages reference GitHub Issue when applicable (e.g., "feat(marketing): implement prospect-scan (Issue #1)")

## Performance & Quality Targets

**Prototype Agents** (`back/*-prototype/`):
- Manual testing evidence required (output files, screenshots, logs)
- No strict performance requirements (rapid iteration phase)
- Output format correctness (CSV/JSON validity)
- Unicode allowed (no ADK performance constraints)
- Functional correctness prioritized over optimization

**ADK Agents** (`back/*-adk/`):
- Query/operation latency appropriate for agent type (document benchmarks in agent-specific ADRs)
- **No Unicode in ADK Python files** (ADR-2002 - causes 9x performance degradation)
- Token usage optimized
- API rate limit compliance
- Test pass rate: ≥95%
- All agents tested via `adk web` UI before PR approval

**Frontend** (`front/*`):
- Page load performance (Core Web Vitals)
- Accessibility compliance (WCAG 2.1 AA)
- Mobile responsiveness
- E2E test coverage for critical paths

**General Quality Standards**:
- No exposed API keys or secrets in code (use `.env` files)
- `uv.lock` kept in sync with `pyproject.toml` changes
- Conventional Commits format for commit messages
- GitHub Issue referenced when applicable

## Feedback Format

### Issues Found
List any blocking issues with specific details:
- [ ] **Issue 1:** Description (file:line if applicable) and suggested fix
- [ ] **Issue 2:** Description and impact assessment
- [ ] **Warning:** Non-blocking but should be addressed

### Test Execution Status
**REQUIRED SECTION**: Report on test execution evidence:
- **CI/CD Status**: [Pass/Fail/Not Configured] - Output from `gh pr checks <PR>`
- **Test Files Added**: [List any new test files]
- **Test Execution Evidence**: [CI logs / Local test output / None found]
- **Tests Attempted**: [Yes/No] - If no CI and tests exist, did you attempt to run them?
- **Test Results**: [X/Y tests passed] or [Cannot execute - infrastructure issue]
- **Blocking Status**: Tests must be verified passing before approval

### Positive Observations
Highlight well-implemented aspects:
- Good test coverage for [feature]
- Clean refactoring of [component]
- Performance improvement in [area]

## Recommendation

Provide one of the following recommendations:

### ✅ **APPROVED - Ready to Merge**
Use when:
- **All tests verified passing** (CI/CD or manual execution)
- No blocking issues found
- Performance targets maintained
- Code quality standards met
- Test execution evidence documented

### ⚠️ **APPROVED with Minor Changes**
Use when:
- Small non-blocking issues present
- Could be merged but improvements suggested
- Documentation updates needed

### ❌ **Changes Requested**
Use when:
- Blocking issues found
- **Tests failing or cannot be executed**
- **Tests added but no execution evidence found**
- Performance regression detected
- Security concerns identified

### 🔄 **Needs Rebase**
Use when:
- Merge conflicts present
- Branch significantly behind `master`

## Example Review Output

```
## Summary
This PR implements SerpAPI news search for the Marketing Prototype agent with TAM scoring via Gemini Flash.

**Scope**: Prototype (`back/marketing-prototype/`)

## Prototype Review
✅ SerpAPI integration properly handles API failures and rate limits
✅ TAM scoring logic implemented with clear criteria
✅ CSV output format includes all required fields
⚠️ Consider adding retry logic for SerpAPI timeout errors

## ADR Compliance
✅ ADR-2451 created documenting SerpAPI integration decision
✅ ADR properly filed in `.cursor/rules/backend/marketing-prototype/ADR.mdc`
✅ Number range 2450-2499 correctly used

## Test Execution Status
- **CI/CD Status**: Not Configured
- **Test Files Added**: tests/test_serpapi_search.py (3 tests), tests/test_tam_scoring.py (5 tests)
- **Test Execution Evidence**: Manual - CSV outputs in `output/prospects_2025-01-15.csv`
- **Tests Attempted**: Yes - Ran pytest locally
- **Test Results**: 8/8 tests passed
- **Blocking Status**: ✅ Tests verified passing

## Issues Found
- [ ] `.env.example` missing SERPAPI_API_KEY documentation
- [ ] Consider adding error message when API key not configured

## Positive Observations
- Good error handling for missing environment variables
- Clear CSV column headers and timestamp-based filenames
- TAM scoring criteria well-documented in code comments

## Recommendation
⚠️ **APPROVED with Minor Changes** - Add `.env.example` documentation for SERPAPI_API_KEY.
```