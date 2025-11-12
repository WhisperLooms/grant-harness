"""
Query Engine - Advanced Semantic Search

Provides advanced query patterns and cross-corpus workflows.
Most basic querying is handled by GrantCorpus/CompanyCorpus,
but QueryEngine implements complex multi-step RAG patterns.
"""

from typing import List, Dict, Any, Optional
import google.generativeai as genai
from google.generativeai import types


class QueryEngine:
    """
    Advanced query patterns for Gemini File Search.

    Implements:
    - Multi-corpus queries (cross-corpus reasoning)
    - Structured data extraction
    - Confidence scoring
    - Citation management
    """

    def __init__(
        self,
        client: genai.Client,
        grant_store_name: str,
        company_store_name: str
    ):
        """
        Initialize Query Engine with both corpora.

        Args:
            client: Gemini API client
            grant_store_name: Grant Corpus store identifier
            company_store_name: Company Corpus store identifier
        """
        self.client = client
        self.grant_store_name = grant_store_name
        self.company_store_name = company_store_name

    def match_company_to_grants(
        self,
        company_id: str,
        top_k: int = 10,
        model: str = "gemini-2.0-flash-exp"
    ) -> List[Dict[str, Any]]:
        """
        Advanced matching workflow: company → grants.

        Uses multi-step reasoning:
        1. Query Company Corpus to extract profile
        2. Extract matching criteria (industry, capabilities, location)
        3. Query Grant Corpus with extracted criteria
        4. Score and rank matches

        Args:
            company_id: Company identifier
            top_k: Number of matches to return
            model: Gemini model to use

        Returns:
            list: Ranked grant matches with scores and reasoning

        Example:
            >>> engine = QueryEngine(client, grant_store, company_store)
            >>> matches = engine.match_company_to_grants("emew", top_k=5)
            >>> for match in matches:
            ...     print(f"{match['grant_id']}: {match['relevance_score']}")
        """
        # Step 1: Extract company profile
        company_query = f"""
        Extract a structured company profile with these fields:
        - Industry
        - Key products/services
        - Geographic location (state)
        - Company size (employees, revenue range if known)
        - Core capabilities
        - Environmental/sustainability focus

        Format as JSON.
        """

        tool_config = types.Tool(
            file_search=types.FileSearch(
                file_search_store_names=[self.company_store_name],
                metadata_filter=f"company_id={company_id}"
            )
        )

        profile_response = self.client.models.generate_content(
            model=model,
            contents=company_query,
            config=types.GenerateContentConfig(tools=[tool_config])
        )

        company_profile = profile_response.text

        # Step 2: Query grants with company context
        grant_query = f"""
        Based on this company profile:
        {company_profile}

        Find the top {top_k} most relevant Australian government grants.

        For each grant, provide:
        1. Grant ID/Name
        2. Relevance score (0.0-1.0)
        3. Why it matches (specific criteria met)
        4. Funding range
        5. Deadline
        6. Key eligibility requirements

        Format as JSON array.
        """

        grant_tool_config = types.Tool(
            file_search=types.FileSearch(
                file_search_store_names=[self.grant_store_name]
            )
        )

        grant_response = self.client.models.generate_content(
            model=model,
            contents=grant_query,
            config=types.GenerateContentConfig(tools=[grant_tool_config])
        )

        # Parse response (simplified - could use structured output)
        matches = []
        # In practice, you'd parse the JSON response
        # For now, return the raw response
        return [{
            "raw_response": grant_response.text,
            "company_profile": company_profile
        }]

    def extract_application_field_value(
        self,
        company_id: str,
        field_name: str,
        field_description: str,
        model: str = "gemini-2.0-flash-exp"
    ) -> Dict[str, Any]:
        """
        Extract a specific application field value from company documents.

        Used in Week 3 for AI-powered application population.

        Args:
            company_id: Company identifier
            field_name: Application field label
            field_description: Field description/context
            model: Gemini model to use

        Returns:
            dict: {
                "value": "Extracted value",
                "confidence": 0.85,
                "sources": ["doc1.pdf p12", "doc2.pdf p5"],
                "explanation": "Why this value was chosen"
            }

        Example:
            >>> result = engine.extract_application_field_value(
            ...     "emew",
            ...     "Annual Revenue",
            ...     "The company's total annual revenue in AUD"
            ... )
            >>> print(result["value"])  # "$8.5M"
            >>> print(result["confidence"])  # 0.92
        """
        query = f"""
        Extract the answer to this application question:

        Field: {field_name}
        Description: {field_description}

        Provide:
        1. VALUE: The answer (concise, formatted appropriately for the field)
        2. CONFIDENCE: How confident you are (0.0-1.0)
        3. SOURCES: Which documents and pages support this answer
        4. EXPLANATION: Why you chose this value

        Be precise and cite specific documents.
        """

        tool_config = types.Tool(
            file_search=types.FileSearch(
                file_search_store_names=[self.company_store_name],
                metadata_filter=f"company_id={company_id}"
            )
        )

        response = self.client.models.generate_content(
            model=model,
            contents=query,
            config=types.GenerateContentConfig(tools=[tool_config])
        )

        # Parse response (simplified)
        response_text = response.text
        result = {
            "value": "",
            "confidence": 0.5,
            "sources": [],
            "explanation": response_text
        }

        # Simple parsing (could be improved with structured output)
        lines = response_text.split('\n')
        for line in lines:
            if line.startswith('VALUE:'):
                result["value"] = line.replace('VALUE:', '').strip()
            elif line.startswith('CONFIDENCE:'):
                try:
                    result["confidence"] = float(line.replace('CONFIDENCE:', '').strip())
                except:
                    pass
            elif line.startswith('SOURCES:'):
                result["sources"] = [line.replace('SOURCES:', '').strip()]

        return result

    def get_grounding_metadata(self, response: Any) -> List[Dict[str, Any]]:
        """
        Extract citation/grounding metadata from a Gemini response.

        Args:
            response: Gemini API response object

        Returns:
            list: Citation metadata (document names, page numbers, relevance scores)

        Example:
            >>> response = client.models.generate_content(...)
            >>> citations = engine.get_grounding_metadata(response)
            >>> for citation in citations:
            ...     print(f"{citation['document']}, page {citation['page']}")
        """
        try:
            grounding = response.candidates[0].grounding_metadata
            # Parse grounding metadata
            # The structure depends on Gemini's response format
            return [{"raw": str(grounding)}]
        except:
            return []


if __name__ == "__main__":
    print("QueryEngine - Advanced semantic search module")
    print("Use via CorpusManager for integrated functionality")
