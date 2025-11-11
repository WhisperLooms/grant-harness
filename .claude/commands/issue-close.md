Close the GitHub issue: $ARGUMENTS.

Purpose:
- Safely close a GitHub issue after its associated PR is merged into remote main.
- Post a final comment, update internal docs, and clean up branches.
- Prioritise and prepare next issue for implementation.

Usage:
- /issue-close <issue-number>
- Example: /issue-close 19

Preflight (once per session):
Confirm you’re in the correct repo (git remote -v) and there are no uncommitted changes before branch cleanup.

# CONFIRM MERGE TO MAIN
1. Read issue details:
   - gh issue view $ARGUMENTS --json number,title,state,url
2. Try to auto-detect associated PR(s) that reference this issue:
   - Prefer: gh pr list --state all --limit 20 -S "#$ARGUMENTS"
   - If multiple found, prefer baseRefName == "main" and latest updated.
   - If auto-detect fails, ask for PR number or confirm manually.
3. For each candidate PR, verify merged to main on remote:
   - gh pr view <PR> --json number,url,state,mergedAt,baseRefName,headRefName,mergeCommit
   - Require: state == "MERGED" and baseRefName == "main"
   - If not merged, STOP. Add a comment to the issue explaining why it cannot be closed yet.
4. Sync local main (safety):
   - git fetch origin
   - git checkout main
   - git pull --ff-only

# CLOSE OUT & DOCUMENTATION
1. Post a closure comment on the issue (summarize PR(s) and merge):
   - gh issue comment $ARGUMENTS -b "Closing as completed. Merged PR(s): <links>. Verified on main. Next steps documented in project specs."
   - If a scratchpad was used, link it here.
2. **CRITICAL: Finalize ADRs FIRST** (promoted from old step 50 - this is priority):
   - If ADR was created during this issue (check scratchpad for ADR-XXXX reference):
     - **Change Status**: "Proposed" → "Accepted" (ADR verified in /reviewpr, now finalize)
     - **Add Compliance/Verification Section**:
       - **Files**: Specific paths with line numbers (e.g., `src/app/api/route.ts:45-67`)
       - **Evidence**: PR number, test results, production metrics, UAT screenshots
       - **For AI Agents**: Clear guidance on applying this decision in future work
     - **Update Index Table**: Change status to "Accepted", keep sorted by ID descending
     - **If Superseding**: Update old ADR with "Superseded by: ADR-XXXX", change its status to "Superseded"
   - **ADR Location** (by number range):
     - Platform (0001-0999): `.cursor/rules/ADR.mdc`
     - Frontend (1000-1999): `.cursor/rules/frontend/ADR.mdc`
     - Backend (2000-9999): `.cursor/rules/backend/ADR.mdc`
   - **If No ADR**: Verify scratchpad noted "No ADR required - tactical change only"
3. Update project documents (Edit):
   - `.docs/specs/tasks.md` → Update strategic roadmap:
     - **Mermaid Diagram**: Change completed issue color from red/orange → green in classDef section
     - Move issue from active tier section to "Recently Completed" table
     - Update "Last Updated" date at top of file
     - **Color Coding System** (see tasks.md legend):
       - Red = Next tasks (immediate priority)
       - Orange = Later tasks (pre-MVP, not immediate)
       - Yellow = Post-MVP backlog
       - Green = Completed (stays in diagram under CLOSED subgraph)
   - If new subtasks/bugs were discovered, add them to "Gap Analysis" section in tasks.md
   - Critically review alignment with:
     - `.docs/specs/requirements.md`
     - `.docs/specs/design.md`
     - `.docs/specs/product.md`
     - `.docs/specs/structure.md`
     - `.docs/specs/tech.md`
     - `.docs/specs/canonical-coaster-judge-round-rules.md`
     - `.docs/specs/qr-url-generation-mgt.md`
     - `.docs/specs/firestore-schema-*`
     - `.docs/specs/style-guide.md`
   - You must specifically check to see if any changes have occured to the schema, `.docs/specs/firestore-schema-*`, where changes have occured update this document and change the date reference using the same `firestore-schema-YYYYMMDD.md` format.  
   - If there are any deviations from the implemented solution, then either propose a change to the project document or a revision to the work undertaken.
   - Read the CLAUDE.md files in the repository and compare to the code base and database with the implemented changes, where these changes are significant and/or cause the `CLAUDE.md` or `orc-adk\CLAUDE.md` to be incorrect, propose changes to align CLAUDE.
4. Close the issue:
   - gh issue close $ARGUMENTS --reason completed

# GITHUB/GIT CLEAN UP
1. If you’re currently on a feature/bug/hotfix branch linked to the merged PR:
   - Ensure all changes are pushed; stash or commit anything lingering if needed.
   - Identify PR head branch:
     - gh pr view <PR> --json headRefName -q .headRefName
2. Return to main and set Peacock color:
   - Automated: npm run branch:color
   - Manual fallback (PowerShell):
     $hex="#007fff"; $p=".vscode/settings.json"; $j=Get-Content $p -Raw | ConvertFrom-Json; $j."peacock.color"=$hex; ($j|ConvertTo-Json -Depth 20) | Set-Content $p -Encoding UTF8

# PROJECT REVIEW & NEXT STEPS
1. Review open issues and the above project documents for consistency and sequencing.
2. If any open issues have already been resolved by this work, recommend closing them with details.
3. Propose the next critical GitHub issue with a clear, actionable scope; consolidate overlapping issues by expanding scope in the primary issue and marking others as unplanned if appropriate.

Notes & Best Practices:
- Default to safe operations; abort if PR is not merged to main on remote.
- Prefer CLI + structured checklists and scratchpads for traceability.