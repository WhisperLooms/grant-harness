---
description: Scrape full grant details and download documents
---

# G02: Scrape Full Grant Details and Documents

You are assisting with the Grant-Harness project's grant discovery workflow. Your task is to scrape complete details and download all documents for specified grants.

## Context

This is the **second step** in the grant workflow (g→c→m→a→p→s). This command takes the grant list from `/g01-grant-lists` and performs deep scraping to extract comprehensive information and download application materials.

## Usage

`/g02-grant-docs <csv-path> [--grant-ids ID1,ID2] [--overwrite] [--download-docs]`

**Arguments**:
- `<csv-path>` (required): Path to CSV from `/g01-grant-lists`
- `--grant-ids` (optional): Specific grant IDs to scrape
- `--overwrite` (optional): Re-scrape even if exists (default: false)
- `--download-docs` (optional): Download PDFs/Word docs (default: true)

## Tasks

1. **Load Grant List**:
   - Read CSV file from provided path
   - Parse into Grant objects (Pydantic model)
   - Filter to specific grant IDs if specified
   - Report: "Found {N} grants to scrape"

2. **Check Existing Data**:
   - Load index from `back/grant-prototype/.outputs/g02-grant-docs/index.json`
   - Skip already scraped grants unless `--overwrite=true`

3. **Initialize crawl4ai Crawler**:
   - Set up AsyncWebCrawler with LLM extraction strategy
   - Configure to extract: description, eligibility, criteria, funding, dates, documents

4. **Scrape Each Grant**:
   - Navigate to grant URL
   - Extract comprehensive details using LLM
   - Download documents (guidelines, forms, templates)
   - Save structured JSON per grant
   - Update index.json

5. **Document Downloads**:
   - Create directory per grant: `.outputs/g02-grant-docs/{grant_id}/`
   - Download: guidelines PDF, application form, budget template
   - Calculate checksums for integrity
   - Limit: 50 MB per file, 500 MB total

6. **Error Handling**:
   - Network errors: Retry 3 times with exponential backoff
   - Missing documents: Log warning, continue
   - Partial data: Save what's available, mark as "partial"
   - Rate limiting: Respect `SCRAPER_DOWNLOAD_DELAY`

7. **Generate Summary**:
   ```
   ✓ Grant Details Scraped Successfully

   Grants processed: 15
   Successful: 13
   Failed: 2
   Documents downloaded: 42 files (45.3 MB)

   Output: back/grant-prototype/.outputs/g02-grant-docs/
   ```

## Expected Output

Directory structure:
```
back/grant-prototype/.outputs/g02-grant-docs/
├── index.json
├── GC2026001/
│   ├── GC2026001_details.json
│   ├── GC2026001_guidelines.pdf
│   └── GC2026001_application.pdf
└── ... (more grant folders)
```

## Implementation Location

- `back/grant-prototype/scrapers/grant_detail_crawler.py`
- `back/grant-prototype/scrapers/utils/document_downloader.py`
- `back/grant-prototype/models/entities.py` (extend Grant model)

## Next Steps

After successful scraping, run `/g03-gemini-upload` to upload to vector database.
