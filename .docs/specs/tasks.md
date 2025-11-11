# Grant-Harness Workflow Tasks

Complete workflow from grant discovery through to submission, organized into 6 GitHub Issues.

## Workflow Overview

The complete grant application journey follows: **g ’ c ’ m ’ a ’ p ’ s**

- **g**: Grant Discovery & Data Collection
- **c**: Company Profiling
- **m**: Matching & Analysis
- **a**: Application Replication
- **p**: Population & Collaboration
- **s**: Signoff & Submission

## Mermaid Workflow Diagram

```mermaid
graph TD
    Start([Start: Grant Opportunity Identified]) --> Issue1

    subgraph Issue1["Issue #1: Grant Listing & Scraping"]
        g01["/g01-grant-lists<br/>Compile Grant List"]
        g02["/g02-grant-docs<br/>Scrape Full Details"]
        g03["/g03-gemini-upload<br/>Upload to Vector DB"]
        g04["/g04-grant-sync<br/>Detect Changes"]
        g05["/g05-grant-validate<br/>Validate Data"]

        g01 --> g02
        g02 --> g05
        g05 --> g03
        g03 --> g04
    end

    subgraph Issue2["Issue #2: Company Scraping & Profiling"]
        c01["/c01-company-scrape<br/>Extract Website Data"]
        c02["/c02-company-profile<br/>Build Profile"]
        c03["/c03-company-vector<br/>Create Vector DB"]
        c04["/c04-company-docs<br/>Process Documents"]
        c05["/c05-company-validate<br/>Validate Profile"]

        c01 --> c02
        c02 --> c04
        c04 --> c02
        c02 --> c05
        c05 --> c03
    end

    subgraph Issue3["Issue #3: Matching & Analysis"]
        m01["/m01-match-grants<br/>AI-Powered Matching"]
        m02["/m02-match-explain<br/>Detailed Reasoning"]
        m03["/m03-match-rank<br/>Prioritize Grants"]
        m04["/m04-match-eligibility<br/>Eligibility Check"]
        m05["/m05-match-export<br/>Export Results"]

        m01 --> m03
        m03 --> m02
        m02 --> m04
        m04 --> m05
    end

    Issue1 --> Issue2
    Issue2 --> Issue3

    Decision{Apply to<br/>this grant?}
    Issue3 --> Decision

    Decision -->|No| End1([End: Grant Rejected])
    Decision -->|Yes| Issue4

    subgraph Issue4["Issue #4: Application Preparation<br/>(Phase 2)"]
        a01["/a01-app-identify<br/>Identify Form Structure"]
        a02["/a02-app-extract<br/>Extract Questions"]
        a03["/a03-app-replicate<br/>Generate NextJS Form"]
        a04["/a04-app-map<br/>Map Data to Fields"]
        a05["/a05-app-validate<br/>Validate Mapping"]

        a01 --> a02
        a02 --> a03
        a03 --> a04
        a04 --> a05
    end

    subgraph Issue5["Issue #5: Population & Collaboration<br/>(Phase 2)"]
        p01["/p01-populate-ai<br/>AI Auto-Fill"]
        p02["/p02-populate-review<br/>Flag for Review"]
        p03["/p03-populate-comment<br/>Collaborative Editing"]
        p04["/p04-populate-docs<br/>Attach Documents"]
        p05["/p05-populate-export<br/>Generate Draft PDF"]

        p01 --> p02
        p02 --> p03
        p03 --> p04
        p04 --> p05
    end

    Issue4 --> Issue5

    subgraph Issue6["Issue #6: Signoff & Submission<br/>(Phase 2-3)"]
        s01["/s01-signoff-request<br/>Request Approvals"]
        s02["/s02-signoff-track<br/>Track Status"]
        s03["/s03-signoff-changes<br/>Implement Changes"]
        s04["/s04-signoff-finalize<br/>Lock Application"]
        s05["/s05-submit-portal<br/>Submit to Portal"]

        s01 --> s02
        s02 --> Changes{Changes<br/>requested?}
        Changes -->|Yes| s03
        s03 --> s01
        Changes -->|No| s04
        s04 --> s05
    end

    Issue5 --> Issue6
    Issue6 --> End2([End: Application Submitted])

    classDef phase1 fill:#e1f5e1,stroke:#4caf50,stroke-width:2px
    classDef phase2 fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    classDef phase3 fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    classDef decision fill:#fff9c4,stroke:#fbc02d,stroke-width:2px

    class Issue1,Issue2,Issue3 phase1
    class Issue4,Issue5 phase2
    class Issue6 phase3
    class Decision,Changes decision
```

## GitHub Issues

### [Issue #1: Grant Listing and Scraping Commands](https://github.com/WhisperLooms/grant-harness/issues/1)
**Phase 1 - Week 1-2**

Commands:
- `/g01-grant-lists` - Compile comprehensive grant list
- `/g02-grant-docs` - Scrape full grant details and download documents
- `/g03-gemini-upload` - Upload grants to Gemini File Search vector database
- `/g04-grant-sync` - Re-scrape sources to detect changes/new grants
- `/g05-grant-validate` - Validate scraped data quality

**Implementation**: `back/grant-prototype/scrapers/`
**Technology**: crawl4ai with Gemini LLM extraction (ADR-2050)

---

### [Issue #2: Company Scraping and Profiling Commands](https://github.com/WhisperLooms/grant-harness/issues/2)
**Phase 1 - Week 2-3**

Commands:
- `/c01-company-scrape` - Extract company data from website
- `/c02-company-profile` - Build standardized company profile
- `/c03-company-vector` - Create company vector database for semantic search
- `/c04-company-docs` - Process uploaded company documents
- `/c05-company-validate` - Validate company profile completeness

**Implementation**: `back/grant-prototype/scrapers/company_scraper.py`, `back/grant-prototype/profilers/`
**Dependencies**: Issue #1 for integration testing

---

### [Issue #3: Grant Matching and Analysis Commands](https://github.com/WhisperLooms/grant-harness/issues/3)
**Phase 1 - Week 3-4**

Commands:
- `/m01-match-grants` - AI-powered company-to-grant matching
- `/m02-match-explain` - Deep-dive explanation of specific match reasoning
- `/m03-match-rank` - Sort and filter matches by relevance/funding/deadline
- `/m04-match-eligibility` - Detailed eligibility assessment per grant
- `/m05-match-export` - Export match results to CSV/PDF/PPTX

**Implementation**: `back/grant-prototype/matching/`, `back/grant-prototype/exporters/`
**Dependencies**: Issue #1 (grants in vector DB), Issue #2 (company profiles)

---

### [Issue #4: Application Preparation Commands](https://github.com/WhisperLooms/grant-harness/issues/4)
**Phase 2 - Week 5-6**

Commands:
- `/a01-app-identify` - Identify application form structure from grant docs
- `/a02-app-extract` - Extract questions and fields from application form
- `/a03-app-replicate` - Generate NextJS form component replicating grant application
- `/a04-app-map` - Map company/grant data to application form fields
- `/a05-app-validate` - Validate application form completeness

**Implementation**: `back/grant-prototype/application/`, `front/grant-portal/components/applications/`
**Dependencies**: Issue #1 (grant documents), Issue #2 (company data), NextJS setup
**Status**: ø Phase 2 - Specifications complete, implementation deferred

---

### [Issue #5: Application Population and Collaboration Commands](https://github.com/WhisperLooms/grant-harness/issues/5)
**Phase 2 - Week 6-7**

Commands:
- `/p01-populate-ai` - AI auto-fill application fields from company context
- `/p02-populate-review` - Flag fields needing human review or input
- `/p03-populate-comment` - Enable consultant/expert commenting and collaboration
- `/p04-populate-docs` - Attach and manage supporting documents
- `/p05-populate-export` - Export draft application to PDF/Word

**Implementation**: `back/grant-prototype/application/populator.py`, `front/grant-portal/components/collaboration/`
**Dependencies**: Issue #2 (company vector DB), Issue #4 (form replication), Firebase/Supabase
**Status**: ø Phase 2 - Requires frontend setup and real-time collaboration

---

### [Issue #6: Signoff and Submission Commands](https://github.com/WhisperLooms/grant-harness/issues/6)
**Phase 2-3 - Week 7-8 (planning), Week 11-12 (implementation)**

Commands:
- `/s01-signoff-request` - Request signoff from company/consultants/experts
- `/s02-signoff-track` - Monitor signoff approval workflow status
- `/s03-signoff-changes` - Log and implement review changes with audit trail
- `/s04-signoff-finalize` - Lock application after all signoffs, generate final PDF
- `/s05-submit-portal` - Submit application to government grant portal

**Implementation**: `back/grant-prototype/submission/`, `front/grant-portal/components/signoff/`
**Dependencies**: Issue #5 (completed application), Email service, Digital signatures, Playwright
**Status**: ø Phase 2-3 - Portal integration research required

---

## Development Timeline

### Phase 1: Python Prototype (Weeks 0-4)
- **Week 0**:  Repository setup, slash command specifications, ADR-2050
- **Week 1-2**: = Issue #1 (Grant commands)
- **Week 2-3**: ó Issue #2 (Company commands)
- **Week 3-4**: ó Issue #3 (Matching commands)

**Deliverable**: Working prototype with EMEW case study (g’c’m workflow)

### Phase 2: MVP with Basic UI (Weeks 5-8)
- **Week 5-6**: ø Issue #4 (Application commands)
- **Week 6-7**: ø Issue #5 (Population commands)
- **Week 7-8**: ø Issue #6 (Signoff planning)

**Deliverable**: NextJS portal with application generation

### Phase 3: Production Scale (Weeks 9-12)
- **Week 9-10**: ø Scale to 50+ grant sources
- **Week 11-12**: ø Issue #6 (Submission implementation)

**Deliverable**: Production-ready platform with full workflow

---

## Command Reference

### Quick Command Lookup

| Phase | Series | Commands | Issue | Status |
|-------|--------|----------|-------|--------|
| 1 | G | g01-g05 | [#1](https://github.com/WhisperLooms/grant-harness/issues/1) | = In Progress |
| 1 | C | c01-c05 | [#2](https://github.com/WhisperLooms/grant-harness/issues/2) | ó Planned |
| 1 | M | m01-m05 | [#3](https://github.com/WhisperLooms/grant-harness/issues/3) | ó Planned |
| 2 | A | a01-a05 | [#4](https://github.com/WhisperLooms/grant-harness/issues/4) | ø Phase 2 |
| 2 | P | p01-p05 | [#5](https://github.com/WhisperLooms/grant-harness/issues/5) | ø Phase 2 |
| 2-3 | S | s01-s05 | [#6](https://github.com/WhisperLooms/grant-harness/issues/6) | ø Phase 2-3 |

**Legend**:  Complete | = In Progress | ó Planned | ø Deferred

---

## Key Files

- **Command Specifications**: `.claude/commands/*.md` (30 slash command specs)
- **Architecture Decisions**: `.cursor/rules/backend/grant-prototype/ADR.mdc`
- **Project Context**: `CLAUDE.md`
- **Initiation Plan**: `.docs/specs/Grant-Harness_Repository-Initiation-Plan.md`
- **Grant Sources**: `.docs/research/Australian Government Grant Sources.md`

---

## Testing Strategy

### Phase 1 Integration Tests
1. **Grant Discovery** (Issue #1): Scrape GrantConnect ’ 10+ grants in Gemini
2. **Company Profile** (Issue #2): EMEW website ’ validated profile
3. **Matching** (Issue #3): EMEW + grants ’ >0.8 relevance matches

### Phase 2 Integration Tests
4. **Application Prep** (Issue #4): Recycling Modernisation Fund ’ NextJS form
5. **Population** (Issue #5): EMEW + form ’ 70%+ auto-filled draft
6. **Submission** (Issue #6): Draft ’ approved ’ submitted to GrantConnect

---

**Last Updated**: 2025-11-12
**Current Phase**: Phase 1 - Week 0 (Foundation Setup Complete)
**Next Milestone**: Issue #1 completion (Week 2)
