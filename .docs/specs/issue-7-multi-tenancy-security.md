# Multi-Tenancy & Data Segregation Security (Phase 2)

## Overview

**Phase 2 (Weeks 5-8)** - Implement multi-tenant security architecture to support 5-10 companies simultaneously with strict data segregation.

## Strategic Context

Current Phase 1 prototype uses single company (EMEW) with Gemini dual-corpus architecture (ADR-2051). When scaling to multi-company platform, **confidential company data must be strictly segregated** to prevent cross-company leakage.

**CRITICAL**: Company Corpus contains:
- Corporate documents (business plans, financials)
- Project-specific documents (competitive advantage)
- Application drafts (pre-submission sensitive data)

## Security Requirements

### 1. Authentication & Authorization

**User Model**:
```typescript
interface User {
  id: uuid;
  email: string;
  role: 'consultant' | 'cfo' | 'ceo' | 'reviewer';
  company_id: string;  // CRITICAL: Ties user to company
  created_at: timestamp;
}
```

**Requirements**:
- User authentication (Supabase Auth or Firebase Auth)
- JWT tokens include company_id claim
- Role-based access control (RBAC)
- Session management (30-day expiry)

### 2. Data Segregation (Application Layer)

**Forced Metadata Filtering** (per ADR-2054):
```python
# Backend API ALWAYS enforces company_id filter
def query_company_corpus(user: User, query: str, filters: dict = None):
    if not user.authenticated:
        raise Unauthorized()

    # CRITICAL: Always filter by authenticated user's company_id
    base_filter = f"company_id={user.company_id}"

    # Merge additional filters (if provided)
    if filters:
        user_filter = " AND ".join(f"{k}={v}" for k, v in filters.items())
        metadata_filter = f"{base_filter} AND {user_filter}"
    else:
        metadata_filter = base_filter

    # Audit log
    log_query(user.id, user.company_id, query, timestamp=now())

    return manager.company_corpus.query(query, metadata_filter=metadata_filter)
```

**Requirements**:
- Never allow users to override company_id filter
- Backend validates company_id matches authenticated user
- API endpoints reject cross-company queries
- Audit log all corpus queries (user_id, company_id, query, timestamp)

### 3. Row-Level Security (PostgreSQL RLS)

```sql
-- Applications table
CREATE POLICY company_isolation ON applications
FOR ALL TO authenticated
USING (company_id = auth.jwt() ->> 'company_id');

-- Comments table
CREATE POLICY comment_isolation ON comments
FOR ALL TO authenticated
USING (
  application_id IN (
    SELECT id FROM applications
    WHERE company_id = auth.jwt() ->> 'company_id'
  )
);
```

**Requirements**:
- PostgreSQL RLS policies enforce company_id isolation
- Supabase Client configured with RLS enabled
- No direct database access bypasses RLS

### 4. Audit Logging

**Audit Trail Schema**:
```sql
CREATE TABLE corpus_query_audit (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    company_id TEXT NOT NULL,
    corpus TEXT NOT NULL,  -- 'company', 'grant', 'market'
    query TEXT NOT NULL,
    metadata_filter TEXT NOT NULL,
    results_count INTEGER,
    timestamp TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);
```

**Requirements**:
- Log every Gemini corpus query (Company, Grant, Market)
- Track user_id, company_id, query text, filters applied
- Immutable audit log (append-only, no DELETE permission)
- Admin dashboard to review audit logs
- Alert on suspicious queries

### 5. Testing & Verification

**Security Test Suite**:
```python
def test_cross_company_query_blocked():
    # User from Company A
    user_a = authenticate("user@companya.com")

    # Attempt to query Company B's data
    with pytest.raises(Forbidden):
        query_company_corpus(
            user=user_a,
            query="Get company info",
            filters={"company_id": "company-b"}  # Should be rejected
        )
```

**Manual Security Tests**:
- Consultant from Company A cannot see Company B's applications
- Consultant from Company A cannot query Company B's corpus data
- JWT token with modified company_id is rejected
- Audit log captures all corpus queries
- No cross-company data leakage in any API endpoint

## Implementation Plan

### Week 5: Authentication & User Management

**Tasks**:
- Set up Supabase Auth (or Firebase Auth)
- Create users table with company_id column
- Implement JWT token generation with company_id claim
- Build user registration/login UI
- Admin user management dashboard

### Week 6: Application-Layer Security

**Tasks**:
- Refactor corpus_manager.py to require authenticated User
- Implement forced company_id filtering in all Company Corpus queries
- Add backend validation (reject cross-company queries)
- Create audit logging system
- Write security test suite

### Week 7: Row-Level Security (PostgreSQL)

**Tasks**:
- Enable PostgreSQL RLS on all tables
- Create RLS policies for applications, comments, approvals, documents
- Configure Supabase Client with RLS
- Test RLS policies

### Week 8: Security Hardening & Audit Dashboard

**Tasks**:
- Admin audit dashboard (review all corpus queries)
- Suspicious query alerts
- Rate limiting per company
- Penetration testing
- Security documentation

## Related ADRs

- ADR-2054: Project & Market Data Management
- ADR-2055: Multi-Tenancy Data Segregation Strategy (NEW - Create in Week 5)

## Security Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cross-company data leakage | Medium | Critical | Forced metadata filtering + audit logging |
| JWT token tampering | Low | High | JWT signature verification, short expiry |
| Insider threat | Low | Critical | Audit logging + anomaly detection |
| Gemini API bypasses filter | Low | Critical | Application-layer validation |
| SQL injection | Low | High | Parameterized queries, input validation |

## Deferred to Phase 3

- End-to-end encryption
- SCIM provisioning (enterprise SSO)
- Geographic data residency
- GDPR/privacy compliance

---

**Last Updated**: 2025-11-12
**Milestone**: Phase 2 (Weeks 5-8)
**Priority**: High
**Related Issues**: #1, #5, #6
