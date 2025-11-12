#!/usr/bin/env python3
"""Parse grant sources to extract website URLs for downloading grant materials.

Sources:
- Australian-Grants-for-EMEW.md
- Claude_EMEW_Grant_Opportunities_Friday_Summary_Oct2025.pdf
- Gemini_Australian Grants for EMEW.pdf
- GPT_Executive Summary.pdf

Output: grants_to_download.json with structured list of grants and URLs
"""

import json
import re
from pathlib import Path
from typing import List, Dict

def parse_markdown_file() -> List[Dict]:
    """Extract grants from markdown file."""
    md_file = Path("../../.docs/context/emew-context/grant-search/Australian-Grants-for-EMEW.md")

    if not md_file.exists():
        print(f"[WARN] Markdown file not found: {md_file}")
        return []

    content = md_file.read_text(encoding='utf-8')

    # Extract URLs with pattern: https://business.gov.au/grants-and-programs/*
    # or https://arena.gov.au/funding/*
    # or other grant URLs
    url_pattern = r'https?://[^\s\)\]]+(?:grants|funding|programs)[^\s\)\]]*'
    urls = re.findall(url_pattern, content)

    # Deduplicate
    unique_urls = list(set(urls))

    print(f"[OK] Found {len(unique_urls)} unique URLs in markdown file")

    grants = []

    # Map known grants from markdown
    known_grants = [
        {
            "name": "Industry Growth Program",
            "short_name": "IGP",
            "jurisdiction": "federal",
            "agency": "Department of Industry, Science & Resources",
            "funding_range": [100000, 5000000],
            "url": "https://business.gov.au/grants-and-programs/industry-growth-program",
            "priority": "HIGH",
            "reason": "Most flexible, matches all EMEW capabilities"
        },
        {
            "name": "Battery Breakthrough Initiative",
            "short_name": "BBI",
            "jurisdiction": "federal",
            "agency": "ARENA",
            "funding_range": [2000000, 200000000],
            "url": "https://arena.gov.au/funding/battery-breakthrough-initiative/",
            "priority": "HIGH",
            "reason": "Perfect for battery recycling focus"
        },
        {
            "name": "Advancing Renewables Program",
            "short_name": "ARP",
            "jurisdiction": "federal",
            "agency": "ARENA",
            "funding_range": [100000, 50000000],
            "url": "https://arena.gov.au/funding/advancing-renewables-program/",
            "priority": "HIGH",
            "reason": "Low-emission metals production"
        },
        {
            "name": "Cooperative Research Centres Projects",
            "short_name": "CRC-P",
            "jurisdiction": "federal",
            "agency": "Department of Industry, Science & Resources",
            "funding_range": [100000, 3000000],
            "url": "https://business.gov.au/grants-and-programs/cooperative-research-centres-projects-crcp-grants",
            "priority": "MEDIUM",
            "reason": "AI enablement focus, requires research partner"
        },
        {
            "name": "Breakthrough Victoria Fund",
            "short_name": "BTV",
            "jurisdiction": "state-vic",
            "agency": "Breakthrough Victoria",
            "funding_range": [1000000, 25000000],
            "url": "https://www.breakthroughvictoria.com/",
            "priority": "HIGH",
            "reason": "Equity investment, Victorian HQ alignment"
        }
    ]

    # Add additional URLs found in markdown
    for url in unique_urls:
        # Skip if already in known grants
        if any(url in grant["url"] for grant in known_grants):
            continue

        # Try to extract grant name from URL
        name_match = re.search(r'/([a-z-]+)(?:/|\?|$)', url)
        name = name_match.group(1).replace('-', ' ').title() if name_match else "Unknown Grant"

        grants.append({
            "name": name,
            "short_name": name[:3].upper(),
            "jurisdiction": "state-vic" if "vic.gov.au" in url else "federal",
            "agency": "Unknown",
            "funding_range": [0, 0],
            "url": url,
            "priority": "LOW",
            "reason": "Found in markdown, needs verification"
        })

    return known_grants + grants


def main():
    print("=== Grant Source Parser ===\n")

    # Parse markdown file (primary source)
    grants = parse_markdown_file()

    # TODO: Parse PDFs (requires PyPDF2 or similar)
    # For now, we focus on the high-priority grants from markdown

    # Filter to top priority grants for Week 1
    high_priority = [g for g in grants if g["priority"] == "HIGH"]

    print(f"\n[OK] Total grants identified: {len(grants)}")
    print(f"[OK] High priority grants: {len(high_priority)}")

    # Save to JSON
    output_file = Path(".inputs/grants-to-download.json")
    output_file.parent.mkdir(parents=True, exist_ok=True)

    output = {
        "total_count": len(grants),
        "high_priority_count": len(high_priority),
        "grants": grants,
        "download_priority": [g["short_name"] for g in high_priority]
    }

    output_file.write_text(json.dumps(output, indent=2))
    print(f"\n[OK] Grant list saved to: {output_file}")

    # Print high-priority grants
    print("\n=== High Priority Grants for Week 1 ===\n")
    for grant in high_priority:
        print(f"- {grant['short_name']}: {grant['name']}")
        print(f"  URL: {grant['url']}")
        print(f"  Funding: ${grant['funding_range'][0]:,} - ${grant['funding_range'][1]:,}")
        print(f"  Reason: {grant['reason']}\n")

    print("[OK] Next step: Download grant guidelines + application forms from these URLs")

if __name__ == "__main__":
    main()
