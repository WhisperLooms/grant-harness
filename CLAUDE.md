# Grant-Harness Project Context

Essential guidance for Grant-Harness development. For detailed specifications, see `.docs/specs/` and workflow instructions see `.cursor/rules/`.

## Project Overview

**Grant-Harness** - AI-powered platform for discovering and matching Australian government grants to SME businesses in recycling, renewable energy, manufacturing, and AI sectors.

- **Repository**: https://github.com/whisperlooms/grant-harness
- **Status**: Phase 1 - Prototype Development
- **Rules**: You MUST read and follow `.cursor/rules/rules.mdc`

**Current Phase**: Building Python-based proof-of-concept with Gemini File Search integration.

For comprehensive details:
- **Initiation Plan**: `.docs/specs/Grant-Harness_Repository-Initiation-Plan.md` - Complete Week 0-4 development roadmap
- **Grant Sources**: `.docs/research/Australian Government Grant Sources.md` - 50+ grant sources documented
- **Project Structure**: `.cursor/rules/folder-structure.mdc` - Repository organization
- **Architecture**: `.cursor/rules/ADR.mdc` - Platform-level architectural decisions

## CRITICAL: Application Assistance > Grant Discovery

**Strategic Priority** (per ADR-0003): The primary value proposition is **helping clients safely and efficiently complete grant applications with expert input**, not just finding grants.

### Core Requirements
1. **Accurate replica application forms** - NextJS forms matching government portals
2. **AI-populated with highly relevant information** - Query company docs for field answers
3. **Client control throughout** - Expert review and approval workflow
4. **Significantly easier than manual** - Target: <2 hours vs 10+ hours manual

### Phase 1 Focus (Weeks 1-4)
- **Week 1**: Ingest EMEW data, match to grants, select 2 target grants
- **Week 2**: Replicate 2 grant forms in NextJS (schema-driven dynamic generation)
- **Week 3**: AI population (70% auto-fill target) + expert review workflow
- **Week 4**: Collaboration (multi-stakeholder signoff) + PDF export

### What's Deferred to Phase 2
- Full scraper automation (50+ sources)
- Multi-company dashboard
- Advanced matching features
- Production-scale infrastructure

**Key Insight**: Grant matching is a means to an end. The real value is reducing application completion time from 10+ hours to <2 hours while maintaining quality and control.

## Existing Context: EMEW Bootstrap Strategy

**IMPORTANT** (per ADR-2053): We have existing research that accelerates Week 1 development:

### EMEW Corporate Documents
**Location**: `.docs/context/emew-context/corporate-info/*.pdf`
**Contents**: Existing EMEW corporate PDFs (business plans, capabilities, etc.)
**Usage**: Migrate to `.inputs/companies/c-emew/corporate/` → Upload to Gemini Company Corpus

### Grant Search Results
**Location**: `.docs/context/emew-context/grant-search/Grants_Summary_2025-10-29.md`
**Contents**: Comprehensive grant research with 8-10 high-priority grants already identified
**Grants**: BBI, IGP, VMA, BTV, ARP, International Partnerships Critical Minerals
**Usage**: Parse grant list → Download PDFs → Upload to Gemini Grant Corpus

### Quick Win Workflow (Week 1)
Instead of building scrapers from scratch:
1. **Day 1-2**: Migrate EMEW docs to `.inputs/`, upload to Gemini Company Corpus
2. **Day 3-4**: Parse grant summary, download 8-10 grant PDFs, upload to Gemini Grant Corpus
3. **Day 5**: Run matching, validate results, select 2 target grants for Week 2

This validates the matching workflow with real data before investing in scraper development.

## Development Approach: Prototype First

This project follows a **phased development pattern**:

### Phase 1: Python Prototype (Weeks 0-4)
1. Build in `back/grant-prototype/` directory
2. **Week 1**: Ingest existing EMEW docs + grant research (bootstrap approach)
3. **Week 2**: Build NextJS forms for 2 selected grants (schema-driven)
4. **Week 3**: AI population + expert review workflow
5. **Week 4**: Collaboration + PDF export + stakeholder demo

**Current**: Week 0 - Foundation Setup & Documentation (Days 1-2)

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

See `.docs/specs/Grant-Harness_Repository-Initiation-Plan.md` for detailed roadmap.

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

### IMPORTANT: Input Data Management Pattern (ADR-2052)

**Managed Input Data** (git-ignored):
```
back/grant-prototype/.inputs/        # Active working data (NOT tracked in git)
├── companies/
│   └── c-{company-id}/              # Per-company folder (e.g., c-emew)
│       ├── corporate/               # Corporate documents (PDFs)
│       ├── profile/                 # Generated profiles (JSON)
│       └── vector-db/               # Gemini upload metadata
└── grants/
    └── {jurisdiction}/              # By jurisdiction
        └── {grant-name}/            # Per-grant folder
            ├── guidelines.pdf
            ├── metadata.json
            └── vector-db/
```

**Static Reference Data** (tracked in git):
```
.docs/context/                       # Historical/reference data (tracked in git)
├── emew-context/                    # EMEW case study materials
│   ├── corporate-info/              # Source PDFs (migrate to .inputs/ for processing)
│   └── grant-search/                # Grant research results
└── test-companies/                  # Test profiles
```

**When to use which**:
- **Use `.inputs/`**: For active data processing, Gemini uploads, generated outputs
- **Use `.docs/context/`**: For static reference, documentation, research materials

**Setup** (Week 1 Day 1):
```bash
cd back/grant-prototype
mkdir -p .inputs/companies/c-emew/{corporate,profile,vector-db}
mkdir -p .inputs/grants/{federal,state-vic,state-nsw,state-qld}

# Add to .gitignore
echo "back/grant-prototype/.inputs/" >> .gitignore
```

### Mandatory Reading Before Coding

**BEFORE writing any code, read the appropriate workflow**:

| Working in... | Read FIRST | Then read |
|--------------|-----------|-----------|
| `back/grant-prototype/` | `.cursor/rules/backend/grant-prototype/ADR.mdc` | `.docs/specs/Grant-Harness_Repository-Initiation-Plan.md` |
| `back/grant-adk/` (future) | `.cursor/rules/backend/ADR.mdc` | `.cursor/rules/backend/workflow.mdc` |
| `front/grant-portal/` (future) | `.cursor/rules/frontend/ADR.mdc` | `.cursor/rules/frontend/workflow.mdc` + **`.cursor/rules/frontend/testing-workflow.mdc`** |
| Platform/Testing | `.cursor/rules/ADR.mdc` | `.docs/specs/Grant-Harness_Repository-Initiation-Plan.md` |

### ⚠️ CRITICAL: Frontend Form Testing Requirements

**MANDATORY BEFORE ANY FRONTEND PR**: When implementing or modifying forms, you MUST:

1. **Click through ALL form steps** using Playwright or browser automation
2. **Fill with mock data** to verify all fields accept input correctly
3. **Verify Next/Submit buttons** become enabled when forms are valid
4. **Test character counters** display and update in real-time
5. **Test conditional fields** show/hide correctly based on user input
6. **Document test execution** in commit message or create test evidence file

**Why**: Form validation issues (like disabled Next buttons) are NOT visible in code review and require live browser testing to detect.

**See**: `.cursor/rules/frontend/testing-workflow.mdc` for complete testing requirements and common issues.

**Example**: Issue #2 initial implementation had Step 2 Next button disabled despite valid form data because `mode: "onChange"` was missing. This was only discovered during manual user testing.

### 🎯 MANDATORY: Playwright MCP Browser Testing Before PR

**REQUIRED BEFORE HANDOFF**: Before creating a PR or handing back form implementations, you MUST:

1. **Start development server**: `npm run dev` in `front/grant-portal/`
2. **Use Playwright MCP tools** to automate browser testing:
   - `mcp__Claude_Playwright__browser_navigate` - Navigate to form
   - `mcp__Claude_Playwright__browser_type` - Fill text fields
   - `mcp__Claude_Playwright__browser_click` - Click buttons, radios, checkboxes
   - `mcp__Claude_Playwright__browser_snapshot` - Verify page state
   - `mcp__Claude_Playwright__browser_take_screenshot` - Capture evidence
3. **Test complete user flow**: Fill ALL steps from start to finish with mock data
4. **Verify Next/Submit buttons**: Confirm buttons become enabled after valid input
5. **Save test evidence**:
   - Screenshots: `.docs/screenshots/test-evidence/step{N}-{state}.png`
   - Form data JSON: `.docs/screenshots/test-evidence/{form-name}-test-data.json`
6. **Reference in PR**: Link to screenshots and test data JSON in PR description

**Evidence Format**:
```json
{
  "test_session": {
    "date": "2025-11-15T02:36:00Z",
    "tester": "Claude Code with Playwright MCP",
    "form": "IGP Commercialisation Application",
    "status": "Completed Steps 1-7"
  },
  "step1_eligibility": { "..." },
  "test_notes": {
    "playwright_mcp_tools_used": ["browser_navigate", "browser_click", ...]
  }
}
```

**Why**: Automated browser testing with Playwright MCP provides repeatable evidence that forms work end-to-end, catches validation issues before PR review, and scales as the project grows.

**Reference**: Based on [OneRedOak/claude-code-workflows design-review pattern](https://github.com/OneRedOak/claude-code-workflows/tree/main/design-review)

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
python -m matching.grant_matcher .docs/context/test-companies/emew-profile.json
```

### Claude Slash Commands

**Complete Workflow**: g → c → m → a → p → s

Commands are organized by workflow phase using a letter + 2-digit number system:

#### G-Series: Grant Discovery & Data Collection
- `/g01-grant-lists` - Compile comprehensive grant list (CSV output)
- `/g02-grant-docs <csv-path>` - Scrape full details + download documents
- `/g03-gemini-upload` - Upload grants to Gemini File Search
- `/g04-grant-sync` - Re-scrape sources, detect changes/new grants
- `/g05-grant-validate` - Verify data quality and completeness

#### C-Series: Company Profiling
- `/c01-company-scrape <company-url>` - Extract data from company website
- `/c02-company-profile <company-id>` - Build structured profile
- `/c03-company-vector <company-id>` - Create company vector database
- `/c04-company-docs <company-id> <docs-dir>` - Process uploaded documents
- `/c05-company-validate <company-id>` - Validate profile completeness

#### M-Series: Matching & Analysis
- `/m01-match-grants <company-id>` - AI-powered grant matching
- `/m02-match-explain <company-id> <grant-id>` - Deep-dive match reasoning
- `/m03-match-rank <company-id>` - Sort/filter by relevance, funding, deadline
- `/m04-match-eligibility <company-id> <grant-id>` - Detailed eligibility check
- `/m05-match-export <company-id>` - Export results to CSV/PDF/PPTX

#### A-Series: Application Replication (Phase 2)
- `/a01-app-identify <grant-id>` - Identify application form structure
- `/a02-app-extract <grant-id>` - Extract questions/fields from form
- `/a03-app-replicate <grant-id>` - Generate NextJS form component
- `/a04-app-map <company-id> <grant-id>` - Map data to form fields
- `/a05-app-validate <company-id> <grant-id>` - Check form completeness

#### P-Series: Population & Collaboration (Phase 2)
- `/p01-populate-ai <company-id> <grant-id>` - AI auto-fill form fields
- `/p02-populate-review <company-id> <grant-id>` - Mark fields for review
- `/p03-populate-comment <company-id> <grant-id>` - Add consultant comments
- `/p04-populate-docs <company-id> <grant-id>` - Attach supporting documents
- `/p05-populate-export <company-id> <grant-id>` - Generate draft PDF

#### S-Series: Signoff & Submission (Phase 2-3)
- `/s01-signoff-request <company-id> <grant-id>` - Request approvals
- `/s02-signoff-track <company-id> <grant-id>` - Monitor approval status
- `/s03-signoff-changes <company-id> <grant-id>` - Log review changes
- `/s04-signoff-finalize <company-id> <grant-id>` - Lock for submission
- `/s05-submit-portal <company-id> <grant-id>` - Upload to grant portal

#### Utility Commands
- `/setup-repo` - Initialize development environment
- `/test-prototype` - Run full test suite

## Architecture Overview

### Phase 1: Prototype Architecture

**Components**:
- **Scrapers**: Extract grant data from government websites using AI-powered crawl4ai
  - `scrapers/base_crawler.py` - Common async crawler functionality
  - `scrapers/grant_list_crawler.py` - High-level list extraction
  - `scrapers/grant_detail_crawler.py` - Deep scrape individual grants
  - `scrapers/company_scraper.py` - Company website scraping
  - `scrapers/sources/{federal,vic,nsw,qld}.py` - Source-specific configs
  - **Technology**: crawl4ai with Gemini LLM extraction (see ADR-2050)

- **Gemini Store**: Upload and query grants via Gemini File API
  - `gemini_store/file_manager.py` - File upload management
  - `gemini_store/corpus_builder.py` - Corpus organization
  - `gemini_store/query_engine.py` - Semantic search

- **Matching Engine**: AI-powered company-to-grant matching
  - `matching/company_analyzer.py` - Analyze company profiles
  - `matching/grant_matcher.py` - Match companies to grants

- **Models**: Pydantic schemas for data validation
  - `models/entities.py` - Grant, Company, Match schemas

**Data Flow**:
1. **Grant Discovery**: crawl4ai scraper → CSV list → detailed JSON + PDFs
2. **Upload**: Grant docs → Gemini File Search vector database
3. **Company Profiling**: Website scrape → structured profile → company vector DB
4. **Matching**: Semantic search → AI relevance scoring → ranked matches
5. **Application** (Phase 2): Form replication → AI population → collaborative editing → submission

**Configuration** (`.env`):
```env
# Gemini API (required)
GOOGLE_API_KEY=your_api_key_here

# Crawl4AI (uses Gemini for extraction)
CRAWL4AI_MODEL=gemini-1.5-pro
CRAWL4AI_USE_GEMINI=true

# Grant Filtering
GRANT_FROM_DATE=2026-01-01

# Scraper Settings
SCRAPER_DOWNLOAD_DELAY=2
PLAYWRIGHT_HEADLESS=true
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

See `.docs/research/Australian Government Grant Sources.md` for comprehensive list of 50+ sources.

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
- **EMEW**: `.docs/context/test-companies/emew-profile.json` - Metal recovery/recycling
- **SolarTech** (to be created): Solar panel manufacturing startup
- **AI Solutions QLD** (to be created): AI consulting for manufacturers

### Sample Grants
- `.docs/context/grants/source-documents/` - Manually collected grant PDFs
- `.docs/context/grants/indexed-grants.json` - Scraped grant data
- `.docs/context/grants/gemini-file-index.json` - Gemini upload metadata

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
git commit -m ".docs(adr): add ADR-0001 Gemini File Search decision"
```

### Task Completion Checklist
- [ ] All acceptance criteria met (check initiation plan)
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] ADR created if architectural decision
- [ ] Commit with conventional commit message

## Documentation Navigation

### Quick References
- **Initiation Plan**: `.docs/specs/Grant-Harness_Repository-Initiation-Plan.md` - Week 0-4 roadmap
- **Grant Sources**: `.docs/research/Australian Government Grant Sources.md` - Target websites
- **Project Structure**: `.cursor/rules/folder-structure.mdc` - Directory guide

### Development Context Routing

**When working on Grant Prototype (Phase 1)**:
1. **Tasks**: `.docs/specs/Grant-Harness_Repository-Initiation-Plan.md` - Week-by-week plan
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
- **Platform ADRs**: `.cursor/rules/ADR.mdc` - Platform-wide decisions
- **Development Rules**: `.cursor/rules/rules.mdc` - Full development guidelines

### Architectural Decision Records (ADRs)

All ADRs follow **ADR_AGENT_PROTOCOL v1.0** format. See emew-agents `.cursor/rules/ADR.mdc` for reference.

**Number Range Convention**:
- **0001-0999**: Platform-level decisions
- **1000-1999**: Frontend-specific decisions
- **2000-2049**: Backend infrastructure (shared patterns)
- **2050-2099**: Grant prototype (tactical decisions)
- **2100-2499**: Grant ADK (production agents)

**Platform ADRs** - `.cursor/rules/ADR.mdc`:
- ADR-0001: Monorepo Structure Decision (includes `.inputs/` folder pattern)
- ADR-0002: Gemini File Search for Vector Storage
- ADR-0003: Application-First Prototype Strategy (Week 2-4 focus on forms/AI/collaboration)

**Backend Infrastructure ADRs** - `.cursor/rules/backend/ADR.mdc`:
- ADR-2001: Python + uv Package Management (to be created)
- ADR-2002: Pydantic for Data Validation (to be created)

**Grant Prototype ADRs** - `.cursor/rules/backend/grant-prototype/ADR.mdc`:
- ADR-2050: crawl4ai for AI-Powered Web Scraping
- ADR-2051: Gemini Dual-Corpus Architecture (separate Grant + Company corpora)
- ADR-2052: Input Data Management Pattern (`.inputs/` folder structure)
- ADR-2053: EMEW Bootstrap Strategy (leverage existing docs/research)

**Frontend ADRs** - `.cursor/rules/frontend/ADR.mdc`:
- ADR-1001: React Hook Form + Shadcn UI Foundation
- ADR-1002: Schema-Driven Form Generation (JSON schema → NextJS form)
- ADR-1003: Multi-Step Form State Management (Context API → Supabase)
- ADR-1004: Collaboration Backend Decision (Supabase proposed, Week 3)
- ADR-1005: PDF Export Strategy (react-pdf for government-matching format)

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

**Phase 1 (Prototype)** - Application-First Focus:
- **Week 1**: EMEW docs + 8-10 grants in Gemini, matching validates manual research (BBI + IGP as top 2)
- **Week 2**: 2 NextJS forms replicating government portals (IGP + BBI/VMA)
- **Week 3**: 70% of form fields auto-populated with EMEW data
- **Week 4**: **<2 hour application completion vs 10+ hours manual** (time savings demonstrated)

**Phase 2 (MVP)**:
- 50 companies using platform
- 100+ grant applications generated
- Multi-company dashboard with 5-10 simultaneous clients

**Phase 3 (Scale)**:
- 500+ companies
- $10M+ in grants secured by users
- 50+ grant sources automated

---

**Last Updated**: 2025-11-12
**Current Phase**: Week 0 - Phase 0 Documentation Complete (Days 1-2)
**Next Milestone**: Week 1 - EMEW Bootstrap & Grant Matching
**Status**: Documentation updated, ready for Week 1 implementation
**Key Deliverables Complete**: ADR-0003 (Application-First), ADR-2051-2053 (Backend), ADR-1001-1005 (Frontend)
