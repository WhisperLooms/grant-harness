  ⎿  Grant-Harness Slash Command Workflow Plan

     Critical Review of Proposed Approach

     ✅ Strengths

     1. Logical workflow structure (g→c→m→a→p→s) maps business process well
     2. Naming convention (letter + 2 digits) allows 99 steps per phase, good scalability
     3. Progressive disclosure - each command builds on previous outputs
     4. Clear separation between data gathering (g), analysis (c,m), and action (a,p,s)

     ⚠️ Considerations & Adjustments

     1. Technology change: Switching from Scrapy to crawl4ai requires:
       - Removing scrapy dependency
       - Adding crawl4ai + asyncio support
       - New scraper architecture (async vs Scrapy's event-driven)
       - Impact: Delays Week 1 timeline, needs new ADR-2051
     2. Storage decision: Local filesystem for prototype is pragmatic but:
       - Plan migration path to Google Cloud Storage in Phase 2
       - Keep index files local (CSVs/JSONs) for git tracking
       - Store only binary docs (.pdf, .docx) locally in .outputs/
     3. Full workflow scope: Ambitious for 4-week prototype:
       - Recommend: Implement g→c→m in Weeks 1-3, design a→p→s commands in Week 4
       - Application form replication (a) and AI population (p) are complex (NextJS forms, 
     multi-user state)
       - Submission workflow (s) requires govt portal integration research
     4. Date filtering: "Jan 2026 onwards" works but:
       - Add configurable date parameter: --from-date 2026-01-01
       - Include "upcoming" grants not yet open for applications

     Complete Slash Command Structure

     G-Series: Grant Discovery & Data Collection

     - g01-grant-lists.md - Compile comprehensive grant list (CSV output)
     - g02-grant-docs.md - Scrape full details + download docs (PDF/HTML)
     - g03-gemini-upload.md - Upload to Gemini File Search vector DB
     - g04-grant-sync.md - Re-scrape sources, detect changes/new grants
     - g05-grant-validate.md - Verify data quality, check required fields

     C-Series: Company Profiling

     - c01-company-scrape.md - Extract data from company website
     - c02-company-profile.md - Build structured profile JSON
     - c03-company-vector.md - Create company vector database
     - c04-company-docs.md - Process uploaded company documents
     - c05-company-validate.md - Check profile completeness

     M-Series: Matching & Analysis

     - m01-match-grants.md - AI-powered grant matching (existing)
     - m02-match-explain.md - Deep-dive on specific match reasoning
     - m03-match-rank.md - Sort/filter by relevance, funding, deadline
     - m04-match-eligibility.md - Detailed eligibility assessment
     - m05-match-export.md - Export results to CSV/PDF for stakeholders

     A-Series: Application Replication

     - a01-app-identify.md - Detect application form structure
     - a02-app-extract.md - Extract questions/fields from grant docs
     - a03-app-replicate.md - Generate NextJS form component
     - a04-app-map.md - Map company/grant data to form fields
     - a05-app-validate.md - Check form completeness

     P-Series: Population & Collaboration

     - p01-populate-ai.md - AI auto-fill form fields from context
     - p02-populate-review.md - Mark fields needing human review
     - p03-populate-comment.md - Add consultant/expert comments
     - p04-populate-docs.md - Attach supporting documents
     - p05-populate-export.md - Generate draft application PDF

     S-Series: Signoff & Submission

     - s01-signoff-request.md - Send for company/consultant review
     - s02-signoff-track.md - Monitor approval status
     - s03-signoff-changes.md - Log review changes/feedback
     - s04-signoff-finalize.md - Lock application for submission
     - s05-submit-portal.md - Upload to government grant portal

     Detailed Grant Listing & Scraping Approach

     Architecture Changes

     back/grant-prototype/
     ├── scrapers/
     │   ├── base_crawler.py         # crawl4ai base class (replaces base_scraper.py)
     │   ├── grant_list_crawler.py   # High-level list extraction
     │   ├── grant_detail_crawler.py # Deep scrape individual grants
     │   ├── sources/
     │   │   ├── federal.py          # GrantConnect crawler
     │   │   ├── vic.py              # Sustainability Victoria
     │   │   ├── nsw.py              # NSW Grants Portal
     │   │   └── qld.py              # Business Queensland
     │   └── utils/
     │       ├── date_parser.py      # Handle AU date formats
     │       └── document_downloader.py  # PDF/DOCX downloads
     ├── .outputs/
     │   ├── g01-grant-lists/        # CSV files with timestamps
     │   ├── g02-grant-docs/         # Per-grant folders with PDFs
     │   │   ├── index.json          # Metadata: {grant_id: {files: [...], scraped_at: ...}}
     │   │   └── {grant_id}/         # Folder per grant
     │   └── g03-gemini-uploads/     # Upload logs/manifests

     g01-grant-lists: Implementation Approach

     Command: /g01-grant-lists [--sources federal,vic,nsw,qld] [--from-date 2026-01-01]

     Steps:
     1. Initialize crawl4ai:
     from crawl4ai import AsyncWebCrawler
     crawler = AsyncWebCrawler(verbose=True)
     2. For each source:
       - Load source config from .docs/research/Australian Government Grant Sources.md
       - Define extraction schema (LLM-guided):
       extraction_strategy = LLMExtractionStrategy(
         instruction="Extract grant listings with: title, agency, min/max funding, open date, close     
     date, URL"
     )
     3. Crawl list pages:
       - Use AsyncWebCrawler.arun() with extraction strategy
       - Handle pagination (crawl4ai supports multi-page)
       - Parse dates, filter for >= from-date
     4. Output CSV:
     grant_id,title,agency,jurisdiction,sectors,funding_min,funding_max,opens,closes,url,status
     GC2026001,"Recycling Modernisation 
     Fund",DCCEEW,Federal,recycling,50000,10000000,2026-01-15,2026-04-30,https://...,upcoming
     5. Save: back/grant-prototype/.outputs/g01-grant-lists/g01-grant-list_20251112T143022.csv

     Fallback: If crawl4ai fails (complex JavaScript), use playwright MCP:
     - Call mcp__playwright__navigate and mcp__playwright__screenshot
     - Use vision model to extract table data
     - Manual verification needed

     g02-grant-docs: Implementation Approach

     Command: /g02-grant-docs <g01-csv-path> [--grant-ids GC2026001,VIC2026005]

     Steps:
     1. Load CSV: Parse g01-grant-list_[timestamp].csv
     2. Filter grants: If --grant-ids specified, process only those
     3. For each grant:
       - Navigate to grant URL
       - Extract full details (description, eligibility, assessment criteria, conditions)
       - Identify downloadable documents:
           - Guidelines PDF
         - Application form (PDF/Word)
         - Budget template
         - Terms & conditions
       - Download documents to .outputs/g02-grant-docs/{grant_id}/
     4. Extraction strategy:
     extraction_strategy = LLMExtractionStrategy(
         instruction="""Extract:
         - Full description
         - Eligibility requirements (who can apply)
         - Funding details (amounts, co-contribution, payment terms)
         - Assessment criteria (how applications scored)
         - Key dates (open, close, decision, project start/end)
         - Required documents for application
         - Contact information
         """
     )
     5. Store structured data:
     {
       "grant_id": "GC2026001",
       "scraped_at": "2025-11-12T14:30:22Z",
       "source_url": "https://...",
       "details": {
         "description": "...",
         "eligibility": "...",
         "assessment_criteria": ["criterion 1", "criterion 2"]
       },
       "documents": [
         {"filename": "guidelines.pdf", "url": "...", "type": "guidelines"},
         {"filename": "application_form.pdf", "url": "...", "type": "application"}
       ]
     }
     6. Update index: Append to .outputs/g02-grant-docs/index.json

     g03-gemini-upload: Gemini Integration

     Command: /g03-gemini-upload [--sources g02-grant-docs]

     Steps:
     1. Read index from .outputs/g02-grant-docs/index.json
     2. For each grant:
       - Upload structured JSON to Gemini File API
       - Upload PDF documents
       - Create corpus entry with metadata
     3. Build Gemini Semantic Retriever corpus
     4. Test query: "grants for metal recycling in Victoria"
     5. Log uploads to .outputs/g03-gemini-uploads/upload-manifest_[timestamp].json

     Implementation Timeline

     Week 1: Foundation (G-Series 01-03)

     - Day 6-7: Switch to crawl4ai, create base_crawler.py, ADR-2051
     - Day 8-9: Implement g01-grant-lists for GrantConnect
     - Day 10-11: Implement g02-grant-docs + g03-gemini-upload
     - Day 12: Test g01→g02→g03 pipeline

     Week 2: Expand Sources (G-Series 04-05, C-Series)

     - Day 13-15: Add VIC, NSW, QLD crawlers
     - Day 16-17: g04-grant-sync, g05-grant-validate
     - Day 18-19: c01-c05 company profiling commands

     Week 3: Matching (M-Series)

     - Day 20-22: m01-m05 matching commands
     - Day 23-24: Test EMEW matching with all grants
     - Day 25-26: Optimize matching, tune relevance scoring

     Week 4: Design A/P/S Series (No Implementation)

     - Day 27-28: Research application form structures
     - Day 29: Design a01-a05 command specifications
     - Day 30: Design p01-p05 and s01-s05 specifications
     - Deliverable: Slash command specs for Phase 2

     Dependencies & Prerequisites

     New Dependencies to Add

     [project.dependencies]
     crawl4ai = ">=0.2.0"          # AI-powered web scraping
     aiohttp = ">=3.9.0"           # Async HTTP for crawl4ai
     playwright = ">=1.40.0"       # Fallback for complex sites
     python-dateutil = ">=2.8.0"   # Australian date parsing

     Environment Variables (.env)

     # Existing
     GOOGLE_API_KEY=...

     # New for crawl4ai
     OPENAI_API_KEY=...            # For LLM extraction (or use Gemini)
     CRAWL4AI_MODEL=gemini-1.5     # Use Gemini instead of OpenAI
     PLAYWRIGHT_HEADLESS=true

     MCP Servers (for fallback)

     - playwright MCP: For complex JavaScript sites if crawl4ai fails

     Migration from Current Architecture

     Changes Required

     1. Remove: scrapy dependency (keep beautifulsoup4 for HTML parsing)
     2. Add: crawl4ai + async support
     3. Refactor: base_scraper.py → base_crawler.py (async methods)
     4. Update: ADR-2051 to document crawl4ai decision
     5. Keep: Pydantic models, Gemini integration unchanged

     This plan delivers a complete workflow specification while staying pragmatic about Phase 1         
     prototype scope.