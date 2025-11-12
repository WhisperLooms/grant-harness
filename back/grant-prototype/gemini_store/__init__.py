"""
Gemini File Search Integration Module

Implements dual-corpus architecture (ADR-2051) for grant-harness:
- Grant Corpus: All grant documents and PDFs
- Company Corpus: Company profiles, website data, corporate documents

This module provides a fully managed RAG system using Google's Gemini File Search API.

Key Components:
- CorpusManager: Coordinates dual-corpus operations
- GrantCorpus: Grant-specific document management
- CompanyCorpus: Company-specific document management
- FileManager: Upload and metadata management
- QueryEngine: Semantic search and RAG queries

Usage:
    from gemini_store import CorpusManager

    # Initialize dual-corpus system
    manager = CorpusManager()

    # Upload grant documents
    manager.grant_corpus.upload_document("path/to/grant.pdf", metadata={"grant_id": "igp-2025"})

    # Query for matches
    results = manager.query_grants("battery recycling company")

Related ADRs:
- ADR-2051: Gemini Dual-Corpus Architecture
- ADR-2052: Input Data Management Pattern
- ADR-2053: EMEW Bootstrap Strategy
"""

from .corpus_manager import CorpusManager
from .grant_corpus import GrantCorpus
from .company_corpus import CompanyCorpus
from .file_manager import FileManager
from .query_engine import QueryEngine

__all__ = [
    "CorpusManager",
    "GrantCorpus",
    "CompanyCorpus",
    "FileManager",
    "QueryEngine",
]

__version__ = "0.1.0"
