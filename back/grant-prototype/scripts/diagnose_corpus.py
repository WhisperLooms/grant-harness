"""
Diagnose Corpus Configuration

Check File Search Store configuration and test different query approaches
to identify performance issues.

Usage:
    python -m scripts.diagnose_corpus
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
sys.path.insert(0, str(Path(__file__).parent.parent))

from gemini_store.corpus_manager import CorpusManager


def inspect_store_config(client: genai.Client, store_name: str):
    """Inspect File Search Store configuration."""
    print(f"\n{'='*80}")
    print(f"INSPECTING STORE: {store_name}")
    print(f"{'='*80}\n")

    try:
        # Get store details
        store = client.file_search_stores.get(name=store_name)

        print(f"Display Name: {store.display_name}")
        print(f"Store Name: {store.name}")
        print(f"Create Time: {store.create_time}")
        print(f"Update Time: {store.update_time}")

        # Check vectorSearchStore config (if available)
        if hasattr(store, 'vector_search_store'):
            print(f"\nVector Search Config:")
            print(f"  {store.vector_search_store}")

        # List files in store
        print(f"\nFiles in store:")
        files = client.file_search_stores.list_files(file_search_store_name=store_name)

        for i, file in enumerate(files, 1):
            print(f"\n  [{i}] {file.display_name}")
            print(f"      URI: {file.uri}")
            print(f"      State: {file.state}")
            print(f"      Create Time: {file.create_time}")

            # Show custom metadata if available
            if hasattr(file, 'metadata') and file.metadata:
                print(f"      Metadata:")
                for key, value in file.metadata.items():
                    print(f"        {key}: {value}")

    except Exception as e:
        print(f"[ERROR] Failed to inspect store: {e}")
        import traceback
        traceback.print_exc()


def test_query_variations(manager: CorpusManager):
    """Test different query approaches."""

    print(f"\n{'='*80}")
    print("TESTING QUERY VARIATIONS")
    print(f"{'='*80}\n")

    test_cases = [
        {
            "name": "Basic query (no filters)",
            "query": "What grants are available for battery recycling?",
            "filter": None
        },
        {
            "name": "Filter by status=open",
            "query": "What grants are available for battery recycling?",
            "filter": "status=open"
        },
        {
            "name": "Filter by jurisdiction=federal",
            "query": "What grants support advanced manufacturing?",
            "filter": "jurisdiction=federal"
        },
        {
            "name": "Specific grant by ID",
            "query": "What is the maximum funding?",
            "filter": "grant_id=igp-commercialisation-growth"
        },
        {
            "name": "High funding only",
            "query": "What grants offer over $1 million?",
            "filter": "funding_min>=1000000"
        }
    ]

    for i, test in enumerate(test_cases, 1):
        print(f"\n{'-'*80}")
        print(f"TEST {i}: {test['name']}")
        print(f"{'-'*80}")
        print(f"Query: {test['query']}")
        print(f"Filter: {test['filter']}")
        print()

        try:
            response = manager.grant_corpus.query(
                query=test['query'],
                metadata_filter=test['filter'],
                model="gemini-2.5-flash"
            )

            # Truncate response for readability
            response_preview = response[:300] + "..." if len(response) > 300 else response
            print(f"Response: {response_preview}")
            print()

        except Exception as e:
            print(f"[ERROR] Query failed: {e}\n")


def test_company_profile_upload(manager: CorpusManager):
    """Test uploading structured company profile."""

    print(f"\n{'='*80}")
    print("COMPANY PROFILE UPLOAD TEST")
    print(f"{'='*80}\n")

    # Check if JSON profile exists
    profile_path = Path(".docs/context/test-companies/emew-profile.json")
    if not profile_path.exists():
        print(f"[SKIP] Profile not found: {profile_path}")
        return

    print(f"Found structured profile: {profile_path.name}")
    print("This JSON profile contains structured data not in the PDF.")
    print("Recommendation: Convert to Markdown and upload to Company Corpus")
    print()

    # Show what's in the profile
    import json
    with open(profile_path) as f:
        profile = json.load(f)

    print("Profile contains:")
    print(f"  - Company Name: {profile.get('name')}")
    print(f"  - Annual Revenue: ${profile.get('annual_revenue'):,}")
    print(f"  - Employee Count: {profile.get('employee_count')}")
    print(f"  - Sectors: {', '.join(profile.get('sectors', []))}")
    print(f"  - Looking For: {len(profile.get('looking_for', []))} funding types")
    print(f"  - Recent Projects: {len(profile.get('recent_projects', []))} projects")
    print()


def main():
    """Main diagnostic routine."""

    print("\n" + "="*80)
    print("CORPUS DIAGNOSTICS")
    print("="*80)

    # Initialize
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("[ERROR] GOOGLE_API_KEY not set")
        sys.exit(1)

    try:
        client = genai.Client(api_key=api_key)
        manager = CorpusManager(api_key=api_key)

        grant_store = manager.grant_corpus.create_or_get_corpus()
        company_store = manager.company_corpus.create_or_get_corpus()

        print(f"\n[OK] Grant Corpus: {grant_store}")
        print(f"[OK] Company Corpus: {company_store}")

        # Run diagnostics
        inspect_store_config(client, grant_store)
        inspect_store_config(client, company_store)

        test_query_variations(manager)

        test_company_profile_upload(manager)

        # Print recommendations
        print(f"\n{'='*80}")
        print("RECOMMENDATIONS")
        print(f"{'='*80}\n")

        print("1. ALWAYS use metadata filters for status=open to exclude closed grants")
        print("2. Upload emew-profile.json as Markdown to Company Corpus")
        print("3. Use jurisdiction filters (federal/state-vic/state-nsw) to narrow results")
        print("4. Consider gemini-2.5-pro for complex matching (better reasoning)")
        print("5. Add date range validation in application layer")
        print()

    except Exception as e:
        print(f"[ERROR] Diagnostic failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
