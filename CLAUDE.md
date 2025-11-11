# Grant-Harness Project Context

Essential guidance for Grant-Harness development. For detailed specifications, see `docs/specs/` and workflow instructions see `.cursor/rules/`.

## Project Overview

**Grant-Harness** - AI-powered platform for discovering and matching Australian government grants to SME businesses in recycling, renewable energy, manufacturing, and AI sectors.

- **Repository**: https://github.com/whisperlooms/grant-harness
- **Status**: Phase 1 - Prototype Development
- **Rules**: You MUST read and follow `.cursor/rules/rules.mdc`

**Current Phase**: Building Python-based proof-of-concept with Gemini File Search integration.

For comprehensive details:
- **Initiation Plan**: `docs/specs/Grant-Harness_Repository-Initiation-Plan.md` - Complete Week 0-4 development roadmap
- **Grant Sources**: `docs/research/Australian Government Grant Sources.md` - 50+ grant sources documented
- **Project Structure**: `.cursor/rules/folder-structure.mdc` - Repository organization
- **Architecture**: `.cursor/rules/platform/ADR.mdc` - Platform-level architectural decisions

## Development Approach: Prototype First

This project follows a **phased development pattern**:

### Phase 1: Python Prototype (Weeks 0-4)
1. Build in `back/grant-prototype/` directory
2. Implement scrapers for 4 sources (GrantConnect, VIC, NSW, QLD)
3. Upload grants to Gemini File API
4. Test matching with EMEW case study
5. Output to JSON for stakeholder review

**Current**: Week 0 - Foundation Setup

### Phase 2: MVP with Basic UI (Weeks 5-8)
1. Refactor prototype into production ADK agents in `back/grant-adk/`
2. Create Next.js frontend in `front/grant-portal/`
3. Add PostgreSQL for structured data
4. Deploy to Google Cloud Platform

### Phase 3: Production Scale (Weeks 9-12)
1. Add all 50+ grant sources
2. Implement multi-stakeholder workflow
3. Generate pre-populated applications
4. Deploy to production

See `docs/specs/Grant-Harness_Repository-Initiation-Plan.md` for detailed roadmap.

## Directory Structure & Component Mapping

**CRITICAL**: This project uses a dual-folder pattern for each component.

| Component | Physical Directory | What Lives Here |
|-----------|-------------------|-----------------|
| **Grant Prototype** | `back/grant-prototype/` | Python scrapers, Gemini integration, matching engine (Phase 1) |
| **Grant ADK** | `back/grant-adk/` | Production ADK agents (Phase 2) |
| **Grant Portal** | `front/grant-portal/` | Next.js frontend (Phase 2) |
| **Platform Rules** | `.cursor/rules/` | Cross-cutting architectural decisions |

**File Path Patterns**:
- `back/grant-prototype/**/*.py` - Prototype utilities
- `back/grant-adk/**/*.py` - Production ADK agents (future)
- `front/grant-portal/**/*.tsx` - Next.js frontend (future)
- `.cursor/rules/**/*.mdc` - Architecture documentation
- `.claude/commands/**/*.md` - Claude slash commands

### Mandatory Reading Before Coding

**BEFORE writing any code, read the appropriate workflow**:

| Working in... | Read FIRST | Then read |
|--------------|-----------|-----------|
| `back/grant-prototype/` | `.cursor/rules/backend/grant-prototype/ADR.mdc` | `docs/specs/Grant-Harness_Repository-Initiation-Plan.md` |
| `back/grant-adk/` (future) | `.cursor/rules/backend/ADR.mdc` | `.cursor/rules/backend/workflow.mdc` |
| `front/grant-portal/` (future) | `.cursor/rules/frontend/ADR.mdc` | `.cursor/rules/frontend/workflow.mdc` |
| Platform/Testing | `.cursor/rules/platform/ADR.mdc` | `docs/specs/Grant-Harness_Repository-Initiation-Plan.md` |

## Key Commands

### Grant Prototype (Phase 1) - In Development
```bash
# Setup
cd back/grant-prototype
uv sync                                         # Install dependencies
pytest tests/ -v                                # Run tests

# Scraping
python -m scrapers.federal_grants               # Scrape GrantConnect
python -m scrapers.vic_grants                   # Scrape Sustainability Victoria
python -m scrapers.nsw_grants                   # Scrape NSW Grants Portal
python -m scrapers.qld_grants                   # Scrape Business Queensland

# Gemini Upload
python -m gemini_store.file_manager             # Upload grants to Gemini
python -m gemini_store.query_engine             # Query grants

# Matching
python -m matching.grant_matcher docs/context/test-companies/emew-profile.json
```

### Claude Slash Commands (When Set Up)
```bash
# Available commands:
# /scrape-grants federal vic nsw qld    - Scrape all grant sources
# /upload-grants-to-gemini              - Upload to Gemini File API
# /match-grants <company-profile-path>  - Match company to grants
# /test-prototype                       - Run full test suite
```

## Architecture Overview

### Phase 1: Prototype Architecture

**Components**:
- **Scrapers**: Extract grant data from government websites
  - `scrapers/base_scraper.py` - Common functionality
  - `scrapers/federal_grants.py` - GrantConnect scraper
  - `scrapers/vic_grants.py` - Sustainability Victoria
  - `scrapers/nsw_grants.py` - NSW Grants Portal
  - `scrapers/qld_grants.py` - Business Queensland

- **Gemini Store**: Upload and query grants via Gemini File API
  - `gemini_store/file_manager.py` - File upload management
  - `gemini_store/corpus_builder.py` - Corpus organization
  - `gemini_store/query_engine.py` - Semantic search

- **Matching Engine**: AI-powered company-to-grant matching
  - `matching/company_analyzer.py` - Analyze company profiles
  - `matching/grant_matcher.py` - Match companies to grants

- **Models**: Pydantic schemas for data validation
  - `models/entities.py` - Grant, Company, Match schemas

**Data Flow**: Scraper → JSON → Gemini File API → Semantic Search → Match → JSON Output

**Configuration** (`.env` - to be created):
```env
GOOGLE_API_KEY=your_api_key_here
GEMINI_PROJECT_ID=your_project_id
```

## Grant Data Schema

```python
class Grant(BaseModel):
    id: str                           # Unique identifier
    title: str                        # Grant program name
    agency: str                       # Federal/State agency
    jurisdiction: str                 # Federal/VIC/NSW/QLD
    sectors: list[str]                # recycling, renewable-energy, manufacturing, ai
    description: str                  # Full description
    eligibility: str                  # Who can apply
    funding_range: tuple[int, int]    # Min, max funding
    opens: date | None                # Opening date
    closes: date | None               # Closing date
    url: str                          # Application URL
    status: str                       # open, closed, upcoming
    scraped_at: datetime              # Last updated

class Company(BaseModel):
    id: str
    name: str
    industry: str
    description: str
    state: str                        # VIC/NSW/QLD/WA/SA/TAS/NT/ACT
    annual_revenue: int
    employee_count: int
    sectors: list[str]                # Match grant sectors
    looking_for: list[str]            # Grant types of interest

class Match(BaseModel):
    company_id: str
    grant_id: str
    relevance_score: float            # 0.0-1.0
    reasoning: str                    # Why this grant matches
    key_criteria_met: list[str]
    potential_funding: int
```

## Target Grant Sources

See `docs/research/Australian Government Grant Sources.md` for comprehensive list of 50+ sources.

**Phase 1 Priority Sources** (4 scrapers):
1. **GrantConnect** - Federal mandatory listing (all federal grants)
2. **Sustainability Victoria** - Environmental and circular economy grants
3. **NSW Grants Portal** - NSW government grants
4. **Business Queensland** - QLD business support programs

**Key Sectors**:
- Recycling & Circular Economy
- Renewable Energy
- Manufacturing & Advanced Manufacturing
- Artificial Intelligence & Digital

## Test Data

### Test Companies
- **EMEW**: `docs/context/test-companies/emew-profile.json` - Metal recovery/recycling
- **SolarTech** (to be created): Solar panel manufacturing startup
- **AI Solutions QLD** (to be created): AI consulting for manufacturers

### Sample Grants
- `docs/context/grants/source-documents/` - Manually collected grant PDFs
- `docs/context/grants/indexed-grants.json` - Scraped grant data
- `docs/context/grants/gemini-file-index.json` - Gemini upload metadata

## Environment Setup

### Required Environment Variables

**Phase 1 (Prototype)**:
```bash
# Gemini API Configuration (Required)
GOOGLE_API_KEY=your_google_api_key_here

# Optional: Use Vertex AI instead
GOOGLE_GENAI_USE_VERTEXAI=1
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_LOCATION=us-east4
```

**Phase 2 (Production ADK)**:
```bash
# To be configured in Phase 2
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1
DATABASE_URL=postgresql://...
```

## Testing Strategy

### Phase 1: Prototype Testing

**Unit Tests**:
```bash
cd back/grant-prototype
pytest tests/test_scrapers.py -v
pytest tests/test_gemini_store.py -v
pytest tests/test_matching.py -v
```

**Integration Tests**:
1. Scrape 10 grants from GrantConnect
2. Upload to Gemini File API
3. Query: "grants for metal recycling companies in Victoria"
4. Match EMEW profile
5. Verify relevance score > 0.8

**Test Acceptance Criteria** (Week 1):
- [ ] Scrape 10 real grants successfully
- [ ] Upload 5 grants to Gemini without errors
- [ ] Basic query returns relevant results
- [ ] EMEW profile matches to expected grants

**Test Acceptance Criteria** (Week 4):
- [ ] All 4 scrapers working
- [ ] 50+ grants in Gemini corpus
- [ ] EMEW match relevance > 0.8
- [ ] <3 second query latency

## Critical Configuration & Known Issues

### IMPORTANT: Gemini API vs. Vertex AI

**Phase 1 uses Gemini API** (simpler setup):
```bash
# Use this for prototype
GOOGLE_API_KEY=your_api_key_here
```

**Phase 2 will use Vertex AI** (production):
```bash
# Use this for ADK agents
GOOGLE_GENAI_USE_VERTEXAI=1
GOOGLE_CLOUD_PROJECT=your_project_id
```

### IMPORTANT: Use uv for Package Management

```bash
# CORRECT
cd back/grant-prototype
uv sync                    # Install dependencies
uv add scrapy              # Add new dependency
uv run pytest tests/       # Run tests in venv

# WRONG
pip install -r requirements.txt  # Don't use pip
poetry install                   # Don't use Poetry
```

### Known Issues & Solutions

**Issue: Rate Limiting from Government Websites**
- **Cause**: Too many requests per second
- **Solution**: Use Scrapy's DOWNLOAD_DELAY setting (2 seconds recommended)

**Issue: Grant Dates Not Standardized**
- **Cause**: Different date formats across jurisdictions
- **Solution**: Use date parser library with multiple format attempts

**Issue: PDF Parsing Failures**
- **Cause**: Complex PDF layouts
- **Solution**: Upload raw PDFs to Gemini, let AI extract info

## Git Workflow

### Branch Strategy
Follow `.cursor/rules/rules.mdc` section "Git Workflow & Version Control":

```bash
# Feature branches
git checkout -b feat/scraper-federal     # Week 1 task
git checkout -b feat/gemini-integration  # Week 1 task
git checkout -b feat/matching-engine     # Week 2 task

# Commit messages (Conventional Commits)
git commit -m "feat(scraper): implement GrantConnect scraper"
git commit -m "fix(gemini): handle upload timeout errors"
git commit -m "docs(adr): add ADR-0001 Gemini File Search decision"
```

### Task Completion Checklist
- [ ] All acceptance criteria met (check initiation plan)
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] ADR created if architectural decision
- [ ] Commit with conventional commit message

## Documentation Navigation

### Quick References
- **Initiation Plan**: `docs/specs/Grant-Harness_Repository-Initiation-Plan.md` - Week 0-4 roadmap
- **Grant Sources**: `docs/research/Australian Government Grant Sources.md` - Target websites
- **Project Structure**: `.cursor/rules/folder-structure.mdc` - Directory guide

### Development Context Routing

**When working on Grant Prototype (Phase 1)**:
1. **Tasks**: `docs/specs/Grant-Harness_Repository-Initiation-Plan.md` - Week-by-week plan
2. **Architecture**: `.cursor/rules/backend/grant-prototype/ADR.mdc` - Prototype decisions
3. **Structure**: `.cursor/rules/backend/folder-structure.mdc` - Backend directory navigation

**When working on Grant ADK (Phase 2)**:
1. **Workflow**: `.cursor/rules/backend/workflow.mdc` - ADK development process
2. **Architecture**: `.cursor/rules/backend/ADR.mdc` - Backend infrastructure ADRs
3. **Structure**: `.cursor/rules/backend/folder-structure.mdc` - Directory navigation

**When working on Grant Portal (Phase 2)**:
1. **Workflow**: `.cursor/rules/frontend/workflow.mdc` - Next.js development process
2. **Architecture**: `.cursor/rules/frontend/ADR.mdc` - Frontend ADRs
3. **Structure**: `.cursor/rules/frontend/folder-structure.mdc` - Frontend directory navigation

**Platform/Cross-Cutting**:
- **Repository Structure**: `.cursor/rules/folder-structure.mdc` - Full repo navigation
- **Platform ADRs**: `.cursor/rules/platform/ADR.mdc` - Platform-wide decisions
- **Development Rules**: `.cursor/rules/rules.mdc` - Full development guidelines

### Architectural Decision Records (ADRs)

All ADRs follow **ADR_AGENT_PROTOCOL v1.0** format. See emew-agents `.cursor/rules/ADR.mdc` for reference.

**Number Range Convention**:
- **0001-0999**: Platform-level decisions
- **1000-1999**: Frontend-specific decisions
- **2000-2049**: Backend infrastructure (shared patterns)
- **2050-2099**: Grant prototype (tactical decisions)
- **2100-2499**: Grant ADK (production agents)

**Platform ADRs** - `.cursor/rules/platform/ADR.mdc`:
- ADR-0001: Repository Structure Decision (to be created)
- ADR-0002: Gemini File Search vs Self-Hosted Vector DB (to be created)
- ADR-0003: Scrapy Framework for Web Scraping (to be created)

**Backend Infrastructure ADRs** - `.cursor/rules/backend/ADR.mdc`:
- ADR-2001: Python + uv Package Management (to be created)
- ADR-2002: Pydantic for Data Validation (to be created)

**Grant Prototype ADRs** - `.cursor/rules/backend/grant-prototype/ADR.mdc`:
- ADR-2051: Phase 1 Scraper Architecture (to be created)
- ADR-2052: Gemini API vs Vertex AI for Prototype (to be created)

### When to Create New ADRs

See `.cursor/rules/rules.mdc` section "Architecture Decision Records (ADR) Protocol" for full guidance.

**Create a new ADR when**:
- Selecting or changing a foundational technology (framework, runtime, database)
- Making architectural decisions that affect multiple components
- Establishing development patterns or conventions
- Choosing between significant alternatives (e.g., Scrapy vs requests)

**Do NOT create ADR for**:
- Tactical implementation details
- Temporary workarounds
- Bug fixes without pattern changes
- Personal coding preferences

## Project-Specific Notes

### Grant Discovery Context

**Problem**: Australian SMEs in target sectors lose opportunities due to:
- 50+ fragmented grant sources
- No centralized discovery
- Manual, time-intensive matching
- Complex application requirements

**Solution**: Grant-Harness provides:
1. **Discovers**: Automated scraping of 50+ sources
2. **Matches**: AI-powered semantic matching
3. **Assists**: Pre-populated application generation
4. **Manages**: Multi-stakeholder review workflow

### Target Users

**Primary**: SME businesses (10-200 employees) in:
- Recycling & Circular Economy
- Renewable Energy
- Manufacturing
- Artificial Intelligence

**Secondary**: Grant consultants managing multiple clients
**Tertiary**: Business advisors and accountants

### Success Metrics

**Phase 1 (Prototype)**:
- Successfully match 10 test companies to grants with 80%+ relevance
- Scrape and index 50+ grants from 4 sources

**Phase 2 (MVP)**:
- 50 companies using platform
- 100+ grant applications generated
- <5 second query latency

**Phase 3 (Scale)**:
- 500+ companies
- $10M+ in grants secured by users
- 50+ grant sources automated

---

**Last Updated**: 2025-11-11
**Current Phase**: Week 0 - Foundation Setup (Days 1-5)
**Next Milestone**: Week 1 - First Working Scraper
**Status**: Repository initialization in progress
