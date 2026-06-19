"""
Gemini AI Advisor — Streaming chat with domain-specific carbon expertise.
"""
import structlog
import google.generativeai as genai
from typing import AsyncGenerator
from app.config import settings

log = structlog.get_logger()

# System prompt for the carbon expert persona
SYSTEM_PROMPT = """You are EcoAdvisor, an expert AI assistant for the EcoSentinel Carbon Footprint Awareness Platform.

Your expertise covers:
- GHG Protocol (Scope 1, 2, 3 emissions)
- Carbon reduction strategies and decarbonization planning
- Renewable energy transitions
- Supply chain sustainability
- CSRD, TCFD, and other regulatory frameworks
- Carbon offsetting and net-zero pathways
- Industry-specific emission benchmarks

Guidelines:
- Always provide actionable, specific recommendations
- Quantify potential reductions where possible (e.g., "switching to EVs could reduce Scope 1 by 40%")
- Reference IPCC data and industry best practices
- Be concise but thorough
- Use bullet points and structured responses when appropriate
- Ask clarifying questions when the query is vague
- Never make up specific statistics — acknowledge uncertainty when present

Current context: You are assisting sustainability managers and analysts in tracking and reducing organizational carbon emissions."""


class GeminiAdvisor:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL,
            system_instruction=SYSTEM_PROMPT,
            generation_config=genai.GenerationConfig(
                temperature=0.7,
                max_output_tokens=2048,
            ),
        )

    async def chat_stream(
        self,
        user_message: str,
        conversation_history: list[dict] | None = None,
    ) -> AsyncGenerator[str, None]:
        """
        Stream a response from Gemini for the given message.

        Args:
            user_message: The user's question or request
            conversation_history: Previous messages in [{role, parts}] format

        Yields:
            Text chunks as they arrive from the model
        """
        history = conversation_history or []

        try:
            chat = self.model.start_chat(history=history)
            response = await chat.send_message_async(
                user_message, stream=True
            )
            async for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            log.error("Gemini API error", error=str(e))
            yield f"\n\n⚠️ I encountered an error: {str(e)}. Please try again."

    async def get_recommendations(self, emission_summary: dict) -> str:
        """
        Generate top reduction recommendations based on emission data.

        Args:
            emission_summary: Dict with scope totals and categories

        Returns:
            Markdown-formatted recommendations
        """
        prompt = f"""Based on this organization's carbon footprint data, provide the top 5 actionable reduction strategies:

Emission Summary:
- Total: {emission_summary.get('total_co2e_tonnes', 0):.1f} tonnes CO₂e
- Scope 1 (Direct): {emission_summary.get('scope_1_tonnes', 0):.1f} tonnes CO₂e
- Scope 2 (Energy): {emission_summary.get('scope_2_tonnes', 0):.1f} tonnes CO₂e
- Scope 3 (Value Chain): {emission_summary.get('scope_3_tonnes', 0):.1f} tonnes CO₂e
- Top Category: {emission_summary.get('top_category', 'Unknown')}

Provide specific, prioritized recommendations with estimated impact percentages."""

        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            log.error("Gemini recommendations error", error=str(e))
            return "Unable to generate recommendations at this time."


# Singleton instance
gemini_advisor = GeminiAdvisor()
