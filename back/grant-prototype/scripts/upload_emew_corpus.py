"""
Upload EMEW Corporate Documents to Company Corpus

Uploads EMEW's corporate documents to the Gemini Company Corpus
for semantic matching against grants.

Usage:
    cd back/grant-prototype
    python -m scripts.upload_emew_corpus
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


def upload_emew_documents():
    """Upload EMEW corporate documents to Company Corpus."""

    print("=" * 80)
    print("EMEW CORPORATE DOCUMENT UPLOAD")
    print("=" * 80)
    print()

    # Initialize corpus manager
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("[ERROR] GOOGLE_API_KEY not set in .env file")
        sys.exit(1)

    try:
        manager = CorpusManager(api_key=api_key)
        # Create or get Company Corpus
        store_name = manager.company_corpus.create_or_get_corpus()
        print(f"[OK] Company Corpus ready: {store_name}")
        print()
    except Exception as e:
        print(f"[ERROR] Failed to initialize Company Corpus: {e}")
        sys.exit(1)

    # Find EMEW corporate documents
    emew_dir = Path(".inputs/companies/c-emew/corporate")
    if not emew_dir.exists():
        print(f"[ERROR] EMEW corporate directory not found: {emew_dir}")
        sys.exit(1)

    # Collect PDF files
    pdf_files = list(emew_dir.glob("*.pdf"))
    if not pdf_files:
        print("[WARNING] No PDF files found in EMEW corporate directory")
        sys.exit(0)

    print(f"Found {len(pdf_files)} EMEW corporate document(s):")
    for pdf in pdf_files:
        print(f"  - {pdf.name}")
    print()

    # Upload each document with EMEW metadata
    print("Starting upload...")
    print()

    for i, pdf_file in enumerate(pdf_files, 1):
        print(f"[{i}/{len(pdf_files)}] Uploading: {pdf_file.name}")

        # Metadata for EMEW documents (company_id passed separately)
        metadata = {
            'company_name': 'EMEW Corporation',
            'document_type': 'corporate-presentation',
            'industry': 'metal-recovery-recycling',
            'location': 'Victoria, Australia',
            'sectors': 'advanced-manufacturing,recycling,clean-technology',
            'confidential': 'true'  # Mark as confidential client data
        }

        try:
            file_name = manager.company_corpus.upload_document(
                file_path=pdf_file,
                company_id='emew',
                metadata=metadata
            )
            print(f"           [OK] Success: {file_name}")
        except Exception as e:
            print(f"           [ERROR] Failed: {e}")

        print()

    print("=" * 80)
    print("UPLOAD COMPLETE")
    print("=" * 80)
    print()
    print(f"[OK] EMEW documents uploaded to Company Corpus: {store_name}")
    print()
    print("Next steps:")
    print("1. Test semantic matching: python -m scripts.query_emew_matches")
    print("2. Query specific grants: Use company_corpus.query() in your code")
    print()


if __name__ == "__main__":
    upload_emew_documents()
