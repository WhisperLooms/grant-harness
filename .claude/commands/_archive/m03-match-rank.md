---
description: Sort and filter grant matches by various criteria
---

# M03: Rank and Filter Matches

Sort grant matches by relevance, funding, deadline, or custom criteria.

## Usage

`/m03-match-rank <company-id> [--sort-by relevance|funding|deadline|priority] [--filter status=open,sectors=recycling] [--top-n 10]`

## Sort Options

- **relevance**: Highest relevance score first (default)
- **funding**: Highest maximum funding first
- **deadline**: Earliest closing date first
- **priority**: Custom priority score (relevance × funding × time-urgency)

## Filter Options

- `status=open|upcoming|closed`
- `sectors=recycling,manufacturing,...`
- `jurisdiction=federal,vic,nsw,qld`
- `min-funding=100000`
- `max-funding=5000000`
- `min-relevance=0.7`

## Output

```
Grant Matches Ranked for: EMEW Corporation

Sort: priority | Filters: status=open, min-relevance=0.7
Showing: Top 10 of 23 matches

1. <Æ Recycling Modernisation Fund (GC2026001)
   Relevance: 0.92 | Funding: $500K-$10M | Closes: 2026-04-30 (139 days)
   Priority Score: 9.5/10
   Quick Reason: Perfect sector match, R&D focus, export ready

2. >H Circular Economy Business Innovation (VIC2026005)
   Relevance: 0.88 | Funding: $25K-$250K | Closes: 2026-03-15 (93 days)
   Priority Score: 8.7/10
   Quick Reason: VIC location advantage, strong innovation fit

3. >I Advanced Manufacturing Growth (NSW2026012)
   Relevance: 0.85 | Funding: $100K-$2M | Closes: 2026-05-31 (170 days)
   Priority Score: 8.4/10
   Quick Reason: Manufacturing capability match, good timing

... (remaining matches)

Action Items:
- HIGH PRIORITY (3 grants): Apply within 2 weeks
- MEDIUM PRIORITY (5 grants): Monitor, apply if capacity
- LOW PRIORITY (2 grants): Optional, lower relevance

Next: Run /m02-match-explain <grant-id> for detailed analysis
```

## Implementation

- `back/grant-prototype/matching/match_ranker.py`
