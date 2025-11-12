---
description: Export match results to various formats for stakeholders
---

# M05: Export Match Results

Export grant matching results to CSV, PDF, or presentation format for stakeholders.

## Usage

`/m05-match-export <company-id> [--format csv|pdf|pptx] [--include all|top-10|priority-only] [--output-file custom-name]`

## Export Formats

### CSV (Spreadsheet)
Columns: Grant ID, Title, Agency, Relevance Score, Funding Range, Closing Date, Status, Key Criteria Met, Next Actions

**Use case**: Detailed analysis in Excel, sharing with advisors

### PDF (Report)
Professional report with:
- Executive summary
- Top 10 matches with details
- Eligibility analysis
- Timeline recommendations
- Action plan

**Use case**: Board presentation, investor updates, consultant review

### PPTX (Presentation)
PowerPoint slides with:
- Slide 1: Executive summary
- Slide 2-11: One grant per slide (top 10)
- Slide 12: Timeline and action plan

**Use case**: Internal meetings, stakeholder presentations

## Output Examples

**CSV**: `emew_20251112_grant_matches.csv`

**PDF**:
```
Grant Matching Report
EMEW Corporation
Generated: 2025-11-12

Executive Summary:
- Total grants analyzed: 89
- Relevant matches found: 23
- High-priority matches: 10
- Total potential funding: $45M
- Recommended focus: Top 5 grants ($18M potential)

[Detailed match information follows...]
```

**PPTX**:
```
Slide 1: Grant Opportunities for EMEW Corporation
- 23 relevant grants identified
- $45M total potential funding
- 5 high-priority applications recommended

Slide 2: #1 - Recycling Modernisation Fund
- Relevance: 0.92 (Excellent)
- Funding: $500K - $10M
- Deadline: April 30, 2026
- Key Match: R&D focus, export ready, circular economy
```

## Tasks

1. Load match results from `/m01-match-grants`
2. Filter by `--include` parameter
3. Generate export in specified format
4. Save to `.outputs/m05-match-export/`

## Implementation

- `back/grant-prototype/exporters/match_exporter.py`
- Libraries: `pandas` (CSV), `reportlab` (PDF), `python-pptx` (PPTX)

## Next Steps

Share exported results with stakeholders for application prioritization.
