"""
Interactive RAG Query Tool

Simple command-line interface to query Grant Corpus and Company Corpus.

Usage:
    # Interactive mode (recommended)
    python -m scripts.query_rag

    # One-shot query
    python -m scripts.query_rag "What grants are available for battery recycling?"

    # Query specific corpus
    python -m scripts.query_rag --corpus grant "Show me ARENA grants"
    python -m scripts.query_rag --corpus company "What does EMEW do?"

    # With metadata filter
    python -m scripts.query_rag --filter "grant_id=igp-commercialisation-growth" "Tell me about IGP"
    python -m scripts.query_rag --filter "company_id=emew" "What is EMEW's revenue?"
"""

import os
import sys
import argparse
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from gemini_store.corpus_manager import CorpusManager


def print_response(response: str, grounding_sources: list = None):
    """Print formatted response."""
    print()
    print("=" * 80)
    print("RESPONSE")
    print("=" * 80)
    print()
    print(response)
    print()

    if grounding_sources:
        print("-" * 80)
        print(f"Sources: {', '.join(grounding_sources)}")
        print()


def query_corpus(manager: CorpusManager, corpus: str, query: str, metadata_filter: str = None):
    """Query specified corpus."""

    if corpus == "grant":
        print(f"\n[QUERY] Grant Corpus: \"{query}\"")
        if metadata_filter:
            print(f"[FILTER] {metadata_filter}")

        response = manager.grant_corpus.query(
            query=query,
            metadata_filter=metadata_filter,
            model="gemini-2.5-flash"
        )
        print_response(response)

    elif corpus == "company":
        print(f"\n[QUERY] Company Corpus: \"{query}\"")
        if metadata_filter:
            print(f"[FILTER] {metadata_filter}")

        response = manager.company_corpus.query(
            query=query,
            metadata_filter=metadata_filter,
            model="gemini-2.5-flash"
        )
        print_response(response)

    elif corpus == "both":
        print(f"\n[QUERY] Both Corpora: \"{query}\"")

        # Query Grant Corpus
        print("\n--- GRANT CORPUS ---")
        grant_response = manager.grant_corpus.query(
            query=query,
            metadata_filter=metadata_filter,
            model="gemini-2.5-flash"
        )
        print_response(grant_response)

        # Query Company Corpus
        print("\n--- COMPANY CORPUS ---")
        company_response = manager.company_corpus.query(
            query=query,
            metadata_filter=metadata_filter,
            model="gemini-2.5-flash"
        )
        print_response(company_response)


def detect_corpus_from_query(query: str) -> str:
    """
    Intelligently detect which corpus to query based on keywords.

    Args:
        query: User's natural language question

    Returns:
        'company', 'grant', or 'both'
    """
    query_lower = query.lower()

    # Company-specific keywords
    company_keywords = [
        'company', 'emew', 'business', 'revenue', 'employee', 'staff',
        'certification', 'project', 'capability', 'technology', 'who is',
        'what does', 'profile', 'industry', 'sector', 'competitive advantage'
    ]

    # Grant-specific keywords
    grant_keywords = [
        'grant', 'funding', 'eligibility', 'deadline', 'application', 'apply',
        'arena', 'igp', 'csiro', 'bbi', 'program', 'open', 'closed', 'closes'
    ]

    # Count matches
    company_matches = sum(1 for kw in company_keywords if kw in query_lower)
    grant_matches = sum(1 for kw in grant_keywords if kw in query_lower)

    # Decision logic
    if company_matches > grant_matches and company_matches > 0:
        return 'company'
    elif grant_matches > company_matches and grant_matches > 0:
        return 'grant'
    else:
        # Ambiguous - query both
        return 'both'


def interactive_mode(manager: CorpusManager):
    """Run in interactive Q&A mode."""

    print()
    print("=" * 80)
    print("INTERACTIVE RAG QUERY TOOL")
    print("=" * 80)
    print()
    print("Ask questions about grants and companies. Type 'help' for commands.")
    print()

    corpus = "both"  # Default to both corpora (intelligent routing)
    metadata_filter = None

    while True:
        try:
            # Prompt
            filter_info = f" [{metadata_filter}]" if metadata_filter else ""
            user_input = input(f"\n[{corpus.upper()}{filter_info}] > ").strip()

            if not user_input:
                continue

            # Commands
            if user_input.lower() in ["exit", "quit", "q"]:
                print("\nGoodbye!")
                break

            elif user_input.lower() == "help":
                print()
                print("Commands:")
                print("  help                     - Show this help")
                print("  corpus grant|company|both - Switch corpus")
                print("  filter <key>=<value>     - Set metadata filter")
                print("  clear                    - Clear metadata filter")
                print("  exit                     - Exit interactive mode")
                print()
                print("Examples:")
                print("  > What grants are available for battery recycling?")
                print("  > corpus company")
                print("  > What does EMEW do?")
                print("  > filter company_id=emew")
                print("  > What is EMEW's revenue?")

            elif user_input.lower().startswith("corpus "):
                new_corpus = user_input.split(" ", 1)[1].strip().lower()
                if new_corpus in ["grant", "company", "both"]:
                    corpus = new_corpus
                    print(f"[OK] Switched to {corpus} corpus")
                else:
                    print("[ERROR] Valid options: grant, company, both")

            elif user_input.lower().startswith("filter "):
                metadata_filter = user_input.split(" ", 1)[1].strip()
                print(f"[OK] Filter set: {metadata_filter}")

            elif user_input.lower() == "clear":
                metadata_filter = None
                print("[OK] Filter cleared")

            else:
                # Query with intelligent routing if corpus is 'both'
                query_corpus_choice = corpus
                if corpus == "both":
                    query_corpus_choice = detect_corpus_from_query(user_input)
                    print(f"[AUTO-DETECT] Routing to: {query_corpus_choice.upper()} corpus")

                query_corpus(manager, query_corpus_choice, user_input, metadata_filter)

        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            break
        except Exception as e:
            print(f"\n[ERROR] {e}")
            import traceback
            traceback.print_exc()


def main():
    """Main entry point."""

    parser = argparse.ArgumentParser(
        description="Query Grant and Company corpora using Gemini File Search",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Interactive mode
  python -m scripts.query_rag

  # One-shot query
  python -m scripts.query_rag "What grants are available for metal recycling?"

  # Query specific corpus
  python -m scripts.query_rag --corpus company "What does EMEW do?"

  # With metadata filter
  python -m scripts.query_rag --filter "company_id=emew" "What is EMEW's annual revenue?"
        """
    )

    parser.add_argument(
        "query",
        nargs="?",
        help="Query to run (if not provided, enters interactive mode)"
    )

    parser.add_argument(
        "--corpus", "-c",
        choices=["grant", "company", "both", "auto"],
        default="auto",
        help="Which corpus to query (default: auto - intelligent routing)"
    )

    parser.add_argument(
        "--filter", "-f",
        help="Metadata filter (e.g., 'grant_id=igp-commercialisation-growth')"
    )

    args = parser.parse_args()

    # Initialize
    print("Initializing RAG system...")
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("[ERROR] GOOGLE_API_KEY not set in .env file")
        sys.exit(1)

    try:
        manager = CorpusManager(api_key=api_key)

        # Ensure corpora exist
        grant_store = manager.grant_corpus.create_or_get_corpus()
        company_store = manager.company_corpus.create_or_get_corpus()

        print(f"[OK] Grant Corpus: {grant_store}")
        print(f"[OK] Company Corpus: {company_store}")

    except Exception as e:
        print(f"[ERROR] Failed to initialize: {e}")
        sys.exit(1)

    # Run query or enter interactive mode
    if args.query:
        # One-shot query with intelligent routing
        corpus = args.corpus
        if corpus == "auto":
            corpus = detect_corpus_from_query(args.query)
            print(f"[AUTO-DETECT] Routing to: {corpus.upper()} corpus")

        query_corpus(manager, corpus, args.query, args.filter)
    else:
        # Interactive mode
        interactive_mode(manager)


if __name__ == "__main__":
    main()
