# **Grant-Harness: Repository Initiation Plan**

## **Executive Decision: Start Fresh Repository**

### **Recommendation: CREATE NEW REPOSITORY**

**Rationale:**

**Why NOT adapt the existing repo:**

1. **Architecture Mismatch**: Original was built for immediate grant response; new version is strategic product platform  
2. **Technical Debt**: Rushed implementation likely has shortcuts unsuitable for long-term product  
3. **Clean ADR Implementation**: Starting fresh lets you implement ADR framework properly from day 1  
4. **Psychological Reset**: Clear signal this is "the real version" not "patched-up prototype"  
5. **Git History**: Clean commit history showing strategic decision-making process  
6. **Dependency Freshness**: Start with latest versions of all tools/libraries

**What to salvage from old repo:**

* Any working scraper code (review and port if quality is good)  
* Research artifacts about grant sources  
* Documentation about grant application processes  
* Test data or example grants

**Action for old repo:**

* Archive it (rename to `grant-harness-archive` or `grant-harness-v0`)  
* Don't delete \- may have useful reference materials  
* Add README.md stating: "Archived. See grant-harness for current version."

---

## **Repository Initiation Document**

### **Project Name: Grant-Harness**

**Version:** 2.0 (Strategic Rebuild)  
 **Start Date:** \[Insert Date\]  
 **Repository:** github.com/whisperlooms/grant-harness  
 **Status:** Foundation Phase

---

## **1\. Project Vision & Scope**

### **Problem Statement**

Australian SMEs in recycling, renewable energy, manufacturing, and AI sectors lose opportunities due to:

* 50+ fragmented grant sources across Federal and state governments  
* No centralized discovery mechanism  
* Manual, time-intensive matching process  
* Complex application requirements  
* Lack of expertise in grant writing

### **Solution**

Grant-Harness is an AI-powered platform that:

1. **Discovers**: Automatically scrapes and indexes 50+ government grant sources  
2. **Matches**: Uses AI to match companies to relevant grants based on semantic understanding  
3. **Assists**: Generates pre-populated grant application drafts  
4. **Manages**: Provides workflow for multi-stakeholder review and signoff

### **Target Users**

* **Primary**: SME businesses (10-200 employees) in target sectors  
* **Secondary**: Grant consultants managing multiple clients  
* **Tertiary**: Business advisors and accountants

### **Success Metrics**

* **Phase 1 (Prototype)**: Successfully match 10 test companies to grants with 80%+ relevance  
* **Phase 2 (MVP)**: 50 companies using platform, 100+ grant applications generated  
* **Phase 3 (Scale)**: 500+ companies, $10M+ in grants secured by users

---

## **2\. Technical Architecture Decisions**

### **Core Technology Stack**

**Backend:**

* Python 3.11+ (grant processing, scraping, AI integration)  
* Google Gemini API with File Search (semantic matching, vector storage)  
* PostgreSQL (structured data: users, companies, applications)  
* FastAPI or tRPC (API layer)

**Frontend:**

* Next.js 14+ (App Router)  
* TypeScript  
* Tailwind CSS  
* NextAuth.js (authentication)

**Infrastructure:**

* Google Cloud Platform (aligned with Gemini)  
* Docker (containerization)  
* GitHub Actions (CI/CD)

**Data Storage:**

* PostgreSQL (users, companies, applications, metadata)  
* Gemini File API (grant documents, vector search)  
* Object Storage (PDF storage, backups)

### **Key Architectural Decisions (Preview \- Full ADRs to follow)**

**ADR-0001: Multi-Repo Structure**

* Monorepo with `platform/`, `back/`, `front/` organization  
* Mirrors emew-agents pattern for consistency

**ADR-0002: Gemini File Search for Vector Storage**

* Use Gemini's managed file search vs. self-hosted vector DB  
* Rationale: 99% cost reduction, built-in citations, faster MVP

**ADR-0003: Scrapy Framework for Web Scraping**

* Production-grade scraping vs. ad-hoc requests/BeautifulSoup  
* Rationale: Better error handling, rate limiting, maintainability

---

## **3\. Repository Structure**

```
grant-harness/
├── .github/
│   ├── workflows/              # CI/CD pipelines
│   └── ISSUE_TEMPLATE/         # Bug, feature templates
│
├── .cursor/
│   └── rules/                  # Cursor IDE rules
│       ├── platform/
│       │   └── ADR.mdc        # Platform decisions (0001-0999)
│       ├── backend/
│       │   ├── ADR.mdc        # Backend decisions (2000-2999)
│       │   └── grant-prototype/
│       │       └── ADR.mdc    # Prototype tactical (2050-2099)
│       └── frontend/
│           └── ADR.mdc        # Frontend decisions (1000-1999)
│
├── .claude/
│   └── commands/              # Claude slash commands
│       ├── setup-repo.md
│       ├── scrape-grants.md
│       ├── upload-to-gemini.md
│       ├── match-grants.md
│       └── test-emew.md
│
├── docs/
│   ├── specs/                 # SpecKit specifications
│   ├── research/              # Grant source research
│   ├── architecture/          # Architecture diagrams
│   └── context/
│       ├── grants/            # Indexed grant data
│       │   ├── indexed-grants.json
│       │   ├── gemini-file-index.json
│       │   └── source-documents/
│       └── test-companies/
│           └── emew-profile.json
│
├── back/
│   ├── grant-prototype/       # Phase 1: Python prototype
│   │   ├── scrapers/
│   │   │   ├── __init__.py
│   │   │   ├── base_scraper.py
│   │   │   ├── federal_grants.py
│   │   │   ├── vic_grants.py
│   │   │   ├── nsw_grants.py
│   │   │   └── qld_grants.py
│   │   ├── gemini_store/
│   │   │   ├── __init__.py
│   │   │   ├── file_manager.py
│   │   │   ├── corpus_builder.py
│   │   │   └── query_engine.py
│   │   ├── matching/
│   │   │   ├── __init__.py
│   │   │   ├── company_analyzer.py
│   │   │   └── grant_matcher.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── entities.py
│   │   ├── tests/
│   │   │   ├── test_scrapers.py
│   │   │   ├── test_gemini_store.py
│   │   │   └── test_matching.py
│   │   ├── pyproject.toml
│   │   └── README.md
│   │
│   └── grant-adk/             # Phase 2: Production ADK agents
│       └── (future)
│
├── front/
│   └── grant-portal/          # Phase 2: Next.js application
│       └── (future)
│
├── CLAUDE.md                  # Project context for Claude
├── README.md                  # Project overview
├── .gitignore
└── LICENSE

```

---

## **4\. Week 0: Foundation Setup (Days 1-5)**

### **Day 1: Repository & Environment Setup**

**Tasks:**

1. Create new GitHub repository: `whisperlooms/grant-harness`  
2. Initialize with README.md, LICENSE, .gitignore  
3. Set up local development environment  
4. Archive old repository

**Deliverables:**

* \[ \] New repo created and cloned locally  
* \[ \] Old repo archived and renamed  
* \[ \] Python 3.11+ virtual environment configured  
* \[ \] Git commit: "feat: initialize grant-harness repository"

**Commands:**

```shell
# Create new repo on GitHub first, then:
git clone git@github.com:whisperlooms/grant-harness.git
cd grant-harness

# Set up Python environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install --upgrade pip

# Create initial structure
mkdir -p .cursor/rules/{platform,backend/grant-prototype,frontend}
mkdir -p .claude/commands
mkdir -p docs/{specs,research,architecture,context/grants/source-documents,context/test-companies}
mkdir -p back/grant-prototype/{scrapers,gemini_store,matching,models,tests}

# Initialize git
git add .
git commit -m "feat: initialize repository structure"
```

---

### **Day 2: Core Documentation & ADR Framework**

**Tasks:**

1. Create CLAUDE.md with project context  
2. Write ADR-0001: Repository Structure Decision  
3. Write ADR-0002: Gemini File Search Decision  
4. Set up .cursor/rules framework  
5. Create initial README.md

**Deliverables:**

* \[ \] CLAUDE.md with comprehensive project context  
* \[ \] ADR-0001 documenting monorepo structure  
* \[ \] ADR-0002 documenting Gemini File Search choice  
* \[ \] README.md with project overview and setup instructions  
* \[ \] Git commit: "docs: add core documentation and ADR framework"

**ADR Template:**

```
# ADR-000X: [Title]

**Status:** Accepted  
**Date:** YYYY-MM-DD  
**Deciders:** [Your Name]  
**Context Tags:** [architecture, infrastructure, etc.]

## Context and Problem Statement
[What decision needs to be made and why?]

## Decision Drivers
- [Driver 1]
- [Driver 2]
- [Driver 3]

## Considered Options
1. [Option 1]
2. [Option 2]
3. [Option 3]

## Decision Outcome
**Chosen option:** [Option X]

**Reasoning:**
[Detailed explanation of why this option was chosen]

### Consequences
**Positive:**
- [Benefit 1]
- [Benefit 2]

**Negative:**
- [Trade-off 1]
- [Trade-off 2]

**Neutral:**
- [Consideration 1]

## Implementation Notes
[Any specific notes about how to implement this decision]

## Related Decisions
- [Link to ADR-000Y]
- [Link to ADR-000Z]

## References
- [External link 1]
- [External link 2]
```

---

### **Day 3: Python Environment & Dependencies**

**Tasks:**

1. Set up pyproject.toml with UV package manager  
2. Install core dependencies  
3. Configure development tools (black, ruff, pytest)  
4. Create base Python modules  
5. Set up pre-commit hooks

**Deliverables:**

* \[ \] pyproject.toml configured  
* \[ \] All dependencies installed  
* \[ \] Linting and formatting configured  
* \[ \] Pre-commit hooks working  
* \[ \] Git commit: "build: configure Python environment and dependencies"

**pyproject.toml:**

```
[project]
name = "grant-harness-prototype"
version = "0.1.0"
description = "AI-powered Australian government grant discovery and matching platform"
authors = [{name = "Whisperlooms", email = "your-email@example.com"}]
requires-python = ">=3.11"
dependencies = [
    "google-generativeai>=0.3.0",      # Gemini API
    "google-cloud-aiplatform>=1.38.0", # Vertex AI (if needed)
    "scrapy>=2.11.0",                  # Web scraping framework
    "beautifulsoup4>=4.12.0",          # HTML parsing
    "lxml>=4.9.0",                     # XML/HTML processing
    "requests>=2.31.0",                # HTTP client
    "pydantic>=2.5.0",                 # Data validation
    "python-dotenv>=1.0.0",            # Environment management
    "pandas>=2.1.0",                   # Data manipulation
    "sqlalchemy>=2.0.0",               # Database ORM
    "alembic>=1.12.0",                 # Database migrations
    "fastapi>=0.104.0",                # API framework (future)
    "uvicorn>=0.24.0",                 # ASGI server
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-cov>=4.1.0",
    "pytest-asyncio>=0.21.0",
    "black>=23.11.0",
    "ruff>=0.1.0",
    "mypy>=1.7.0",
    "ipython>=8.17.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.black]
line-length = 100
target-version = ['py311']

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"
python_functions = "test_*"
addopts = "-v --cov=grant_prototype --cov-report=term-missing"
```

**Setup Commands:**

```shell
# Install UV if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
cd back/grant-prototype
uv pip install -e ".[dev]"

# Verify installation
python -c "import google.generativeai; print('Gemini SDK installed')"
```

---

### **Day 4: Claude Commands & Project Context**

**Tasks:**

1. Create comprehensive CLAUDE.md  
2. Write Claude slash commands  
3. Set up .cursor/rules structure  
4. Document development workflow  
5. Create project style guide

**Deliverables:**

* \[ \] CLAUDE.md with full project context  
* \[ \] 5+ Claude slash commands created  
* \[ \] .cursor/rules populated  
* \[ \] CONTRIBUTING.md with workflow guide  
* \[ \] Git commit: "docs: add Claude context and development workflow"

**CLAUDE.md (Starter):**

````
# Grant-Harness Project Context

## Project Overview
Grant-Harness is an AI-powered platform for discovering and matching Australian government grants to SME businesses. This document provides context for AI coding assistants working on the project.

## Current Phase
**Phase 1: Prototype** (Weeks 0-4)
Building Python-based proof-of-concept with Gemini File Search integration.

## Architecture Overview
- **Scrapers**: Extract grant data from 50+ government websites
- **Gemini Store**: Upload grants to Gemini File API for semantic search
- **Matching Engine**: AI-powered company-to-grant matching
- **Models**: Pydantic schemas for grants, companies, matches

## Key Design Decisions
See ADRs in `.cursor/rules/` for detailed rationale:
- ADR-0001: Monorepo structure (platform/back/front)
- ADR-0002: Gemini File Search (vs. self-hosted vector DB)
- ADR-0003: Scrapy framework (vs. requests/BeautifulSoup)

## Development Workflow
1. Create feature branch: `feat/scraper-nsw`
2. Write tests first (TDD approach)
3. Implement feature
4. Run linters: `black . && ruff check .`
5. Run tests: `pytest`
6. Commit with conventional commits: `feat: add NSW grants scraper`
7. Push and create PR

## Code Style
- Python: Black formatter (100 char line length)
- Type hints required for all functions
- Docstrings: Google style
- Tests: pytest with fixtures

## Grant Data Schema
```python
class Grant(BaseModel):
    id: str                    # Unique identifier
    title: str                 # Grant program name
    agency: str                # Federal/State agency
    jurisdiction: str          # Federal/VIC/NSW/QLD
    sectors: list[str]         # recycling, renewable-energy, manufacturing, ai
    description: str           # Full description
    eligibility: str           # Who can apply
    funding_range: tuple[int, int]  # Min, max funding
    opens: date | None         # Opening date
    closes: date | None        # Closing date
    url: str                   # Application URL
    status: str                # open, closed, upcoming
    scraped_at: datetime       # Last updated
````

## **Target Grant Sources**

See `docs/research/grant-sources.md` for comprehensive list of 50+ sources.

**Primary Sources:**

* GrantConnect (Federal mandatory listing)  
* Business.gov.au Grant Finder  
* Sustainability Victoria  
* NSW Grants Portal  
* Business Queensland

## **Test Data**

* EMEW case study: `docs/context/test-companies/emew-profile.json`  
* Sample grants: `docs/context/grants/source-documents/`

## **Gemini Integration**

* Use `google.generativeai` SDK  
* Files uploaded to Gemini File API  
* Metadata stored in `docs/context/grants/gemini-file-index.json`  
* Query with file search tool enabled

## **Common Tasks**

* Scrape grants: `/scrape-grants federal vic nsw qld`  
* Upload to Gemini: `/upload-grants-to-gemini`  
* Match company: `/match-grants docs/context/test-companies/emew-profile.json`  
* Run tests: `/test-prototype`

## **Current Sprint**

See GitHub Issues for active tasks.

## **Questions?**

Refer to ADRs first, then ask in project discussions.

````

---

### Day 5: Grant Sources Research & Test Data

**Tasks:**
1. Port grant sources research from existing comprehensive document
2. Create test company profiles (EMEW + 2 others)
3. Manually collect 5-10 sample grant PDFs
4. Organize in docs/context/
5. Create grant source tracking spreadsheet

**Deliverables:**
- [ ] docs/research/grant-sources.md with 50+ sources
- [ ] 3 test company profiles in JSON format
- [ ] 5-10 sample grant PDFs saved
- [ ] Grant source tracking spreadsheet (Google Sheets)
- [ ] Git commit: "docs: add grant sources research and test data"

**Test Company Profiles:**
```json
// docs/context/test-companies/emew-profile.json
{
  "id": "emew-001",
  "name": "EMEW Corporation",
  "industry": "Recycling & Metal Recovery",
  "description": "EMEW specializes in electrochemical metal recovery technology, providing sustainable solutions for mining waste, e-waste, and industrial effluent treatment. Our technology recovers copper, zinc, nickel, and other valuable metals from low-concentration solutions.",
  "website": "https://www.emew.com",
  "state": "VIC",
  "annual_revenue": 5000000,
  "employee_count": 25,
  "sectors": ["recycling", "manufacturing"],
  "established": 2001,
  "certifications": ["ISO 9001", "ISO 14001"],
  "looking_for": [
    "R&D funding for new recovery processes",
    "Capital grants for equipment upgrades",
    "Export market development support",
    "Circular economy initiatives"
  ]
}

// docs/context/test-companies/solar-startup-profile.json
{
  "id": "solar-001",
  "name": "SolarTech Innovations",
  "industry": "Renewable Energy Manufacturing",
  "description": "Early-stage startup developing next-generation solar panel manufacturing processes with 30% improved efficiency. Currently in pilot production phase.",
  "website": "https://example.com/solartech",
  "state": "NSW",
  "annual_revenue": 500000,
  "employee_count": 8,
  "sectors": ["renewable-energy", "manufacturing"],
  "established": 2023,
  "looking_for": [
    "Early-stage R&D grants",
    "Manufacturing scale-up funding",
    "Innovation commercialization support"
  ]
}

// docs/context/test-companies/ai-consultancy-profile.json
{
  "id": "ai-001",
  "name": "AI Solutions Queensland",
  "industry": "Artificial Intelligence Consulting",
  "description": "AI consulting firm helping manufacturers implement predictive maintenance, quality control, and supply chain optimization using machine learning.",
  "website": "https://example.com/aisolutions",
  "state": "QLD",
  "annual_revenue": 1200000,
  "employee_count": 15,
  "sectors": ["ai", "manufacturing"],
  "established": 2020,
  "looking_for": [
    "AI adoption program grants",
    "Collaborative R&D with universities",
    "Technology commercialization funding"
  ]
}
````

---

## **5\. Week 1: Core Infrastructure (Days 6-12)**

### **Day 6-7: Base Scraper Framework**

**Tasks:**

1. Implement base scraper class  
2. Set up Scrapy project structure  
3. Create data models (Pydantic schemas)  
4. Implement data validation  
5. Write tests for base scraper

**Deliverables:**

* \[ \] BaseScraper class with common functionality  
* \[ \] Grant Pydantic model  
* \[ \] Unit tests for data validation  
* \[ \] Git commit: "feat: implement base scraper framework"

---

### **Day 8-9: First Working Scraper**

**Tasks:**

1. Implement GrantConnect scraper (easiest target)  
2. Test scraping 10 grants  
3. Save to JSON format  
4. Handle errors and rate limiting  
5. Document scraper in README

**Deliverables:**

* \[ \] Working federal\_grants.py scraper  
* \[ \] 10 real grants scraped successfully  
* \[ \] Error handling tested  
* \[ \] Git commit: "feat: add GrantConnect scraper"

---

### **Day 10-11: Gemini Integration Setup**

**Tasks:**

1. Set up Google Cloud project  
2. Enable Gemini API  
3. Implement file upload manager  
4. Test uploading 5 grant PDFs  
5. Implement basic query functionality

**Deliverables:**

* \[ \] Google Cloud project configured  
* \[ \] file\_manager.py implemented  
* \[ \] 5 grants uploaded to Gemini  
* \[ \] Basic query working  
* \[ \] Git commit: "feat: implement Gemini file upload"

---

### **Day 12: Documentation & Testing**

**Tasks:**

1. Write comprehensive README for back/grant-prototype/  
2. Document API keys setup process  
3. Create developer onboarding guide  
4. Run full test suite  
5. Fix any failing tests

**Deliverables:**

* \[ \] back/grant-prototype/README.md complete  
* \[ \] .env.example file created  
* \[ \] All tests passing  
* \[ \] Git commit: "docs: complete Week 1 documentation"

---

## **6\. Immediate Next Steps (Day 1 \- Start Now)**

### **Action Checklist**

**Morning (2-3 hours):**

* \[ \] Create new GitHub repository: `whisperlooms/grant-harness`  
* \[ \] Clone and set up local environment  
* \[ \] Archive old repository  
* \[ \] Create folder structure  
* \[ \] Initial git commit

**Afternoon (2-3 hours):**

* \[ \] Write CLAUDE.md with project context  
* \[ \] Write ADR-0001 (Repository Structure)  
* \[ \] Write ADR-0002 (Gemini File Search)  
* \[ \] Create README.md  
* \[ \] Commit documentation

**Evening (1-2 hours):**

* \[ \] Set up pyproject.toml  
* \[ \] Install dependencies with UV  
* \[ \] Test Python environment  
* \[ \] Commit build configuration

**Tomorrow:**

* \[ \] Create Claude slash commands  
* \[ \] Port grant sources research  
* \[ \] Create test company profiles  
* \[ \] Collect sample grant PDFs

---

## **7\. Success Criteria for Week 0**

By end of Week 0 (Day 5), you should have:

1. **Repository Structure** ✓

   * Clean, organized folder hierarchy  
   * All configuration files in place  
   * Git repository initialized  
2. **Documentation** ✓

   * CLAUDE.md with comprehensive context  
   * ADR-0001 and ADR-0002 written  
   * README.md with project overview  
   * Development workflow documented  
3. **Environment** ✓

   * Python 3.11+ environment working  
   * All dependencies installed  
   * Linting and testing configured  
4. **Research** ✓

   * 50+ grant sources documented  
   * 3 test company profiles created  
   * 5-10 sample grant PDFs collected  
5. **Planning** ✓

   * Week 1-4 detailed plan created  
   * GitHub Issues created for Week 1 tasks  
   * Team aligned on approach

---

## **8\. Resources & References**

### **Documentation to Create**

1. **CLAUDE.md** \- Project context for AI assistants  
2. **README.md** \- Project overview and setup  
3. **CONTRIBUTING.md** \- Development workflow  
4. **ADR-0001** \- Repository structure decision  
5. **ADR-0002** \- Gemini File Search decision  
6. **docs/research/grant-sources.md** \- Comprehensive grant source list  
7. **back/grant-prototype/README.md** \- Prototype usage guide

### **External Resources**

* [Gemini File Search Docs](https://ai.google.dev/gemini-api/docs/file-search)  
* [Scrapy Documentation](https://docs.scrapy.org/)  
* [Pydantic Docs](https://docs.pydantic.dev/)  
* [ADR Template](https://github.com/joelparkerhenderson/architecture-decision-record)

### **Internal References**

* emew-agents repository (structure reference)  
* Australian Government Grant Sources report (attached)  
* Original grant-harness-archive (salvageable artifacts)

---

## **9\. Risk Mitigation**

### **Identified Risks**

**Risk 1: Gemini API Changes**

* **Mitigation**: Abstract Gemini integration behind interface; easy to swap  
* **Contingency**: Plan B is Vertex AI \+ Weaviate (3 week migration)

**Risk 2: Website Scraping Blocks**

* **Mitigation**: Respectful rate limiting, proper User-Agent  
* **Contingency**: Manual data collection \+ email alerts for priority sources

**Risk 3: Scope Creep in Prototype**

* **Mitigation**: Strict focus on 4 scrapers \+ EMEW test case  
* **Contingency**: Push non-essential features to Phase 2

**Risk 4: Data Quality Issues**

* **Mitigation**: Comprehensive validation with Pydantic  
* **Contingency**: Manual review of first 50 grants

---

## **10\. Communication & Tracking**

### **GitHub Issues**

Create these issues to track Week 0-1 work:

1. **\[Day 1\] Initialize grant-harness repository** (\#1)  
2. **\[Day 2\] Create core documentation and ADRs** (\#2)  
3. **\[Day 3\] Configure Python environment** (\#3)  
4. **\[Day 4\] Set up Claude commands and context** (\#4)  
5. **\[Day 5\] Port grant sources research** (\#5)  
6. **\[Week 1\] Implement base scraper framework** (\#6)  
7. **\[Week 1\] Create GrantConnect scraper** (\#7)  
8. **\[Week 1\] Set up Gemini File Search integration** (\#8)

### **Weekly Check-ins**

* **Day 5 (End of Week 0\)**: Review foundation completion  
* **Day 12 (End of Week 1\)**: Review first scraper \+ Gemini integration  
* **Day 19 (End of Week 2\)**: Review all scrapers \+ matching logic  
* **Day 26 (End of Week 3\)**: Review EMEW test results

---

## **Ready to Start?**

**Next Command:**

```shell
# Start Day 1
cd ~/projects  # or your workspace directory
gh repo create whisperlooms/grant-harness --public --clone
cd grant-harness
```

Then follow the Day 1 tasks above. You've got this\! 🚀

---

## **Appendix: Quick Reference Commands**

```shell
# Python environment
uv pip install -e ".[dev]"          # Install dependencies
black .                              # Format code
ruff check .                         # Lint code
pytest                               # Run tests

# Git workflow
git checkout -b feat/new-feature     # Create feature branch
git add .                            # Stage changes
git commit -m "feat: description"    # Commit (conventional commits)
git push -u origin feat/new-feature  # Push branch

# Claude commands (once set up)
/setup-repo                          # Initialize repository
/scrape-grants federal               # Scrape GrantConnect
/upload-grants-to-gemini             # Upload to Gemini
/test-emew                           # Test EMEW matching
```

Would you like me to generate any of these documents (ADRs, CLAUDE.md, etc.) to help you get started immediately?

