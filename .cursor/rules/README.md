# .cursor/rules/ - AI Agent Documentation Structure

This directory contains **Cursor-compatible** documentation that is automatically loaded by Cursor AI and referenced by Claude Code for intelligent code assistance.

## Overview

**Dual IDE Support**:
- **Cursor AI**: Automatically loads all `.mdc` files in this directory and subdirectories
- **Claude Code**: References these files via root `CLAUDE.md` "Documentation Navigation" section

This structure follows the **ADR_AGENT_PROTOCOL v1.0** pattern from emew-agents.

**ADR Number Range Convention**:
- Platform ADRs: ADR-0001 to ADR-0999
- Frontend ADRs: ADR-1000 to ADR-1999
- Backend Infrastructure: ADR-2000 to ADR-2049
- Backend Grant Prototype: ADR-2050 to ADR-2099
- Backend Grant ADK: ADR-2100 to ADR-2499

---

## File Structure

```
.cursor/rules/
├── README.md                           # This file - explains structure
├── folder-structure.mdc                # Repository directory guide
├── rules.mdc                           # Development guidelines
├── platform/                           # Platform-level decisions
│   └── ADR.mdc                        # Platform ADRs (0001-0999)
├── backend/                            # Backend components
│   ├── ADR.mdc                        # Backend infrastructure ADRs (2000-2049)
│   ├── workflow.mdc                   # Backend development workflow
│   ├── folder-structure.mdc           # Backend directory guide
│   └── grant-prototype/               # Phase 1 prototype
│       └── ADR.mdc                    # Prototype tactical ADRs (2050-2099)
└── frontend/                           # Frontend components
    ├── ADR.mdc                        # Frontend ADRs (1000-1999)
    ├── workflow.mdc                   # Frontend development workflow
    └── folder-structure.mdc           # Frontend directory guide
```

---

## File Purposes

### Platform Level (platform/)

**ADR.mdc** - Platform-Wide Architectural Decisions
- ADR-0001: Monorepo Structure Decision
- ADR-0002: Gemini File Search vs Self-Hosted Vector DB
- ADR-0003: Scrapy Framework for Web Scraping

### Backend Level (backend/)

**ADR.mdc** - Backend Infrastructure ADRs (ADR-2000 to ADR-2049)
- Shared backend patterns and decisions
- Package management, testing strategy, data validation

**workflow.mdc** - Backend Development Workflow
- Testing strategy (pytest, integration tests)
- Development principles (DRY, SOLID, type hints)
- Common patterns (Pydantic models, API design)
- Workflow steps for feature development

**folder-structure.mdc** - Backend Directory Structure
- `back/grant-prototype/` - Phase 1 Python prototype
- `back/grant-adk/` - Phase 2 production ADK agents

### Backend Grant Prototype Level (backend/grant-prototype/)

**ADR.mdc** - Grant Prototype Tactical Decisions (ADR-2050 to ADR-2099)
- Phase 1 specific implementation choices
- Scraper strategies, Gemini API vs Vertex AI
- Temporary decisions that may change in Phase 2

### Frontend Level (frontend/)

**ADR.mdc** - Frontend Architectural Decisions (ADR-1000 to ADR-1999)
- To be populated in Phase 2
- Next.js patterns, authentication, state management

**workflow.mdc** - Frontend Development Workflow
- To be populated in Phase 2
- Component development, testing, deployment

**folder-structure.mdc** - Frontend Directory Structure
- To be populated in Phase 2
- `front/grant-portal/` structure

---

## ADR_AGENT_PROTOCOL Format

All ADR.mdc files follow the **ADR_AGENT_PROTOCOL v1.0** format:

### Required Elements
1. **Protocol Header**: Complete ADR_AGENT_PROTOCOL with INVARIANTS and NUMBER RANGE CONVENTION
2. **Index Table**: Sorted by ID descending (newest on top)
3. **4-Digit Zero-Padded IDs**: ADR-0001, ADR-1001, ADR-2001, etc. (not ADR-1, ADR-2)
4. **Number Ranges**: Platform (0001-0999), Frontend (1000-1999), Backend (2000-9999)
5. **Explicit Anchors**: `<a id="adr-XXXX"></a>` for stable linking
6. **Status Values**: Proposed | Accepted | Superseded
7. **Template Section**: "New ADR Entry Template" for adding new decisions

### ADR Structure
Each ADR contains:
- **Date**: YYYY-MM-DD format
- **Status**: Proposed | Accepted | Superseded
- **Owner**: Who made/documented the decision
- **Context**: 1-3 sentences explaining the problem/situation
- **Alternatives**: Bullet list of options considered and why rejected
- **Decision**: Clear, testable decision in active voice
- **Consequences**: Pros, Cons/risks, Supersedes, Superseded by
- **Compliance/Verification** (optional): Tests, files, evidence, AI agent guidance

### Example ADR
```markdown
## ADR-0001 — Monorepo Structure Decision

<a id="adr-0001"></a>
**Date**: 2025-11-11
**Status**: Accepted
**Owner**: Initial Project Setup

### Context
Grant-Harness requires organized structure for prototype and production phases...

### Alternatives
- **Separate repos**: Independent repositories for prototype and production
- **Flat structure**: Single directory with all code mixed
- **Monorepo with clear separation**: Organized by phase and component (chosen)

### Decision
Use monorepo structure with clear separation: back/, front/, docs/, .cursor/rules/...

### Consequences
* **Pros**: Clear boundaries, single git history, shared documentation
* **Cons / risks**: Slightly more complex navigation
* **Supersedes**: —
* **Superseded by**: —

### Compliance / Verification
**Files**: .cursor/rules/folder-structure.mdc, CLAUDE.md
**For AI Agents**: Always navigate to specific component directory before coding...
```

---

## Adding New ADRs

### For Cursor Users
1. Open relevant ADR.mdc file (platform, backend, or frontend)
2. Follow ADR_AGENT_PROTOCOL instructions in file header
3. Compute next ID: Find highest existing ID, add 1, zero-pad to 4 digits
4. Copy "New ADR Entry Template" section
5. Fill in all required fields
6. Update Index table (add new row, keep sorted by ID descending)
7. Validate: Unique heading, anchor, Index row

### For Claude Code Users
1. Reference `CLAUDE.md` → "Documentation Navigation" section
2. Navigate to appropriate .cursor/rules/ file
3. Follow same process as Cursor users above

### Commit Message
```
ADR-XXXX: <Short Title> — <Status>
```

---

## File Format: .mdc vs .md

**Why .mdc?**
- Cursor's native format for agent context rules
- Auto-loaded by Cursor AI on IDE startup
- Markdown-compatible (renders correctly in GitHub, VS Code)
- Signals "machine-readable documentation for AI agents"

**Compatibility**:
- All .mdc files are valid Markdown
- Can be read by any Markdown viewer
- GitHub renders them correctly
- Claude Code references them via CLAUDE.md links

---

## Navigation for AI Agents

### Cursor AI
- **Auto-Loaded**: All `.mdc` files in `.cursor/rules/` and subdirectories
- **Access**: Context automatically includes all ADRs on startup
- **Usage**: Reference ADRs directly (e.g., "Per ADR-0001, use monorepo structure")

### Claude Code
- **Entry Point**: Root `CLAUDE.md` file
- **Navigation Section**: "Documentation Navigation" links to `.cursor/rules/`
- **Deep Dive**: Follow links to specific ADR files for detailed context
- **Usage**: Ask Claude to "Review ADR-0002 for Gemini File Search decision"

---

## Cross-References

### Related Documentation

**Specifications** (`docs/specs/`):
- `Grant-Harness_Repository-Initiation-Plan.md` - Week 0-4 development roadmap

**Research** (`docs/research/`):
- `Australian Government Grant Sources.md` - 50+ target grant sources

**Test Data** (`docs/context/`):
- `test-companies/` - Test company profiles (EMEW, SolarTech, AI Solutions QLD)
- `grants/` - Sample grants and Gemini upload metadata

**Root Guides**:
- `CLAUDE.md` - Primary developer guide (entry point for all AI agents)
- `README.md` - Project overview for humans (to be created)

---

## Maintenance Guidelines

### When to Add an ADR
- Architectural decision with long-term impact
- Pattern that affects multiple components
- Decision that reverses or supersedes previous approach
- Non-obvious solution chosen after evaluating alternatives
- Decision that future developers/AI agents need to understand

### When NOT to Add an ADR
- Tactical implementation details
- Temporary workarounds or fixes
- Configuration changes without architectural impact
- Bug fixes that don't change patterns
- Personal coding style preferences

### Updating Existing ADRs
1. **Never edit existing ADRs** - they are historical records
2. **Supersede instead**: Create new ADR with "Supersedes: ADR-XXXX"
3. **Update old ADR**: Add "Superseded by: ADR-YYYY" in Consequences
4. **Update Index**: Change status to "Superseded" in both ADRs' Index rows

### ADR Lifecycle
```
Proposed → Accepted → Superseded
            ↓
     (if never superseded, stays Accepted)
```

---

## Quality Checklist

Before committing ADR changes:
- [ ] ADR_AGENT_PROTOCOL header present and unmodified
- [ ] 4-digit zero-padded ID (ADR-0001, not ADR-1)
- [ ] Explicit anchor `<a id="adr-XXXX"></a>` immediately after heading
- [ ] Index table updated and sorted by ID descending
- [ ] All required fields filled (Date, Status, Owner, Context, Alternatives, Decision, Consequences)
- [ ] Evidence and file references provided in Compliance/Verification
- [ ] If superseding: old ADR updated with "Superseded by" and status changed
- [ ] Concise prose (~200-300 words per ADR)
- [ ] AI agent guidance included in Compliance/Verification
- [ ] Cross-references to `docs/specs/` where appropriate

---

**Last Updated**: 2025-11-11
**Maintained By**: Project Infrastructure Team
**Questions?**: See root `CLAUDE.md` or open GitHub issue
