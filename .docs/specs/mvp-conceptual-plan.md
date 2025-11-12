# Grant-Harness MVP Conceptual Plan
## Phase 2: Weeks 5-8

**Date**: 2025-11-12
**Status**: Conceptual (pending Phase 1 completion)
**Depends On**: Phase 1 Prototype (Weeks 1-4) successful completion

---

## Overview

Phase 2 transforms the Phase 1 single-company prototype into a **multi-tenant MVP** capable of serving 5-10 clients simultaneously with production-grade infrastructure.

### Phase 1 → Phase 2 Evolution

| Aspect | Phase 1 (Prototype) | Phase 2 (MVP) |
|--------|---------------------|---------------|
| **Users** | Single company (EMEW) | 5-10 companies |
| **Backend** | Python scripts (`back/grant-prototype/`) | ADK agents (`back/grant-adk/`) |
| **Frontend** | Basic NextJS forms | Full consultant dashboard |
| **Grants** | 8-10 manually curated | 50+ from automated scrapers |
| **Data** | LocalStorage → Supabase | PostgreSQL + Supabase |
| **Deployment** | Local development | Google Cloud Platform |
| **Users** | Single consultant | Multi-user collaboration |

---

## Strategic Goals

### Business Outcomes
1. **Validate Market Fit**: 5-10 paying clients using platform
2. **Demonstrate Scalability**: Handle multiple companies without manual curation
3. **Production Readiness**: Deploy to GCP with monitoring, logging, security
4. **Revenue Generation**: Pilot pricing model (per-company or per-application)

### Technical Outcomes
1. **Automated Grant Discovery**: 50+ sources scraped weekly
2. **Multi-Tenant Architecture**: Secure company data isolation
3. **Real-Time Collaboration**: Multiple stakeholders editing same application
4. **Production Infrastructure**: CI/CD, monitoring, error handling

---

## Week 5: Production Backend Infrastructure

### Goal
Refactor Python prototype scripts into production ADK agents with PostgreSQL persistence.

### Tasks

#### Week 5.1: ADK Agent Migration
- [ ] Convert `scrapers/*.py` → ADK agents in `back/grant-adk/agents/scrapers/`
- [ ] Implement 4 scraper agents (GrantConnect, VIC, NSW, QLD)
- [ ] Add error handling, retries, rate limiting
- [ ] Create agent orchestrator for scheduled scraping

#### Week 5.2: PostgreSQL Schema Design
- [ ] Design schema for grants, companies, applications, matches
- [ ] Create migration scripts (`back/grant-adk/db/migrations/`)
- [ ] Implement ORM models (SQLAlchemy)
- [ ] Add database connection pooling

#### Week 5.3: Grant Ingestion Pipeline
- [ ] Build automated weekly scrape workflow
- [ ] Implement deduplication logic (detect changed grants)
- [ ] Upload new/updated grants to Gemini Grant Corpus
- [ ] Store metadata in PostgreSQL

### Success Criteria
- [ ] All 4 scrapers running as ADK agents
- [ ] 50+ grants in PostgreSQL from automated scraping
- [ ] Gemini Grant Corpus synced weekly
- [ ] Agent orchestrator scheduling scrapes

**Deliverable**: Production-grade grant discovery pipeline

---

## Week 6: Multi-Company Dashboard

### Goal
Build consultant dashboard for managing 5-10 client companies simultaneously.

### Tasks

#### Week 6.1: Company Management UI
- [ ] Create `front/grant-portal/app/dashboard/` route
- [ ] Build company list view (10+ companies)
- [ ] Implement company detail page
- [ ] Add company creation/editing forms

#### Week 6.2: Application Tracking
- [ ] Build application list view (filter by company, status, deadline)
- [ ] Implement status tracking (draft, in-review, approved, submitted)
- [ ] Create deadline notifications
- [ ] Add progress indicators (% complete)

#### Week 6.3: Consultant Workflow
- [ ] Multi-company view dashboard (workload overview)
- [ ] Task queue (pending reviews, upcoming deadlines)
- [ ] Bulk operations (assign grants to companies)
- [ ] Analytics (time saved, applications submitted, funding secured)

### Success Criteria
- [ ] Dashboard shows 10+ companies simultaneously
- [ ] Consultant can switch between company contexts
- [ ] Application status tracking functional
- [ ] Deadline notifications working

**Deliverable**: Multi-tenant consultant dashboard

---

## Week 7: Advanced Collaboration Features

### Goal
Enable multi-stakeholder collaboration with real-time sync and approval workflows.

### Tasks

#### Week 7.1: Real-Time Sync (Supabase)
- [ ] Implement Supabase Realtime subscriptions
- [ ] Add presence indicators ("Gordon is editing field X")
- [ ] Resolve concurrent edit conflicts
- [ ] Add activity feed (audit trail)

#### Week 7.2: Advanced Review Workflow
- [ ] Implement role-based access (consultant, CFO, CEO, reviewer)
- [ ] Build approval chain workflow (CFO → CEO → Submit)
- [ ] Add email notifications for approval requests
- [ ] Create version history (track all changes)

#### Week 7.3: Comment & Annotation System
- [ ] Field-level comments with threading
- [ ] @mentions for stakeholders
- [ ] Inline suggestions ("Change this to...")
- [ ] Resolve/unresolve comment workflow

### Success Criteria
- [ ] 3+ users editing same application simultaneously
- [ ] Real-time presence indicators showing active editors
- [ ] Approval workflow tested (3-stakeholder chain)
- [ ] Comment threads functional

**Deliverable**: Multi-user collaborative editing platform

---

## Week 8: Production Deployment & Monitoring

### Goal
Deploy to Google Cloud Platform with monitoring, logging, and security hardening.

### Tasks

#### Week 8.1: GCP Deployment
- [ ] Set up Cloud Run for backend ADK agents
- [ ] Deploy Next.js frontend to Cloud Run or Vercel
- [ ] Configure Cloud SQL for PostgreSQL
- [ ] Set up Secret Manager for API keys

#### Week 8.2: Monitoring & Observability
- [ ] Add Cloud Logging integration
- [ ] Set up Cloud Monitoring dashboards
- [ ] Implement error tracking (Sentry)
- [ ] Create uptime alerts

#### Week 8.3: Security Hardening
- [ ] Add authentication (Firebase Auth or Auth0)
- [ ] Implement role-based access control (RBAC)
- [ ] Set up HTTPS/SSL certificates
- [ ] Add rate limiting (Cloud Armor)
- [ ] Security audit (OWASP top 10 check)

#### Week 8.4: CI/CD Pipeline
- [ ] Set up GitHub Actions for automated testing
- [ ] Implement automated deployment (staging → production)
- [ ] Add pre-commit hooks (linting, formatting)
- [ ] Create smoke tests for critical paths

### Success Criteria
- [ ] Platform deployed to GCP and accessible via HTTPS
- [ ] 99.9% uptime over 1 week
- [ ] Error tracking capturing issues
- [ ] CI/CD pipeline deploying on every merge to main

**Deliverable**: Production-deployed MVP on GCP

---

## Phase 2 Architecture

### Technology Stack

**Backend** (`back/grant-adk/`):
- **Framework**: Google Agent Development Kit (ADK)
- **Language**: Python 3.11+
- **Package Manager**: uv
- **Database**: PostgreSQL (Cloud SQL)
- **Vector DB**: Gemini File Search (Vertex AI)
- **Task Scheduling**: Cloud Scheduler + Cloud Tasks
- **API**: FastAPI for REST endpoints

**Frontend** (`front/grant-portal/`):
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Shadcn UI + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Real-Time**: Supabase Realtime
- **PDF Export**: @react-pdf/renderer
- **Deployment**: Cloud Run or Vercel

**Infrastructure**:
- **Hosting**: Google Cloud Platform
- **Database**: Cloud SQL (PostgreSQL)
- **Secrets**: Secret Manager
- **Monitoring**: Cloud Logging + Monitoring
- **Error Tracking**: Sentry
- **CI/CD**: GitHub Actions

### Data Model

```sql
-- Core entities
companies (
  id uuid primary key,
  name text,
  industry text,
  state text,
  profile jsonb,  -- Company profile data
  created_at timestamp
)

grants (
  id text primary key,
  title text,
  agency text,
  jurisdiction text,
  sectors text[],
  funding_range int4range,
  opens date,
  closes date,
  status text,
  gemini_file_id text,  -- Link to Gemini corpus
  scraped_at timestamp
)

applications (
  id uuid primary key,
  company_id uuid references companies(id),
  grant_id text references grants(id),
  status text,  -- draft, in-review, approved, submitted
  form_data jsonb,  -- All form field values
  created_by uuid references users(id),
  updated_at timestamp
)

matches (
  id uuid primary key,
  company_id uuid references companies(id),
  grant_id text references grants(id),
  relevance_score float,
  reasoning text,
  created_at timestamp
)

-- Collaboration
comments (
  id uuid primary key,
  application_id uuid references applications(id),
  field_id text,  -- Which form field
  content text,
  author_id uuid references users(id),
  resolved boolean,
  created_at timestamp
)

approvals (
  id uuid primary key,
  application_id uuid references applications(id),
  approver_id uuid references users(id),
  status text,  -- pending, approved, rejected
  comments text,
  decided_at timestamp
)

-- Multi-tenancy
users (
  id uuid primary key,
  email text unique,
  role text,  -- consultant, cfo, ceo, reviewer
  company_id uuid references companies(id),
  created_at timestamp
)
```

### Component Architecture

```
back/grant-adk/
├── agents/
│   ├── scrapers/
│   │   ├── federal_scraper_agent.py
│   │   ├── vic_scraper_agent.py
│   │   ├── nsw_scraper_agent.py
│   │   └── qld_scraper_agent.py
│   ├── company_profiler_agent.py
│   ├── grant_matcher_agent.py
│   ├── form_generator_agent.py
│   └── ai_populator_agent.py
├── db/
│   ├── migrations/
│   ├── models.py
│   └── connection.py
├── gemini/
│   ├── corpus_manager.py
│   ├── grant_corpus.py
│   └── company_corpus.py
├── api/
│   ├── routers/
│   │   ├── grants.py
│   │   ├── companies.py
│   │   ├── applications.py
│   │   └── matches.py
│   └── main.py
└── orchestrator/
    └── scraper_scheduler.py

front/grant-portal/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # Multi-company dashboard
│   │   ├── companies/
│   │   │   └── [companyId]/
│   │   │       ├── page.tsx      # Company detail
│   │   │       └── applications/
│   │   │           └── page.tsx  # Company applications
│   │   └── applications/
│   │       └── page.tsx          # All applications
│   ├── applications/[grantId]/
│   │   └── page.tsx              # Application form
│   └── api/
│       └── applications/
│           └── [id]/
│               └── export/
│                   └── route.ts  # PDF export
├── components/
│   ├── dashboard/
│   │   ├── CompanyList.tsx
│   │   ├── ApplicationList.tsx
│   │   ├── TaskQueue.tsx
│   │   └── Analytics.tsx
│   ├── forms/
│   │   └── ... (from Phase 1)
│   └── collaboration/
│       ├── PresenceIndicator.tsx
│       ├── ActivityFeed.tsx
│       └── ApprovalWorkflow.tsx
└── lib/
    ├── supabase/
    │   ├── client.ts
    │   └── schema.sql
    └── api/
        └── backend-client.ts
```

---

## Migration Strategy: Phase 1 → Phase 2

### Data Migration
1. **Preserve EMEW Case Study**: Migrate EMEW application to PostgreSQL as first company
2. **Grant Data**: Import all scraped grants from Phase 1 into PostgreSQL
3. **Form Schemas**: Migrate IGP + BBI/VMA form schemas to database

### Code Refactoring
1. **Backend**: Gradually migrate `back/grant-prototype/*.py` → ADK agents
2. **Frontend**: Extend existing NextJS app with dashboard routes
3. **Backward Compatibility**: Maintain Phase 1 scripts during transition

### Rollout Plan
- **Week 5**: Backend migration (no user-facing changes)
- **Week 6**: Dashboard soft launch (consultant-only access)
- **Week 7**: Invite 2-3 pilot companies
- **Week 8**: Public MVP launch (5-10 companies)

---

## Risks & Mitigations

### Risk 1: Phase 1 Prototype Not Successful
**Concern**: If Week 4 demo doesn't demonstrate time savings, stakeholders may not approve Phase 2
**Mitigation**:
- Phase 1 must show clear value: <2 hour application completion vs 10+ hours manual
- Get stakeholder buy-in before Week 5 development
- Have go/no-go decision point after Week 4 demo

**Decision Point**: Only proceed to Phase 2 if Phase 1 demonstrates measurable time savings

### Risk 2: Multi-Tenancy Complexity
**Concern**: Scaling to 5-10 companies introduces data isolation, performance challenges
**Mitigation**:
- Use proven multi-tenant patterns (row-level security in PostgreSQL)
- Implement rate limiting per company
- Add monitoring for performance bottlenecks
- Start with 2-3 companies, scale gradually

### Risk 3: Real-Time Collaboration Performance
**Concern**: Supabase Realtime may not handle 10+ simultaneous users well
**Mitigation**:
- Load test with 20+ concurrent users before Week 7
- Implement optimistic UI updates (don't wait for server)
- Add conflict resolution strategy
- Consider Firebase as fallback if Supabase doesn't perform

**Decision Point**: Week 7 Day 1 - test Supabase with 20 concurrent users, pivot to Firebase if issues

### Risk 4: Scraper Maintenance Burden
**Concern**: 50+ scrapers may break frequently as government websites change
**Mitigation**:
- Build scraper health monitoring dashboard
- Add automated alerts for scraper failures
- Create scraper maintenance runbook
- Consider hiring scraper maintenance contractor in Phase 3

---

## Success Criteria (Go/No-Go for Phase 3)

After Week 8, evaluate if MVP is ready for Phase 3 scale (Weeks 9-12):

### Must Have (Go/No-Go)
- [ ] **5+ companies actively using platform** (validated market fit)
- [ ] **10+ grant applications generated** (demonstrated value)
- [ ] **99% uptime over 2 weeks** (production stability)
- [ ] **<5 second page load times** (acceptable performance)
- [ ] **Zero security incidents** (secure multi-tenancy)

### Should Have (Phase 3 Improvements)
- [ ] 50+ grants in database from automated scraping
- [ ] Multi-stakeholder approval workflow tested
- [ ] Real-time collaboration working smoothly
- [ ] CI/CD pipeline fully automated

### Decision Matrix

| Metric | Threshold | Status | Go/No-Go |
|--------|-----------|--------|----------|
| Active companies | ≥5 | TBD | Required for GO |
| Applications generated | ≥10 | TBD | Required for GO |
| Uptime (2 weeks) | ≥99% | TBD | Required for GO |
| Page load time | <5s | TBD | Required for GO |
| Security incidents | 0 | TBD | Required for GO |
| Grants in database | ≥50 | TBD | Nice to have |
| Approval workflows | Working | TBD | Nice to have |
| Realtime collab | Stable | TBD | Nice to have |

---

## Phase 3 Preview (Weeks 9-12)

If Phase 2 MVP is successful, Phase 3 will focus on:

1. **Scale to 50+ Companies**
   - Multi-tenant performance optimization
   - Regional deployment (Australia-wide)
   - Enterprise features (SSO, audit logs)

2. **All 50+ Grant Sources**
   - Scrape all sources documented in `.docs/research/Australian Government Grant Sources.md`
   - 500+ grants in database
   - Daily scraping frequency

3. **Advanced AI Features**
   - Grant recommendation engine (proactive matching)
   - Application quality scoring
   - Predictive funding success probability
   - Grant deadline forecasting

4. **Revenue & Business Model**
   - Pricing tiers (basic, professional, enterprise)
   - Consultant marketplace (connect SMEs to consultants)
   - API access for partners
   - White-label offering for larger consultancies

---

## Budget & Resource Estimates

### GCP Monthly Costs (Phase 2 MVP)
- **Cloud Run** (backend ADK agents): $50-100/month
- **Cloud Run** (Next.js frontend): $30-50/month
- **Cloud SQL** (PostgreSQL): $100-200/month
- **Gemini API** (File Search + LLM calls): $200-500/month (depending on usage)
- **Cloud Storage**: $10-20/month
- **Monitoring & Logging**: $20-50/month

**Total Estimated**: $410-920/month for 5-10 companies

### Development Time
- **Week 5**: Backend infrastructure (40 hours)
- **Week 6**: Multi-company dashboard (40 hours)
- **Week 7**: Collaboration features (40 hours)
- **Week 8**: Deployment & hardening (40 hours)

**Total**: 160 hours over 4 weeks (1 full-time developer)

---

## Documentation Updates Required

Before starting Phase 2, update:
1. **`.cursor/rules/backend/ADR.mdc`**: Add ADR-2100+ for ADK agent decisions
2. **`.cursor/rules/frontend/ADR.mdc`**: Update ADR-1004 (finalize Supabase decision)
3. **`.docs/specs/tasks.md`**: Add Week 5-8 workflow diagram
4. **`CLAUDE.md`**: Update "Current Phase" to Week 5

---

## Conclusion

Phase 2 transforms the single-company prototype into a **production-ready multi-tenant MVP** capable of serving 5-10 clients simultaneously with automated grant discovery and real-time collaboration.

**Key Deliverables**:
- Production backend (ADK agents on GCP)
- Multi-company consultant dashboard
- Real-time collaboration with approval workflows
- Automated weekly grant scraping (50+ sources)

**Success Metric**: 5+ companies actively using platform, demonstrating market fit and readiness for Phase 3 scale.

---

**Last Updated**: 2025-11-12
**Author**: Grant-Harness Planning Team
**Related Docs**: Phase 0 Documentation Summary, ADR-0003 (Application-First Strategy)
**Next Review**: After Week 4 demo (go/no-go decision)
