"""
Inspect Gemini File Search Corpora

Utility to list and inspect files in Grant and Company corpora.
Helps verify what's been uploaded and check metadata.

Usage:
    # List all files in Grant Corpus
    python -m utils.inspect_gemini_corpus --corpus grant

    # List all files in Company Corpus
    python -m utils.inspect_gemini_corpus --corpus company

    # Show detailed metadata
    python -m utils.inspect_gemini_corpus --corpus grant --detailed

    # Filter by metadata
    python -m utils.inspect_gemini_corpus --corpus grant --filter "jurisdiction=federal"
"""

import os
import sys
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import datetime
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

sys.path.insert(0, str(Path(__file__).parent.parent))

from google import genai
from gemini_store.corpus_manager import CorpusManager


def list_corpus_files(
    corpus_type: str,
    detailed: bool = False,
    filter_metadata: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    List all files in a Gemini corpus.

    Args:
        corpus_type: "grant" or "company"
        detailed: Show full metadata for each file
        filter_metadata: Filter by metadata (e.g., "jurisdiction=federal")

    Returns:
        List of file information dicts
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable not set")

    manager = CorpusManager(api_key=api_key)
    client = manager.client

    # Get corpus
    if corpus_type == "grant":
        corpus = manager.grant_corpus
        corpus_name = corpus.create_or_get_corpus()
    elif corpus_type == "company":
        corpus = manager.company_corpus
        corpus_name = corpus.create_or_get_corpus()
    else:
        raise ValueError(f"Invalid corpus type: {corpus_type}. Must be 'grant' or 'company'")

    print(f"\n{'='*80}")
    print(f"GEMINI FILE SEARCH CORPUS INSPECTION")
    print(f"{'='*80}")
    print(f"Corpus: {corpus_type.upper()} Corpus")
    print(f"Store: {corpus_name}")
    print(f"{'='*80}\n")

    # List files in store
    files = []
    try:
        for file in client.file_search_stores.list_files(file_search_store_name=corpus_name):
            file_info = {
                "name": file.name,
                "display_name": file.display_name,
                "size_bytes": file.size_bytes if hasattr(file, 'size_bytes') else "Unknown",
                "create_time": file.create_time if hasattr(file, 'create_time') else None,
                "update_time": file.update_time if hasattr(file, 'update_time') else None,
                "metadata": {}
            }

            # Extract custom metadata
            if hasattr(file, 'custom_metadata') and file.custom_metadata:
                for meta in file.custom_metadata:
                    key = meta.key if hasattr(meta, 'key') else None
                    if hasattr(meta, 'string_value'):
                        file_info["metadata"][key] = meta.string_value
                    elif hasattr(meta, 'numeric_value'):
                        file_info["metadata"][key] = meta.numeric_value

            # Apply filter if specified
            if filter_metadata:
                filter_key, filter_value = filter_metadata.split('=')
                if file_info["metadata"].get(filter_key) != filter_value:
                    continue

            files.append(file_info)

    except Exception as e:
        print(f"Error listing files: {e}")
        return []

    # Display results
    if not files:
        print("⚠️  No files found in corpus")
        if filter_metadata:
            print(f"   (with filter: {filter_metadata})")
        return []

    print(f"Found {len(files)} file(s) in corpus")
    if filter_metadata:
        print(f"(filtered by: {filter_metadata})")
    print()

    for i, file in enumerate(files, 1):
        print(f"{i}. {file['display_name']}")
        print(f"   File ID: {file['name']}")
        print(f"   Size: {format_bytes(file['size_bytes'])}")

        if file['create_time']:
            print(f"   Uploaded: {file['create_time']}")

        if detailed and file['metadata']:
            print(f"   Metadata:")
            for key, value in file['metadata'].items():
                print(f"      - {key}: {value}")

        print()

    return files


def format_bytes(size):
    """Format bytes to human-readable string."""
    if size == "Unknown":
        return size

    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0
    return f"{size:.1f} TB"


def export_corpus_inventory(
    corpus_type: str,
    output_file: str
):
    """
    Export corpus inventory to JSON file.

    Args:
        corpus_type: "grant" or "company"
        output_file: Output JSON file path
    """
    files = list_corpus_files(corpus_type, detailed=True)

    inventory = {
        "corpus_type": corpus_type,
        "export_date": datetime.now().isoformat(),
        "file_count": len(files),
        "files": files
    }

    with open(output_file, 'w') as f:
        json.dump(inventory, f, indent=2, default=str)

    print(f"✓ Inventory exported to: {output_file}")


def compare_corpus_with_inputs(corpus_type: str):
    """
    Compare what's in Gemini corpus vs what's in .inputs/ folder.

    Helps identify files that haven't been uploaded yet.

    Args:
        corpus_type: "grant" or "company"
    """
    # Get corpus files
    corpus_files = list_corpus_files(corpus_type, detailed=False)
    corpus_filenames = {f["display_name"] for f in corpus_files}

    # Get local files
    if corpus_type == "grant":
        inputs_dir = Path(".inputs/grants")
        local_files = list(inputs_dir.rglob("*.pdf"))
    elif corpus_type == "company":
        inputs_dir = Path(".inputs/companies")
        local_files = list(inputs_dir.rglob("*.pdf"))
    else:
        return

    local_filenames = {f.name for f in local_files}

    # Compare
    print(f"\n{'='*80}")
    print(f"CORPUS VS LOCAL COMPARISON")
    print(f"{'='*80}\n")

    print(f"Corpus files: {len(corpus_filenames)}")
    print(f"Local files: {len(local_filenames)}")
    print()

    # Files in corpus but not local
    in_corpus_not_local = corpus_filenames - local_filenames
    if in_corpus_not_local:
        print(f"⚠️  Files in corpus but not in .inputs/ ({len(in_corpus_not_local)}):")
        for filename in sorted(in_corpus_not_local):
            print(f"   - {filename}")
        print()

    # Files in local but not corpus
    in_local_not_corpus = local_filenames - corpus_filenames
    if in_local_not_corpus:
        print(f"📤 Files in .inputs/ but not uploaded to corpus ({len(in_local_not_corpus)}):")
        for filename in sorted(in_local_not_corpus):
            # Find full path
            full_path = next(f for f in local_files if f.name == filename)
            print(f"   - {filename}")
            print(f"     {full_path.relative_to(inputs_dir)}")
        print()

    # Matching files
    matching = corpus_filenames & local_filenames
    if matching:
        print(f"✓ Files in both corpus and .inputs/ ({len(matching)}):")
        for filename in sorted(list(matching)[:5]):  # Show first 5
            print(f"   - {filename}")
        if len(matching) > 5:
            print(f"   ... and {len(matching) - 5} more")


def get_corpus_stats(corpus_type: str):
    """
    Get statistics about corpus contents.

    Args:
        corpus_type: "grant" or "company"
    """
    files = list_corpus_files(corpus_type, detailed=True)

    if not files:
        return

    print(f"\n{'='*80}")
    print(f"CORPUS STATISTICS")
    print(f"{'='*80}\n")

    # Total size
    total_size = sum(f["size_bytes"] for f in files if f["size_bytes"] != "Unknown")
    print(f"Total files: {len(files)}")
    print(f"Total size: {format_bytes(total_size)}")
    print()

    # Group by metadata
    if corpus_type == "grant":
        # Group by jurisdiction
        by_jurisdiction = {}
        for f in files:
            jurisdiction = f["metadata"].get("jurisdiction", "unknown")
            by_jurisdiction[jurisdiction] = by_jurisdiction.get(jurisdiction, 0) + 1

        print("By Jurisdiction:")
        for jurisdiction, count in sorted(by_jurisdiction.items()):
            print(f"   {jurisdiction}: {count} files")
        print()

        # Group by document type
        by_type = {}
        for f in files:
            doc_type = f["metadata"].get("document_type", "unknown")
            by_type[doc_type] = by_type.get(doc_type, 0) + 1

        print("By Document Type:")
        for doc_type, count in sorted(by_type.items()):
            print(f"   {doc_type}: {count} files")

    elif corpus_type == "company":
        # Group by company_id
        by_company = {}
        for f in files:
            company_id = f["metadata"].get("company_id", "unknown")
            by_company[company_id] = by_company.get(company_id, 0) + 1

        print("By Company:")
        for company_id, count in sorted(by_company.items()):
            print(f"   {company_id}: {count} files")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Inspect Gemini File Search Corpus")
    parser.add_argument(
        '--corpus',
        required=True,
        choices=['grant', 'company'],
        help='Which corpus to inspect'
    )
    parser.add_argument(
        '--detailed',
        action='store_true',
        help='Show detailed metadata for each file'
    )
    parser.add_argument(
        '--filter',
        help='Filter by metadata (e.g., "jurisdiction=federal")'
    )
    parser.add_argument(
        '--export',
        help='Export inventory to JSON file'
    )
    parser.add_argument(
        '--compare',
        action='store_true',
        help='Compare corpus with local .inputs/ folder'
    )
    parser.add_argument(
        '--stats',
        action='store_true',
        help='Show corpus statistics'
    )

    args = parser.parse_args()

    try:
        if args.export:
            export_corpus_inventory(args.corpus, args.export)
        elif args.compare:
            compare_corpus_with_inputs(args.corpus)
        elif args.stats:
            get_corpus_stats(args.corpus)
        else:
            list_corpus_files(args.corpus, args.detailed, args.filter)

    except ValueError as e:
        print(f"ERROR: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
