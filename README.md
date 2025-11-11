# Grant-Harness

AI-powered platform for discovering and matching Australian government grants to SME businesses.

## Overview

Grant-Harness helps Australian SMEs in recycling, renewable energy, manufacturing, and AI sectors discover relevant government grants and streamline the application process.

**Problem**:
- 50+ fragmented grant sources across Federal and state governments
- No centralized discovery mechanism
- Manual, time-intensive matching process
- Complex application requirements

**Solution**: Grant-Harness provides:
1. **Discovers**: Automatically scrapes and indexes 50+ government grant sources
2. **Matches**: Uses AI to semantically match companies to relevant grants
3. **Assists**: Generates pre-populated grant application drafts
4. **Manages**: Provides workflow for multi-stakeholder review and signoff

## Current Status

**Phase**: Week 0 - Foundation Setup (Repository Initialization)
**Version**: 2.0 (Strategic Rebuild)

This is a fresh start following architectural decisions documented in the [Repository Initiation Plan](docs/specs/Grant-Harness_Repository-Initiation-Plan.md).

## Quick Start

### Prerequisites

- Python 3.11+
- [uv](https://github.com/astral-sh/uv) package manager
- Google Cloud Project (for Gemini API/Vertex AI)

### Setup

```bash
# Clone repository
git clone https://github.com/whisperlooms/grant-harness.git
cd grant-harness

# Set up Phase 1 prototype
cd back/grant-prototype
uv sync

# Configure environment
cp .env.example .env
# Edit .env with your Google API credentials

# Run tests
uv run pytest tests/ -v
```

## Project Structure

```
grant-harness/
├── back/grant-prototype/    # Phase 1: Python prototype
├── back/grant-adk/          # Phase 2: Production ADK agents (future)
├── front/grant-portal/      # Phase 2: Next.js frontend (future)
├── docs/                    # Specifications, research, test data
├── .cursor/rules/           # AI agent documentation (ADRs)
└── .claude/commands/        # Claude Code slash commands
```

See [folder structure documentation](.cursor/rules/folder-structure.mdc) for details.

## Development Phases

### Phase 1: Prototype (Weeks 0-4) - Current
**Goal**: Proof-of-concept with Python scripts

**Components**:
- Web scrapers for 4 priority sources (GrantConnect, VIC, NSW, QLD)
- Gemini File Search integration for semantic matching
- Basic matching engine using EMEW as test case

**Deliverable**: Successfully match 10 test companies to grants with 80%+ relevance

### Phase 2: MVP (Weeks 5-8)
**Goal**: Production-ready application

**Components**:
- Refactor to Google ADK agents in `back/grant-adk/`
- Next.js frontend in `front/grant-portal/`
- PostgreSQL for structured data
- Multi-stakeholder workflow

**Deliverable**: 50 companies using platform, 100+ applications generated

### Phase 3: Scale (Weeks 9-12)
**Goal**: Comprehensive grant discovery platform

**Components**:
- All 50+ grant sources automated
- Advanced matching algorithms
- Pre-populated application generation
- Analytics dashboard

**Deliverable**: 500+ companies, $10M+ in grants secured

## Target Grant Sources

See [Australian Government Grant Sources](docs/research/Australian Government Grant Sources.md) for comprehensive list of 50+ sources.

**Phase 1 Priority**:
1. GrantConnect (Federal mandatory listing)
2. Sustainability Victoria (Environmental grants)
3. NSW Grants Portal (NSW state grants)
4. Business Queensland (QLD business support)

## Target Sectors

- **Recycling & Circular Economy**: Waste reduction, material recovery, e-waste processing
- **Renewable Energy**: Solar, wind, battery storage, energy efficiency
- **Manufacturing**: Advanced manufacturing, Industry 4.0, automation
- **Artificial Intelligence**: AI adoption, machine learning, digital transformation

## Documentation

### For Developers
- **CLAUDE.md** - Primary guide for AI coding assistants
- **.cursor/rules/** - Architectural Decision Records (ADRs)
- **docs/specs/** - Project specifications and roadmap

### For Stakeholders
- **README.md** - This file (project overview)
- **docs/specs/Grant-Harness_Repository-Initiation-Plan.md** - Detailed development plan
- **docs/research/** - Grant sources research

## Key Architectural Decisions

See [Platform ADRs](.cursor/rules/platform/ADR.mdc) for details:

- **ADR-0001**: Monorepo structure with clear phase separation
- **ADR-0002**: Gemini File Search for vector storage (99% cost reduction vs self-hosted)
- **ADR-0003**: Scrapy framework for production-grade scraping (to be created)

## Technology Stack

### Phase 1 (Prototype)
- **Backend**: Python 3.11+, Scrapy, Pydantic, Gemini API
- **Storage**: JSON files, Gemini File API (vector storage)
- **Tools**: pytest, black, ruff, uv

### Phase 2 (Production)
- **Backend**: Google ADK, FastAPI, PostgreSQL
- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS, NextAuth.js
- **Infrastructure**: Google Cloud Platform, Docker, GitHub Actions

## Testing

```bash
# Unit tests
cd back/grant-prototype
uv run pytest tests/ -v

# Integration tests (Phase 1)
# 1. Scrape 10 grants from GrantConnect
# 2. Upload to Gemini File API
# 3. Query: "grants for metal recycling companies in Victoria"
# 4. Match EMEW profile
# 5. Verify relevance score > 0.8
```

## Contributing

This is an internal Whisperlooms project. Development follows the workflow in `.cursor/rules/rules.mdc`.

### Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(scraper): implement GrantConnect scraper
fix(gemini): handle upload timeout errors
docs(adr): add ADR-0003 Scrapy framework decision
```

### ADR Workflow

Create Architectural Decision Records for:
- Major technology choices
- Design patterns affecting multiple components
- Infrastructure decisions

See `.cursor/rules/README.md` for ADR creation process.

## License

Proprietary - Whisperlooms

## Contact

**Project Lead**: Gordon
**Organization**: Whisperlooms
**Repository**: https://github.com/whisperlooms/grant-harness

---

**Last Updated**: 2025-11-11
**Current Phase**: Week 0 - Foundation Setup
**Next Milestone**: Week 1 - First Working Scraper (GrantConnect)
