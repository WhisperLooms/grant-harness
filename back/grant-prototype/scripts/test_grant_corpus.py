"""
Test Grant Corpus - Verify embeddings and semantic search

Quick test script to verify that grants are properly embedded and searchable
in the Gemini File Search corpus.

Usage:
    cd back/grant-prototype
    python -m scripts.test_grant_corpus
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from gemini_store.corpus_manager import CorpusManager


def test_basic_queries():
    """Test basic semantic search queries against Grant Corpus."""

    print("=" * 80)
    print("GRANT CORPUS SEMANTIC SEARCH TEST")
    print("=" * 80)
    print()

    # Initialize corpus manager
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("[ERROR] GOOGLE_API_KEY not set in .env file")
        sys.exit(1)

    try:
        manager = CorpusManager(api_key=api_key)
        # Initialize corpus (will use existing store)
        store_name = manager.grant_corpus.create_or_get_corpus()
        print(f"[OK] Connected to Grant Corpus: {store_name}")
        print()
    except Exception as e:
        print(f"[ERROR] Failed to connect to Grant Corpus: {e}")
        sys.exit(1)

    # Test queries
    test_queries = [
        {
            "query": "grants for metal recovery and recycling companies",
            "description": "Test EMEW relevance - metal recovery"
        },
        {
            "query": "grants for advanced manufacturing with >$1M funding",
            "description": "Test metadata filtering - large funding"
        },
        {
            "query": "grants for battery recycling and critical minerals",
            "description": "Test sector matching - battery/minerals"
        },
        {
            "query": "open grants with rolling applications",
            "description": "Test status filtering - open grants"
        },
        {
            "query": "federal grants for SMEs under $20M revenue",
            "description": "Test eligibility - SME size"
        }
    ]

    for i, test in enumerate(test_queries, 1):
        print(f"[TEST {i}/5] {test['description']}")
        print(f"Query: \"{test['query']}\"")
        print()

        try:
            # Use gemini-2.5-flash which supports File Search
            response = manager.grant_corpus.query(
                query=test['query'],
                model="gemini-2.5-flash"
            )

            if response:
                print(f"[OK] Response received ({len(response)} chars)")
                print()
                print("Response:")
                print("-" * 60)
                # Wrap text at 70 characters for readability
                import textwrap
                wrapped = textwrap.fill(response, width=70)
                print(wrapped)
                print("-" * 60)
                print()
            else:
                print("[WARNING] No response received")
                print()

        except Exception as e:
            print(f"[ERROR] Query failed: {e}")
            import traceback
            traceback.print_exc()
            print()

        print("=" * 80)
        print()

    print("=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)
    print()
    print("If you see results above, the Grant Corpus embeddings are working correctly!")
    print("You can now proceed with company profile upload and semantic matching.")


if __name__ == "__main__":
    test_basic_queries()
