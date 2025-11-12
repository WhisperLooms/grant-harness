"""
Batch Upload Grants to Gemini Grant Corpus

Uploads all grant PDFs from .inputs/grants/ to Gemini File Search Grant Corpus
with proper metadata tagging for semantic search.

Usage:
    cd back/grant-prototype
    python -m scripts.upload_grants_batch
"""

import os
import sys
from pathlib import Path
import json
from datetime import datetime
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from google import genai
from gemini_store.corpus_manager import CorpusManager


def infer_document_type(filename: str) -> str:
    """
    Infer document type from filename.

    Args:
        filename: PDF filename

    Returns:
        Document type string
    """
    filename_lower = filename.lower()

    if 'guideline' in filename_lower:
        return 'guidelines'
    elif 'application' in filename_lower or 'form' in filename_lower:
        return 'application-form'
    elif 'faq' in filename_lower or 'frequently' in filename_lower:
        return 'faq'
    elif 'agreement' in filename_lower or 'contract' in filename_lower:
        return 'grant-agreement'
    elif 'sample' in filename_lower or 'example' in filename_lower:
        return 'sample-document'
    elif 'declaration' in filename_lower:
        return 'declaration-form'
    elif 'checklist' in filename_lower:
        return 'checklist'
    elif 'strategy' in filename_lower or 'plan' in filename_lower:
        return 'strategic-document'
    elif 'addendum' in filename_lower or 'supplement' in filename_lower:
        return 'addendum'
    elif 'consultation' in filename_lower or 'summary' in filename_lower:
        return 'consultation-paper'
    elif 'comparison' in filename_lower:
        return 'comparison-guide'
    else:
        return 'general-document'


def get_grant_program_name(grant_id: str) -> str:
    """
    Get full program name from grant ID.

    Args:
        grant_id: Grant folder name (e.g., 'igp', 'bbi')

    Returns:
        Full program name
    """
    program_names = {
        'igp': 'Industry Growth Program',
        'industry-growth-program': 'Industry Growth Program',
        'bbi': 'Battery Breakthrough Initiative',
        'arp': 'ARENA Advancing Renewables Program',
        'csiro-kick-start': 'CSIRO Kick-Start',
        'high-emitting-industries': 'NSW High Emitting Industries',
        'breakthrough-victoria': 'Breakthrough Victoria',
        'btv': 'Breakthrough Victoria',
        'nsw-hei': 'NSW High Emitting Industries'
    }
    return program_names.get(grant_id, grant_id.replace('-', ' ').title())


def load_grant_metadata(grant_dir: Path) -> Dict[str, Any]:
    """
    Load enhanced metadata from metadata.json file if available.

    Args:
        grant_dir: Path to grant directory

    Returns:
        dict: Flattened metadata for Gemini custom_metadata
    """
    metadata_file = grant_dir / "metadata.json"
    if not metadata_file.exists():
        return {}

    try:
        with open(metadata_file, 'r') as f:
            full_metadata = json.load(f)

        # Flatten nested structure for Gemini custom_metadata
        # Gemini supports string and numeric values only
        flattened = {}

        # Core fields
        if 'grant_id' in full_metadata:
            flattened['grant_id'] = full_metadata['grant_id']
        if 'program_name' in full_metadata:
            flattened['program_name'] = full_metadata['program_name']
        if 'short_name' in full_metadata:
            flattened['short_name'] = full_metadata['short_name']
        if 'managing_agency' in full_metadata:
            flattened['managing_agency'] = full_metadata['managing_agency']
        if 'jurisdiction' in full_metadata:
            flattened['jurisdiction'] = full_metadata['jurisdiction']
        if 'status' in full_metadata:
            flattened['status'] = full_metadata['status']

        # Funding fields
        if 'funding' in full_metadata:
            funding = full_metadata['funding']
            if 'min' in funding and funding['min']:
                flattened['funding_min'] = funding['min']
            if 'max' in funding and funding['max']:
                flattened['funding_max'] = funding['max']
            if 'currency' in funding:
                flattened['currency'] = funding['currency']
            if 'co_funding_required' in funding:
                flattened['co_funding_required'] = str(funding['co_funding_required'])
            if 'funding_type' in funding:
                flattened['funding_type'] = funding['funding_type']

        # Date fields
        if 'dates' in full_metadata:
            dates = full_metadata['dates']
            if 'opens' in dates and dates['opens']:
                flattened['opens'] = dates['opens']
            if 'closes' in dates and dates['closes']:
                flattened['closes'] = dates['closes']

        # Eligibility fields
        if 'eligibility' in full_metadata:
            eligibility = full_metadata['eligibility']
            if 'revenue_max' in eligibility and eligibility['revenue_max']:
                flattened['revenue_max'] = eligibility['revenue_max']
            if 'sectors' in eligibility and eligibility['sectors']:
                # Join sectors as comma-separated string
                flattened['sectors'] = ','.join(eligibility['sectors'][:5])  # Limit to 5

        # Priority
        if 'priority_score' in full_metadata:
            flattened['priority_score'] = full_metadata['priority_score']

        # Tags
        if 'tags' in full_metadata and full_metadata['tags']:
            flattened['tags'] = ','.join(full_metadata['tags'][:10])  # Limit to 10

        return flattened

    except Exception as e:
        print(f"[WARNING] Error loading metadata from {metadata_file}: {e}")
        return {}


def upload_all_grants(force_recreate: bool = False, dry_run: bool = False):
    """
    Batch upload all grants from .inputs/grants/ directory.

    Args:
        force_recreate: Force recreate Grant Corpus (deletes existing)
        dry_run: Don't actually upload, just print what would be uploaded
    """
    # Initialize Gemini client
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("[ERROR] GOOGLE_API_KEY environment variable not set")
        print("        Set it with: export GOOGLE_API_KEY=your_key_here (Linux/Mac)")
        print("        Or: set GOOGLE_API_KEY=your_key_here (Windows)")
        sys.exit(1)

    print("=" * 80)
    print("BATCH GRANT UPLOAD TO GEMINI FILE SEARCH")
    print("=" * 80)
    print()

    # Initialize corpus manager
    try:
        manager = CorpusManager(api_key=api_key)
        store_name = manager.grant_corpus.create_or_get_corpus(force_recreate=force_recreate)
        print(f"[OK] Grant Corpus ready: {store_name}")
        print()
    except Exception as e:
        print(f"[ERROR] Initializing Grant Corpus: {e}")
        sys.exit(1)

    # Find all grant PDFs
    grants_dir = Path(".inputs/grants")
    if not grants_dir.exists():
        print(f"[ERROR] {grants_dir} directory not found")
        print("        Run this script from back/grant-prototype/ directory")
        sys.exit(1)

    # Collect all PDFs with metadata
    uploads = []
    for jurisdiction_dir in sorted(grants_dir.iterdir()):
        if not jurisdiction_dir.is_dir():
            continue

        jurisdiction = jurisdiction_dir.name  # e.g., "federal", "state-nsw"

        for grant_dir in sorted(jurisdiction_dir.iterdir()):
            if not grant_dir.is_dir():
                continue

            grant_id = grant_dir.name  # e.g., "igp", "bbi"
            program_name = get_grant_program_name(grant_id)

            # Load enhanced metadata from metadata.json if available
            enhanced_metadata = load_grant_metadata(grant_dir)

            # If metadata.json exists, use it; otherwise fall back to basic metadata
            if enhanced_metadata:
                base_metadata = enhanced_metadata.copy()
                base_metadata['document_type'] = ''  # Will be set per-document
            else:
                base_metadata = {
                    'grant_id': grant_id,
                    'program_name': program_name,
                    'jurisdiction': jurisdiction
                }

            for pdf_file in sorted(grant_dir.glob("*.pdf")):
                doc_type = infer_document_type(pdf_file.name)

                # Create document-specific metadata
                doc_metadata = base_metadata.copy()
                doc_metadata['document_type'] = doc_type

                uploads.append({
                    'file_path': pdf_file,
                    'metadata': doc_metadata,
                    'has_enhanced_metadata': bool(enhanced_metadata)
                })

    if not uploads:
        print("[WARNING] No grant PDFs found in .inputs/grants/")
        sys.exit(0)

    print(f"Found {len(uploads)} grant documents to upload:")
    print()

    # Count enhanced metadata
    enhanced_count = sum(1 for u in uploads if u.get('has_enhanced_metadata'))
    basic_count = len(uploads) - enhanced_count

    print(f"  Enhanced metadata: {enhanced_count} documents")
    print(f"  Basic metadata: {basic_count} documents")
    print()

    # Group by jurisdiction for display
    by_jurisdiction = {}
    for upload in uploads:
        j = upload['metadata'].get('jurisdiction', 'unknown')
        if j not in by_jurisdiction:
            by_jurisdiction[j] = []
        by_jurisdiction[j].append(upload)

    for jurisdiction, docs in sorted(by_jurisdiction.items()):
        enhanced_in_jurisdiction = sum(1 for d in docs if d.get('has_enhanced_metadata'))
        print(f"  {jurisdiction.upper()}: {len(docs)} documents ({enhanced_in_jurisdiction} with enhanced metadata)")
        by_grant = {}
        for doc in docs:
            g = doc['metadata'].get('program_name', 'Unknown')
            metadata_type = '[ENHANCED]' if doc.get('has_enhanced_metadata') else '[BASIC]'
            key = f"{g} {metadata_type}"
            if key not in by_grant:
                by_grant[key] = 0
            by_grant[key] += 1
        for grant_name, count in sorted(by_grant.items()):
            print(f"    - {grant_name}: {count} files")

    print()
    print("=" * 80)

    if dry_run:
        print("DRY RUN MODE - No uploads will be performed")
        print()
        for i, upload in enumerate(uploads, 1):
            print(f"{i}. {upload['file_path'].name}")
            print(f"   Metadata: {upload['metadata']}")
        print()
        print(f"Total: {len(uploads)} documents would be uploaded")
        return

    # Confirm upload
    response = input(f"\nUpload {len(uploads)} documents to Gemini Grant Corpus? (y/n): ")
    if response.lower() != 'y':
        print("Upload cancelled")
        sys.exit(0)

    print()
    print("Starting uploads...")
    print()

    # Upload each document
    upload_results = []
    for i, upload in enumerate(uploads, 1):
        file_path = upload['file_path']
        metadata = upload['metadata']

        print(f"[{i}/{len(uploads)}] Uploading: {file_path.name}")
        print(f"           Grant: {metadata['program_name']} ({metadata['grant_id']})")
        print(f"           Type: {metadata['document_type']}")

        try:
            file_name = manager.grant_corpus.upload_document(
                file_path=file_path,
                metadata=metadata
            )
            upload_results.append({
                'file_name': file_name,
                'status': 'success',
                'metadata': metadata
            })
            print(f"           [OK] Success")
        except Exception as e:
            print(f"           [ERROR] {e}")
            upload_results.append({
                'file_name': file_path.name,
                'status': 'failed',
                'error': str(e),
                'metadata': metadata
            })

        print()

    # Save upload metadata
    metadata_file = Path(".inputs/.gemini_grant_uploads.json")
    upload_summary = {
        'upload_date': datetime.now().isoformat(),
        'total_files': len(uploads),
        'successful': sum(1 for r in upload_results if r['status'] == 'success'),
        'failed': sum(1 for r in upload_results if r['status'] == 'failed'),
        'store_name': store_name,
        'uploads': upload_results
    }

    with open(metadata_file, 'w') as f:
        json.dump(upload_summary, f, indent=2)

    print("=" * 80)
    print("UPLOAD COMPLETE")
    print("=" * 80)
    print()
    print(f"[OK] Successful uploads: {upload_summary['successful']}/{upload_summary['total_files']}")
    if upload_summary['failed'] > 0:
        print(f"[ERROR] Failed uploads: {upload_summary['failed']}")
    print()
    print(f"Upload metadata saved to: {metadata_file}")
    print(f"Grant Corpus store: {store_name}")
    print()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Batch upload grants to Gemini Grant Corpus")
    parser.add_argument('--force-recreate', action='store_true',
                        help='Force recreate Grant Corpus (deletes existing)')
    parser.add_argument('--dry-run', action='store_true',
                        help='Show what would be uploaded without uploading')

    args = parser.parse_args()

    upload_all_grants(
        force_recreate=args.force_recreate,
        dry_run=args.dry_run
    )
