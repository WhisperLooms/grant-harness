# GitHub Issues Update Plan
## Application-First Prototype Strategy

**Date**: 2025-11-12
**Purpose**: Recalibrate GitHub Issues to reflect application-first approach per ADR-0003
**Status**: Ready for manual update

---

## Summary of Changes

Based on the strategic pivot to prioritize application assistance over grant discovery, the 6 GitHub Issues need to be reordered and updated as follows:

| Old Priority | New Priority | Issue Title | Status Change |
|--------------|--------------|-------------|---------------|
| Issue #1 | Issue #1 (Updated) | Grant & Company Ingestion | Simplified scope |
| Issue #2 | Issue #5 (Deferred) | Company Profiling | Move to Phase 2 |
| Issue #3 | Issue #6 (Deferred) | Grant Matching | Keep m-series, defer advanced features |
| Issue #4 | Issue #2 (Week 2) | Application Form Replication | **NEW PRIORITY** |
| Issue #5 | Issue #3 (Week 3) | AI-Powered Population | **NEW PRIORITY** |
| Issue #6 | Issue #4 (Week 4) | Collaboration & Export | **NEW PRIORITY** |

---

## Issue #1: Grant & Company Ingestion
**Original**: Grant Listing and Scraping Commands
**New Focus**: Leverage existing EMEW context, defer full scraper infrastructure

### Proposed Updates

**Title**: Grant & Company Ingestion (Week 1)

**Description**:
```markdown
## Overview

Week 1 focus: Ingest existing EMEW corporate documents and grant search results into Gemini File Search vector database. This validates the matching workflow with real client data without building full scraper infrastructure.

## Strategic Context

Per ADR-2053 (EMEW Bootstrap Strategy), we leverage existing research:
- **EMEW corporate docs**: `.docs/context/emew-context/corporate-info/*.pdf`
- **Grant search results**: `.docs/context/emew-context/grant-search/Grants_Summary_2025-10-29.md`

This accelerates Week 1 and validates matching before investing in scraper development.

## Commands (Simplified)

### Core Workflow
- `/profile-company <url>` - Consolidates c01+c02 (scrape website + build profile)
- `/match-company <company-id>` - m01 (semantic matching)

### Deferred to Phase 2
- Full scraper automation (g01-g05 all sources)
- Advanced matching features (m03-m05)
- Multi-company profiling (c03-c05)

## Week 1 Tasks

### Day 1-2: EMEW Corporate Document Ingestion
- [ ] Create `.inputs/companies/c-emew/corporate/` folder structure
- [ ] Migrate PDFs from `.docs/context/emew-context/corporate-info/`
- [ ] Upload to Gemini Company Corpus
- [ ] Scrape https://emew.com.au for additional context
- [ ] Generate `emew_profile.json`

### Day 3-4: Grant Research Results Ingestion
- [ ] Parse `Grants_Summary_2025-10-29.md` for grant list
- [ ] Download grant PDFs for 8-10 identified grants:
  - Battery Breakthrough Initiative (BBI)
  - Industry Growth Program (IGP)
  - Victorian Market Accelerator (VMA)
  - Breakthrough Victoria Fund (BTV)
  - Advancing Renewables Program (ARP)
  - International Partnerships Critical Minerals
- [ ] Store in `.inputs/grants/{jurisdiction}/{grant-name}/`
- [ ] Upload to Gemini Grant Corpus

### Day 5: Matching & Validation
- [ ] Run semantic matching: EMEW ↔ Grants
- [ ] Export `emew_matches.csv` with top 10 grants
- [ ] Verify matches align with manual research
- [ ] **Select 2 target grants for Week 2 application work**

## Success Criteria

- ✅ EMEW corporate docs in Gemini Company Corpus
- ✅ 8-10 grants from summary in Gemini Grant Corpus
- ✅ Matching shows BBI + IGP as top 2 (validates manual research)
- ✅ 2 grants selected for application replication

## Related ADRs

- ADR-0003: Application-First Prototype Strategy
- ADR-2051: Gemini Dual-Corpus Architecture
- ADR-2052: Input Data Management Pattern
- ADR-2053: EMEW Bootstrap Strategy

## Dependencies

- Gemini API key configured
- Python dependencies installed (`uv sync`)
- `.inputs/` folder structure created

## Implementation

`back/grant-prototype/` directory:
- `gemini_store/corpus_manager.py` - Dual corpus management
- `gemini_store/company_corpus.py` - Company document uploads
- `gemini_store/grant_corpus.py` - Grant document uploads
- `matching/grant_matcher.py` - Semantic matching engine
```

**Labels**: `Phase 1`, `Week 1`, `priority: critical`

---

## Issue #2: Application Form Replication
**Original**: Issue #4 (Phase 2)
**New Priority**: Week 2 (Days 8-12)

### Proposed Updates

**Title**: Application Form Replication (Week 2)

**Description**:
```markdown
## Overview

Week 2 focus: Create NextJS replicas of 2 real grant application forms using schema-driven dynamic generation. This is the **core value proposition** - helping clients complete applications, not just discover grants.

## Strategic Context

Per ADR-0003 (Application-First Strategy), application assistance > grant discovery. Building form replication in Week 2 (instead of Week 5-6) validates the core value proposition early.

## Commands

- `/analyze-application <grant-id>` - Combines a01+a02 (analyze form structure + extract fields)
- `/replicate-form <grant-id>` - a03 (generate NextJS component from schema)

## Week 2 Tasks

### Day 8: Form Analysis (Target Grant #1: IGP)
- [ ] Implement `/analyze-application industry-growth-program`
- [ ] Extract form structure from IGP PDF/portal
- [ ] Generate JSON schema with fields, validation, steps
- [ ] Create Zod schema in `front/grant-portal/lib/schemas/igp.ts`

### Day 9-10: NextJS Form Generation (IGP)
- [ ] Set up `front/grant-portal/` (Next.js 14 + Tailwind)
- [ ] Install Shadcn UI components
- [ ] Implement DynamicForm component (schema → React)
- [ ] Generate multi-step form (5-8 steps)
- [ ] Test locally: `npm run dev`

### Day 11-12: Form Replication (Target Grant #2: BBI or VMA)
- [ ] Repeat analysis for second grant
- [ ] Generate schema + NextJS form
- [ ] Test both forms work independently
- [ ] Stakeholder review: "Does this match the government portal?"

## Success Criteria

- ✅ 2 NextJS forms render in browser
- ✅ Forms match government portal structure
- ✅ Multi-step navigation works (Previous/Next)
- ✅ Form validation with Zod
- ✅ LocalStorage persistence (save/resume)
- ✅ Stakeholder confirms "This looks like the real form"

## Related ADRs

- ADR-1001: React Hook Form + Shadcn UI Foundation
- ADR-1002: Schema-Driven Form Generation
- ADR-1003: Multi-Step Form State Management

## Dependencies

- Week 1 complete (2 target grants selected)
- Node.js + npm installed
- Grant application PDFs downloaded

## Implementation

`front/grant-portal/` directory:
- `lib/schemas/{grant-id}.ts` - Form schemas
- `components/forms/DynamicForm.tsx` - Schema renderer
- `components/forms/DynamicField.tsx` - Field type router
- `app/applications/[grantId]/page.tsx` - Application page

## Foundation Template

Clone `shadcn-nextjs-multistep-form-example` as base:
https://github.com/63r6o/shadcn-nextjs-multistep-form-example
```

**Labels**: `Phase 1`, `Week 2`, `priority: critical`, `frontend`

---

## Issue #3: AI-Powered Population & Review
**Original**: Issue #5 (Phase 2)
**New Priority**: Week 3 (Days 13-17)

### Proposed Updates

**Title**: AI-Powered Population & Review Workflow (Week 3)

**Description**:
```markdown
## Overview

Week 3 focus: Auto-fill forms with EMEW data using Gemini, enable expert review workflow. Target: 70% of fields pre-populated, remaining 30% flagged for human review.

## Commands

- `/populate-application <company-id> <grant-id>` - Combines p01+p02 (AI auto-fill + flag for review)
- `/review-application <application-id>` - p03 (open review UI with comments)

## Week 3 Tasks

### Day 13: AI Population Engine
- [ ] Create `application-assistant` Claude Skill
- [ ] Implement `/populate-application emew igp`
- [ ] Query Gemini Company Corpus for field answers
- [ ] Generate confidence scores (0.0-1.0) per field
- [ ] Flag fields with confidence < 0.7 for review

### Day 14: Field-Level AI Assistance
- [ ] Add inline AI assistant to form fields
- [ ] Implement regeneration workflow ("Make this focus on battery recycling")
- [ ] Add source citations ("Based on EMEW Business Plan, pg 12")
- [ ] Show confidence indicators

### Day 15-17: Review Workflow UI
- [ ] Build review status system (ai-filled, flagged, user-edited, approved)
- [ ] Add field-level comments (consultant can note suggestions)
- [ ] Create review dashboard (progress: "12/45 fields approved")
- [ ] Filter views: "Show only flagged fields"

## Success Criteria

- ✅ IGP form 70% auto-filled with EMEW data
- ✅ AI explanations for each pre-filled field
- ✅ Consultant can regenerate/revise AI answers
- ✅ Source citations displayed
- ✅ Review workflow shows approval progress

## Related ADRs

- ADR-0003: Application-First Strategy
- ADR-2051: Gemini Dual-Corpus Architecture (query Company Corpus for answers)
- ADR-1003: Multi-Step State Management

## Dependencies

- Week 2 complete (2 forms replicated)
- EMEW Company Corpus populated (Week 1)
- Gemini API key configured

## Implementation

`back/grant-prototype/`:
- `application/ai_populator.py` - AI field population logic

`front/grant-portal/`:
- `components/forms/AIFieldAssist.tsx` - Inline AI suggestions
- `components/collaboration/ReviewPanel.tsx` - Review dashboard
- `hooks/useAIPopulation.ts` - AI population hook
```

**Labels**: `Phase 1`, `Week 3`, `priority: high`, `AI`, `frontend`

---

## Issue #4: Collaboration & Export
**Original**: Issue #6 (Phase 2-3)
**New Priority**: Week 4 (Days 18-22)

### Proposed Updates

**Title**: Multi-Stakeholder Collaboration & PDF Export (Week 4)

**Description**:
```markdown
## Overview

Week 4 focus: Multi-stakeholder signoff workflow + PDF export. Enable consultant, CFO, CEO to review/approve application. Export to government-portal-matching PDF.

## Commands

- `/attach-documents <application-id> <docs-dir>` - p04 (link supporting documents to sections)
- `/export-application <application-id> --format pdf` - p05 (generate PDF)
- Signoff workflow (s01-s04 consolidated into review UI)

## Week 4 Tasks

### Day 18: Supporting Documents
- [ ] Implement document library UI
- [ ] Drag-and-drop attachment to form sections
- [ ] AI suggests which docs attach where
- [ ] Document preview in application

### Day 19: Signoff Workflow
- [ ] Implement approval workflow (consultant → CFO → CEO)
- [ ] Email notifications for approval requests
- [ ] Track approval status per stakeholder
- [ ] Audit trail (log all edits after approval)
- [ ] Change diff view

### Day 20: PDF Export
- [ ] Implement `@react-pdf/renderer` template
- [ ] Match government portal format (fonts, margins, headers)
- [ ] Include supporting documents as appendices
- [ ] Test: Export IGP application to PDF

### Day 21-22: End-to-End Testing
- [ ] Complete full workflow: Profile → Match → Replicate → Populate → Review → Signoff → Export
- [ ] Record demo video (5 minutes)
- [ ] Stakeholder presentation

## Success Criteria

- ✅ Signoff workflow functional (multi-user approval)
- ✅ PDF export matches government format
- ✅ Supporting documents included in PDF
- ✅ **Demo proves: <2 hour application completion (vs 10+ hours manual)**
- ✅ **Go/No-Go decision**: Proceed to Phase 2 if time savings demonstrated

## Related ADRs

- ADR-1004: Collaboration Backend Decision (Supabase vs Firebase)
- ADR-1005: PDF Export Strategy

## Dependencies

- Week 3 complete (forms 70% populated)
- Supabase or Firebase configured (Week 3 decision)
- react-pdf library installed

## Implementation

`front/grant-portal/`:
- `components/collaboration/SignoffTracker.tsx` - Approval workflow
- `components/documents/DocumentLibrary.tsx` - Document management
- `lib/pdf/templates/GrantApplicationPDF.tsx` - PDF template
- `lib/supabase/client.ts` - Real-time collaboration backend
```

**Labels**: `Phase 1`, `Week 4`, `priority: high`, `collaboration`, `frontend`

---

## Issue #5: Company Profiling (Full)
**Original**: Issue #2
**New Status**: Deferred to Phase 2

### Proposed Updates

**Title**: Company Profiling - Multi-Company Management (Phase 2)

**Description**:
```markdown
## Status

**⏸️ DEFERRED TO PHASE 2 (Weeks 5-8)**

## Rationale

Phase 1 prototype uses single company (EMEW) with existing corporate documents. Full multi-company profiling infrastructure only needed when scaling to 5-10 clients simultaneously.

## Phase 1 Approach (Week 1)

Simplified company profiling via:
- `/profile-company <url>` - Scrape website + build profile (c01+c02 combined)
- Manual migration of existing corporate PDFs to `.inputs/companies/c-emew/corporate/`
- Single company focus (EMEW case study)

## Phase 2 Scope (Weeks 5-8)

When building multi-company dashboard:
- [ ] Full c01-c05 command suite
- [ ] Company vector databases (c03)
- [ ] Document upload UI (c04)
- [ ] Profile validation (c05)
- [ ] Consultant dashboard: Manage 10+ clients
- [ ] Company comparison features

## Decision Point

After Week 4 demo, if stakeholder approves:
- ✅ Proceed: Implement Phase 2 multi-company features
- ❌ Pivot: Focus on improving AI population quality or adding more grants

## Related ADRs

- ADR-0003: Application-First Strategy (explains deferral)
- ADR-2053: EMEW Bootstrap Strategy (Week 1 simplified approach)
```

**Labels**: `Phase 2`, `on-hold`, `backend`

---

## Issue #6: Production Scrapers
**Original**: Issue #1 (Grant Listing and Scraping)
**New Status**: Deferred to Phase 2

### Proposed Updates

**Title**: Production Scraper Infrastructure (Phase 2)

**Description**:
```markdown
## Status

**⏸️ DEFERRED TO PHASE 2 (Weeks 5-8)**

## Rationale

Phase 1 uses existing grant research (`.docs/context/emew-context/grant-search/`) to validate matching workflow. Full scraper infrastructure (50+ sources, automated sync) only needed after proving application assistance value.

## Phase 1 Approach (Week 1)

Simplified grant discovery via:
- Parse existing `Grants_Summary_2025-10-29.md`
- Download PDFs for 8-10 identified grants
- Upload to Gemini Grant Corpus
- Manual curation acceptable for prototype

## Phase 2 Scope (Weeks 5-8)

When scaling to production:
- [ ] Build all g01-g05 commands
- [ ] Scrape 50+ grant sources (GrantConnect, Sustainability Victoria, NSW, QLD, etc.)
- [ ] Automated weekly sync (g04)
- [ ] Data quality validation (g05)
- [ ] Handle 100+ grants in corpus

## Phase 3 Scope (Weeks 9-12)

- [ ] Scale to all 50+ sources documented in `.docs/research/Australian Government Grant Sources.md`
- [ ] Real-time grant updates
- [ ] Multi-jurisdiction support

## Decision Point

After Week 4 demo, if stakeholder approves:
- ✅ Proceed: Build production scraper infrastructure
- ❌ Pivot: Focus on application features, keep manual grant curation

## Related ADRs

- ADR-0003: Application-First Strategy (explains deferral)
- ADR-2050: crawl4ai for AI-Powered Web Scraping (to be used in Phase 2)
- ADR-2053: EMEW Bootstrap Strategy (Week 1 manual approach)
```

**Labels**: `Phase 2`, `on-hold`, `backend`, `scraping`

---

## Update Instructions

To apply these changes to GitHub Issues:

1. **Navigate to**: https://github.com/WhisperLooms/grant-harness/issues

2. **For each issue**:
   - Click "Edit" on the issue
   - Replace title with new title from this document
   - Replace description with new description from this document
   - Update labels as specified
   - Click "Save"

3. **Priority order** (pin or reorder if possible):
   - Issue #1: Grant & Company Ingestion (Week 1)
   - Issue #2: Application Form Replication (Week 2)
   - Issue #3: AI-Powered Population (Week 3)
   - Issue #4: Collaboration & Export (Week 4)
   - Issue #5: Company Profiling (Deferred - Phase 2)
   - Issue #6: Production Scrapers (Deferred - Phase 2)

4. **Add milestone** (if using milestones):
   - Create "Phase 1 Prototype (Weeks 1-4)" milestone
   - Assign Issues #1-4 to this milestone
   - Create "Phase 2 MVP (Weeks 5-8)" milestone
   - Assign Issues #5-6 to this milestone

---

## Next Steps

After updating GitHub Issues:
1. Review updated `.docs/specs/tasks.md` for detailed workflow diagram
2. Review ADRs in `.cursor/rules/` for architectural decisions
3. Review `CLAUDE.md` for updated development guidance
4. Begin Week 1 implementation (EMEW corporate docs ingestion)

---

**Last Updated**: 2025-11-12
**Author**: Grant-Harness Planning Team
**Related Docs**: ADR-0003, tasks.md, CLAUDE.md
