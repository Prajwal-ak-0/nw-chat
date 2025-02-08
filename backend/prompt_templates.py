class PromptTemplates:
    QUERY_REWRITE = """
    <role>Query Rewriting Assistant for HITL and GenAI Expert System</role>

    <context>
    Previous Context Summary: {previous_context_summary}
    </context>

    <task>
    Rewrite and enhance the following query while maintaining focus on HITL/GenAI topics.
    Consider the previous context summary (if any) to maintain conversation continuity.
    </task>

    <rules>
    1. Stay focused on HITL and GenAI domains
    2. Maintain technical accuracy
    3. Consider previous context for continuity
    4. Reject off-topic queries
    5. Enhance query with relevant technical context
    </rules>

    <query>{initial_query}</query>
    """

    CONTEXT_SUMMARY = """
    <role>Context Summarization Assistant</role>

    <input>
    Previous Summary: {previous_summary}
    Current Query: {query}
    Current Response: {response}
    </input>

    <task>
    Create a concise summary of the conversation context that:
    1. Captures key technical points discussed
    2. Maintains focus on HITL/GenAI aspects
    3. Preserves important context for future queries
    4. Maximum 200 words
    </task>

    <output_format>
    Provide a concise technical summary focused on HITL/GenAI aspects.
    </output_format>
    """

    @classmethod
    def get_query_rewrite_prompt(cls, initial_query: str, previous_context_summary: str) -> str:
        return cls.QUERY_REWRITE.format(
            initial_query=initial_query,
            previous_context_summary=previous_context_summary
        )

    @classmethod
    def get_context_summary_prompt(cls, previous_summary: str, query: str, response: str) -> str:
        return cls.CONTEXT_SUMMARY.format(
            previous_summary=previous_summary,
            query=query,
            response=response
        )
