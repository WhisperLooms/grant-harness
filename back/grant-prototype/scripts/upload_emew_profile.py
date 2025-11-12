"""
Upload EMEW Structured Profile to Company Corpus

Converts emew-profile.json to Markdown and uploads to Company Corpus.
This adds structured data that complements the PDF presentation.

Usage:
    python -m scripts.upload_emew_profile
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
sys.path.insert(0, str(Path(__file__).parent.parent))

from gemini_store.corpus_manager import CorpusManager


def json_to_markdown(profile: dict) -> str:
    """Convert JSON profile to structured Markdown."""

    md = f"""# {profile['name']}

**ID**: {profile['id']}

## Company Overview
- **Industry**: {profile['industry']}
- **Website**: {profile['website']}
- **State**: {profile['state']}
- **Established**: {profile['established']}
- **Annual Revenue**: ${profile['annual_revenue']:,} AUD
- **Employee Count**: {profile['employee_count']}

## Description
{profile['description']}

## Sectors
- {chr(10).join(f'- {sector}' for sector in profile['sectors'])}

## Certifications
{chr(10).join(f'- {cert}' for cert in profile['certifications'])}

## Looking For (Funding Priorities)
{chr(10).join(f'{i}. {item}' for i, item in enumerate(profile['looking_for'], 1))}

## Recent Projects
{chr(10).join(f'- {item}' for item in profile['recent_projects'])}

## Target Markets
{chr(10).join(f'- {item}' for item in profile['target_markets'])}

## Competitive Advantages
{chr(10).join(f'- {item}' for item in profile['competitive_advantages'])}
"""
    return md


def main():
    """Upload EMEW structured profile."""

    print("=" * 80)
    print("EMEW STRUCTURED PROFILE UPLOAD")
    print("=" * 80)
    print()

    # Load JSON profile (go up to repo root)
    profile_path = Path("../../.docs/context/test-companies/emew-profile.json")
    if not profile_path.exists():
        print(f"[ERROR] Profile not found: {profile_path}")
        sys.exit(1)

    with open(profile_path) as f:
        profile = json.load(f)

    print(f"[OK] Loaded profile: {profile['name']}")
    print(f"     Revenue: ${profile['annual_revenue']:,}")
    print(f"     Employees: {profile['employee_count']}")
    print(f"     Sectors: {', '.join(profile['sectors'])}")
    print()

    # Convert to Markdown
    md_content = json_to_markdown(profile)

    # Save to .inputs/
    output_dir = Path(".inputs/companies/c-emew/profile")
    output_dir.mkdir(parents=True, exist_ok=True)

    output_path = output_dir / "emew-structured-profile.md"
    output_path.write_text(md_content, encoding='utf-8')

    print(f"[OK] Saved Markdown: {output_path}")
    print()

    # Initialize corpus manager
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("[ERROR] GOOGLE_API_KEY not set in .env file")
        sys.exit(1)

    try:
        manager = CorpusManager(api_key=api_key)
        store_name = manager.company_corpus.create_or_get_corpus()
        print(f"[OK] Company Corpus ready: {store_name}")
        print()
    except Exception as e:
        print(f"[ERROR] Failed to initialize Company Corpus: {e}")
        sys.exit(1)

    # Upload structured profile
    print("Uploading structured profile...")

    metadata = {
        'company_name': 'EMEW Corporation',
        'document_type': 'structured-profile',
        'data_source': 'manual-curation',
        'contains': 'revenue,employees,certifications,projects',
        'confidential': 'true'
    }

    try:
        file_name = manager.company_corpus.upload_document(
            file_path=output_path,
            company_id='emew',
            metadata=metadata
        )
        print(f"[OK] Uploaded: {file_name}")
        print()
    except Exception as e:
        print(f"[ERROR] Upload failed: {e}")
        sys.exit(1)

    print("=" * 80)
    print("UPLOAD COMPLETE")
    print("=" * 80)
    print()
    print("The structured profile adds:")
    print(f"  - Annual revenue: ${profile['annual_revenue']:,}")
    print(f"  - Employee count: {profile['employee_count']}")
    print(f"  - {len(profile['looking_for'])} funding priorities")
    print(f"  - {len(profile['recent_projects'])} recent projects")
    print(f"  - {len(profile['certifications'])} certifications")
    print()
    print("Test with:")
    print("  uv run python -m scripts.query_rag --corpus company 'What is EMEW\\'s annual revenue?'")
    print()


if __name__ == "__main__":
    main()
