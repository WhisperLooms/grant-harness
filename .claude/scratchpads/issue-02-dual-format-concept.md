# Issue #2: Dual-Format Form Concept - Government vs Collaboration Mode

**Date**: 2025-11-13
**Status**: Concept Documentation (Not Yet Implemented)
**Purpose**: Define two distinct form experiences for different use cases

---

## Overview

Each grant application will have **two different form formats**:

1. **Government Format** - Exact replica of official PDF for final submission
2. **Collaboration Format** - AI-assisted modern interface optimized for drafting

**Current Implementation**: Only Government Format (Step 1 complete, Steps 2-7 pending)
**Future Implementation**: Collaboration Format (Phase 2-3)

---

## Format 1: Government Format (Current)

### Purpose
- Exact visual replica of official government PDF application form
- Used for final review before submission
- Ensures compliance with government requirements
- Familiar interface for stakeholders who know the official form

### Structure
**Multi-step format** (7 steps for IGP):
1. Step 1: Eligibility Check (9 fields)
2. Step 2: Organization Details (22 fields)
3. Step 3: Business Information (16 fields)
4. Step 4: Project Overview (12 fields)
5. Step 5: Project Budget (10 fields)
6. Step 6: Assessment Criteria (4 criteria)
7. Step 7: Contact & Declaration (12 fields)

### User Experience
- **Navigation**: Previous/Next buttons, step indicator
- **Persistence**: Auto-save to LocalStorage (Phase 1) or Firestore (Phase 2)
- **Validation**: Inline errors matching government requirements
- **Export**: PDF matching official format (Week 4)

### Use Cases
- Final review by CEO/CFO before submission
- Compliance verification by consultant
- Official submission to government portal
- Archival and record-keeping

### Current Status
✅ Step 1 implemented
⏳ Steps 2-7 pending
✅ Infrastructure complete (context, progress, navigation)

---

## Format 2: Collaboration Format (Future)

### Purpose
- **Optimized for team collaboration** during drafting phase
- **AI-assisted** field population from company documents
- **Context-aware** - each field has AI chat and document upload
- **Faster iteration** - minimize clicking through steps
- **Modern UX** - chat-based interaction, not form-based

### Structure
**Two-page format**:

#### Page 1: Project Onboarding & AI Chat
**Purpose**: Gather high-level project information and initiate AI assistance

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│  Industry Growth Program Application                │
│  Draft Mode - AI-Assisted                           │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [Chat Window - Full Height]                        │
│                                                      │
│  AI: "Hi! Let's start your IGP application.         │
│       I've analyzed your company documents.          │
│       Tell me about the project you want to apply    │
│       funding for."                                  │
│                                                      │
│  User: "We're developing a battery recycling        │
│         process that recovers 95% of lithium..."    │
│                                                      │
│  AI: "Great! That aligns with NRF priority areas.   │
│       Let me help you structure this. I'll need     │
│       a few key details..."                          │
│                                                      │
│  [Type your message...]                [Send]       │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Key Project Details                                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Project Title:                                      │
│  [______________________________________________]    │
│  [AI Suggest] [Clear]                               │
│                                                      │
│  Project Summary (50-200 chars):                    │
│  [______________________________________________]    │
│  [______________________________________________]    │
│  [AI Generate] [Clear]                              │
│                                                      │
│  Estimated Total Budget:                            │
│  [$____________] (min $200,000)                     │
│  [AI Calculate from Documents] [Clear]              │
│                                                      │
│  Estimated Grant Amount Sought:                     │
│  [$____________] ($100K - $5M)                      │
│  [AI Recommend] [Clear]                             │
│                                                      │
│  [Upload Project Documents]                         │
│  📄 Business Plan.pdf (uploaded)                    │
│  📄 Technical Specifications.pdf (uploaded)         │
│  [+ Add More Documents]                             │
│                                                      │
│  [Continue to Full Application] →                   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Features**:
- **AI Chat**: Conversational interface to understand project scope
- **Smart Suggestions**: AI generates/suggests values based on uploaded documents
- **Quick Capture**: Only essential fields (title, summary, budget)
- **Document Upload**: Context for AI to use throughout application
- **Natural Flow**: Chat → Key Details → Continue

**AI Capabilities (Page 1)**:
- Analyze uploaded company documents (business plans, financials, technical specs)
- Extract project information from conversation
- Suggest project titles based on technical descriptions
- Generate concise project summaries
- Calculate estimated budgets from financial documents
- Recommend appropriate grant amounts based on project scope

#### Page 2: Full Application with Per-Field AI Assistance
**Purpose**: Complete entire application with AI help at every field

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│  Industry Growth Program Application - Draft Mode    │
│  [Switch to Government Format] [Save Draft]          │
├──────────────────────┬──────────────────────────────┤
│                      │                               │
│  FULL FORM           │  AI CHAT & CONTEXT            │
│  (Left 60%)          │  (Right 40%)                  │
│                      │                               │
│  Section A:          │  Currently helping with:      │
│  Eligibility         │  ► Section C: Organization    │
│                      │                               │
│  Section B:          │  [Chat for this field]        │
│  Organization        │                               │
│                      │  AI: "I found your ABN in     │
│  ► Section C:        │      the business             │
│     Company Details  │      registration. Is         │
│                      │      12 345 678 901           │
│  ABN:                │      correct?"                │
│  [12 345 678 901]    │                               │
│  💬 Chat  📄 Upload  │  User: "Yes, that's correct"  │
│                      │                               │
│  Company Name:       │  AI: "Great! I'll also fill   │
│  [EMEW Corporation]  │      the company name from    │
│  💬 Chat  📄 Upload  │      the same document."      │
│  ✅ AI Populated     │                               │
│                      │  [Type message for this       │
│  Trading As:         │   field...] [Send]            │
│  [______________]    │                               │
│  💬 Chat  📄 Upload  │  Documents for this field:    │
│                      │  📄 Business Registration.pdf │
│  Business Address:   │  [+ Upload More]              │
│  Street:             │                               │
│  [______________]    │  [Copy AI's suggestion]       │
│  💬 Chat  📄 Upload  │  [Reject & Rewrite]           │
│                      │                               │
│  Section D:          │                               │
│  Project Details     │                               │
│                      │                               │
│  Section E:          │                               │
│  Budget              │                               │
│                      │                               │
│  [Continue...]       │                               │
│                      │                               │
└──────────────────────┴──────────────────────────────┘
```

**Features Per Field**:
- 💬 **Chat Icon**: Click to open field-specific AI chat
- 📄 **Upload Icon**: Add documents relevant to this specific field
- ✅ **Status Indicator**: Shows if AI populated, user edited, or pending
- **Inline Suggestions**: AI suggestions appear directly in field with accept/reject

**Field States**:
1. **Empty** - User needs to fill or ask AI
2. **AI Suggested** - AI has populated, pending user approval (highlighted in yellow)
3. **User Approved** - User accepted AI suggestion (normal state)
4. **User Edited** - User manually edited after AI suggestion
5. **User Completed** - User filled without AI assistance

**AI Capabilities (Page 2)**:
- **Per-field chat**: Context-aware conversation for each field
- **Document analysis**: AI reads uploaded docs to find relevant information
- **Cross-field intelligence**: AI understands dependencies (e.g., budget breakdown must sum to total)
- **Validation**: AI checks for errors before user submits
- **Learning**: AI improves suggestions based on user edits

**Document Upload Per Field**:
- User can upload field-specific context (e.g., financial statements for budget section)
- AI analyzes new uploads and updates suggestions
- Documents tagged to specific fields for better organization

### User Flows

#### Scenario 1: Consultant Starting Draft for Client
```
1. Consultant uploads client documents (business plan, financials)
2. AI analyzes documents in background
3. Page 1: AI chat asks clarifying questions
4. Consultant provides project details via chat
5. AI suggests project title, summary, budget
6. Consultant accepts/edits key details
7. Click "Continue to Full Application"
8. Page 2: Form 70% pre-populated by AI
9. Consultant reviews each section:
   - Clicks 💬 to ask AI about unclear fields
   - Uploads 📄 additional context for specific sections
   - Accepts ✅ or edits AI suggestions
10. AI flags missing mandatory fields
11. Consultant completes remaining fields
12. Saves draft, shares with CEO for review
```

#### Scenario 2: CEO Reviewing Draft
```
1. CEO receives "Draft ready for review" notification
2. Opens Collaboration Format (Page 2)
3. Sees form 90% complete (consultant + AI work)
4. Reviews Section D (Project Overview):
   - Clicks 💬 on "Project Expected Outcomes"
   - Asks AI: "Can you make this more focused on job creation?"
   - AI rewrites focusing on employment outcomes
   - CEO accepts new version
5. Reviews Section E (Budget):
   - Uploads 📄 latest financial forecast
   - Asks AI: "Update budget based on this forecast"
   - AI recalculates labour and contract costs
6. Marks draft as "Approved - Ready for CFO"
```

#### Scenario 3: CFO Finalizing Budget
```
1. CFO opens application in Collaboration Format
2. Jumps directly to Section E (Budget)
3. Clicks 💬 on "Labour Costs"
4. Uploads 📄 detailed payroll spreadsheet
5. AI analyzes spreadsheet:
   - Extracts relevant costs
   - Validates against 30% on-costs limit
   - Suggests adjustments
6. CFO accepts AI's breakdown
7. Clicks "Switch to Government Format" to see final PDF view
8. Confirms everything looks correct
9. Marks as "Ready for Submission"
```

---

## Technical Architecture (Future)

### Data Model

**Single Application Record** (Firestore):
```typescript
{
  id: UUID,
  userId: string,
  grantId: "igp-commercialisation",
  companyId: "c-emew",

  // Format tracking
  lastViewedFormat: "collaboration" | "government",

  // Form data (same structure for both formats)
  formData: {
    step1_eligibility: {...},
    step2_organization: {...},
    // ... all steps
  },

  // Collaboration-specific data
  collaborationData: {
    chatHistory: [
      {
        fieldId: "step4_project.projectTitle",
        messages: [
          { role: "ai", content: "Based on your docs, I suggest...", timestamp },
          { role: "user", content: "Can you make it shorter?", timestamp },
        ]
      }
    ],

    aiSuggestions: {
      "step4_project.projectTitle": {
        suggested: "Advanced Lithium Battery Recycling Process",
        status: "accepted" | "rejected" | "pending",
        confidence: 0.92,
        sources: ["business-plan.pdf", "technical-specs.pdf"]
      }
    },

    fieldDocuments: {
      "step5_budget.labourCosts": [
        { filename: "payroll-forecast.xlsx", uploadedAt, uploadedBy }
      ]
    },

    onboardingComplete: true,
    projectSummary: "...", // From Page 1
  },

  status: "draft" | "in_review" | "approved" | "submitted",
  currentStep: number, // For Government Format navigation
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

### Component Architecture

**Shared Components**:
- Same form validation (Zod schemas)
- Same data model
- Same submission logic

**Format-Specific Components**:

**Government Format**:
```
src/app/(public)/applications/[grantId]/
  ├── government/           ← Government Format
  │   ├── step1/
  │   ├── step2/
  │   └── ...
```

**Collaboration Format**:
```
src/app/(public)/applications/[grantId]/
  ├── collaboration/        ← Collaboration Format
  │   ├── onboarding/       ← Page 1
  │   └── draft/            ← Page 2
```

**Format Switcher**:
```typescript
// Top navigation
<FormatSwitcher>
  <Button onClick={() => setFormat('government')}>
    Government Format (Final Review)
  </Button>
  <Button onClick={() => setFormat('collaboration')}>
    Collaboration Format (Drafting)
  </Button>
</FormatSwitcher>
```

### AI Integration Points

**Backend API Routes** (Phase 2):
```
POST /api/ai/analyze-documents
  - Upload company/project documents
  - Extract structured data
  - Return suggestions for all fields

POST /api/ai/chat/field
  - Field-specific chat conversation
  - Context: field schema, uploaded docs, current value
  - Returns: AI response + suggested value

POST /api/ai/suggest-value
  - Request AI to populate specific field
  - Input: field ID, context documents
  - Returns: suggested value + confidence score

POST /api/ai/validate-application
  - Review complete application
  - Check for errors, inconsistencies
  - Return: validation report + suggestions
```

**AI Context Management**:
- **Global Context**: All uploaded company documents (business plan, financials, etc.)
- **Field Context**: Documents uploaded for specific field
- **Conversation Context**: Previous chat messages for that field
- **Cross-field Context**: Related fields (e.g., budget breakdown → total budget)

---

## Implementation Phases

### Phase 1 (Current - Week 2)
- ✅ Government Format Step 1
- ⏳ Government Format Steps 2-7
- ❌ Collaboration Format (not started)

### Phase 2 (Week 3 - Collaboration Backend)
- Add Firebase/Firestore for data storage
- Create API routes for AI integration
- Implement document upload and storage
- Build AI suggestion engine (basic)

### Phase 3 (Week 4 - Collaboration UI)
- Build Page 1: Onboarding & Chat
- Build Page 2: Full form with per-field AI chat
- Implement format switcher
- Add document upload per field

### Phase 4 (Week 5+ - AI Enhancement)
- Improve AI suggestions (use RAG on company docs)
- Add cross-field intelligence
- Implement AI validation
- Add AI learning from user edits

---

## User Experience Comparison

### Government Format
**Pros**:
- Familiar to stakeholders who know official form
- Exact match to government requirements
- Good for final compliance review
- Clear step-by-step structure

**Cons**:
- Slow for initial drafting (7 steps × multiple pages)
- No AI assistance
- Manual field population
- Requires clicking through many pages

**Best For**:
- Final review before submission
- CEO/CFO sign-off
- Compliance verification
- Stakeholders who prefer traditional forms

### Collaboration Format
**Pros**:
- Fast initial drafting (AI pre-populates 70%+)
- Single-page view of entire form
- Per-field AI chat for clarification
- Document upload per field
- Real-time collaboration

**Cons**:
- Different from official government format
- Requires trust in AI suggestions
- May be unfamiliar to traditional users
- More complex UI

**Best For**:
- Initial drafting by consultant
- Team collaboration during draft phase
- Fast iteration with AI assistance
- Clients comfortable with modern UI

---

## Workflow Integration

### Typical Application Journey:

```
1. Start Application
   └─> Collaboration Format (Page 1 - Onboarding)
       └─> Upload company documents
       └─> AI chat about project
       └─> Fill key details (title, summary, budget)

2. Draft Application
   └─> Collaboration Format (Page 2 - Full Form)
       └─> AI pre-populates 70% of fields
       └─> Consultant reviews/edits each section
       └─> Upload additional docs per field
       └─> Chat with AI about unclear fields
       └─> Complete remaining fields

3. Internal Review
   └─> Collaboration Format (team edits together)
       └─> CEO reviews project overview
       └─> CFO reviews budget
       └─> Each can chat with AI for refinements

4. Final Review
   └─> Switch to Government Format
       └─> Review in official layout
       └─> Verify all fields complete
       └─> Check formatting matches government requirements

5. Export & Submit
   └─> Export PDF from Government Format
   └─> Submit to government portal
```

---

## Key Design Principles

### 1. Same Data Model
- Both formats read/write to **same** form data
- Switching formats preserves all entered data
- No data duplication or sync issues

### 2. AI Transparency
- Always show AI confidence level
- Allow user to accept/reject/edit suggestions
- Display source documents for suggestions
- User has final control

### 3. Progressive Enhancement
- Government Format works without AI (Phase 1)
- Collaboration Format adds AI assistance (Phase 2-3)
- Users can choose format based on preference

### 4. Non-Destructive Editing
- Switching formats never loses data
- AI suggestions don't overwrite user edits
- All changes tracked with timestamps and authors

### 5. Compliance First
- Government Format is source of truth for submission
- Collaboration Format optimizes drafting, not submission
- PDF export always from Government Format

---

## Future Enhancements (Post-MVP)

### Advanced AI Features:
- **Smart Templates**: AI learns from successful applications, suggests project structures
- **Budget Optimizer**: AI recommends optimal budget allocation based on similar grants
- **Compliance Checker**: AI flags potential eligibility issues before submission
- **Multi-Grant Matching**: AI suggests which fields can be reused across multiple grants

### Collaboration Features:
- **Real-time co-editing**: Multiple users edit simultaneously (Google Docs style)
- **Comment threads**: Per-field discussions (consultant → CEO → CFO)
- **Approval workflow**: Require sign-off from specific stakeholders
- **Version history**: Track all changes with rollback capability

### Integration Features:
- **Accounting software integration**: Pull financial data from Xero/QuickBooks
- **CRM integration**: Import company data from Salesforce/HubSpot
- **Document management**: Integrate with Google Drive/Dropbox for document uploads

---

## Success Metrics

### Government Format:
- Time to complete application: Target <2 hours (vs 10+ hours manual)
- User satisfaction with form accuracy: >90%
- PDF export matches government format: 100%

### Collaboration Format:
- AI pre-population accuracy: >70% of fields
- Time to draft application: Target <30 minutes (with AI assistance)
- User edits required: <30% of AI suggestions
- Collaboration efficiency: 3× faster than email-based drafting

---

## Open Questions (To Be Resolved)

1. **AI Model Selection**: Which LLM for field population? (GPT-4, Claude, Gemini?)
2. **Document Processing**: How to extract structured data from PDFs/spreadsheets?
3. **Chat Context Window**: How much history to include per field? (Token limits)
4. **Real-time Collaboration**: Use Supabase or Firebase for real-time sync?
5. **Mobile Support**: Does Collaboration Format work on mobile/tablet?
6. **Offline Mode**: Can users draft without internet? (LocalStorage → sync later)

---

## Next Steps

### Immediate (Week 2):
- ✅ Complete Government Format (Steps 2-7)
- Document this concept in scratchpad
- Get stakeholder feedback on Collaboration Format design

### Short-term (Week 3):
- Design detailed mockups for Collaboration Format
- Plan AI integration architecture
- Prototype Page 1 (Onboarding) with basic AI chat

### Medium-term (Week 4):
- Build Collaboration Format MVP
- Implement basic AI field population
- Add format switcher
- Test with EMEW as pilot client

---

**Document Status**: Concept documented, ready for stakeholder review
**Implementation Status**: Not yet started (Phase 2-3)
**Next Action**: Get feedback on concept before building
