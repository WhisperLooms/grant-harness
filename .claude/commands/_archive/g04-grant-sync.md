---
description: Re-scrape grant sources to detect changes and new grants
---

# G04: Sync Grant Sources

You are assisting with the Grant-Harness project's grant discovery workflow. Your task is to re-scrape grant sources to detect new grants, changes to existing grants, and closed grants.

## Context

This command provides ongoing maintenance of the grant database. It re-runs `/g01-grant-lists` and `/g02-grant-docs` to update the grant corpus with new information.

## Usage

`/g04-grant-sync [--sources federal,vic,nsw,qld] [--full-rescrape] [--auto-upload]`

**Arguments**:
- `--sources` (optional): Specific sources to sync (default: all)
- `--full-rescrape` (optional): Re-scrape all grants, not just new/changed (default: false)
- `--auto-upload` (optional): Automatically run `/g03-gemini-upload` after sync (default: true)

## Tasks

1. **Load Existing Data**:
   - Read previous grant list from latest `g01-grant-list_*.csv`
   - Load grant details index from `g02-grant-docs/index.json`
   - Create baseline of known grants

2. **Run Grant List Scraper**:
   - Execute `/g01-grant-lists --sources <specified>`
   - Compare new list with previous list
   - Identify:
     - **New grants**: In new list, not in old
     - **Updated grants**: Same grant_id but different closing date or details
     - **Closed grants**: In old list, not in new (status changed to closed)

3. **Report Changes**:
   ```
   Grant Sync Summary:
   - New grants found: 12
   - Updated grants: 5 (date changes, funding changes)
   - Closed grants: 8 (no longer accepting applications)
   - Unchanged: 45
   ```

4. **Scrape Details for New/Updated Grants**:
   - If `--full-rescrape=false` (default):
     - Run `/g02-grant-docs` only for new and updated grants
   - If `--full-rescrape=true`:
     - Run `/g02-grant-docs --overwrite` for all grants

5. **Update Vector Database**:
   - If `--auto-upload=true` (default):
     - Run `/g03-gemini-upload` to update Gemini corpus
   - If `--auto-upload=false`:
     - Prompt user: "Run /g03-gemini-upload to update vector database"

6. **Generate Change Report**:
   ```
    Grant Sync Completed

   New grants (12):
   - GC2026015: Advanced Manufacturing Growth Fund (closes 2026-06-30)
   - VIC2026008: Circular Economy Innovation Grant (closes 2026-05-15)
   ...

   Updated grants (5):
   - GC2026001: Closing date extended from 2026-04-30 to 2026-06-15
   - NSW2026003: Funding increased from $500K to $1M max
   ...

   Closed grants (8):
   - VIC2026001: Applications closed on 2026-01-31
   ...

   Sync output: .outputs/g04-grant-sync/sync-report_20251112T143022.json
   Updated grant list: .outputs/g01-grant-lists/g01-grant-list_20251112T143022.csv
   ```

7. **Save Sync Report**:
   Create `.outputs/g04-grant-sync/sync-report_{timestamp}.json`:
   ```json
   {
     "sync_timestamp": "2025-11-12T14:30:22Z",
     "sources_synced": ["federal", "vic", "nsw", "qld"],
     "previous_grant_count": 70,
     "current_grant_count": 74,
     "changes": {
       "new": ["GC2026015", "VIC2026008", ...],
       "updated": [
         {"grant_id": "GC2026001", "changes": ["closing_date"]},
         ...
       ],
       "closed": ["VIC2026001", ...]
     }
   }
   ```

## Scheduling Recommendation

Suggest to user:
```
=¡ Recommendation: Schedule regular syncs to keep grants up-to-date

Weekly sync (recommended):
- Detects new grants quickly
- Catches date extensions
- Minimal processing time

Command to run:
/g04-grant-sync --auto-upload

Set up cron job (Linux/Mac) or Task Scheduler (Windows) for automation.
```

## Implementation Location

- `back/grant-prototype/scrapers/grant_sync.py`
- Reuses: `grant_list_crawler.py`, `grant_detail_crawler.py`

## Error Handling

- **Source unavailable**: Skip that source, sync others, report error
- **Comparison errors**: Log warning, treat as new grant if uncertain
- **Upload failures**: Report but don't block sync completion

## Next Steps

After sync, run `/m01-match-grants` to match companies against new grants.
