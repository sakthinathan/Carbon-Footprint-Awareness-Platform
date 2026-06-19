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
            if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "mock-api-key":
                raise ValueError("Valid Google Gemini API Key not configured")

            chat = self.model.start_chat(history=history)
            response = await chat.send_message_async(
                user_message, stream=True
            )
            async for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            log.error("Gemini API error, falling back to local advisor simulation", error=str(e))
            yield "ℹ️ *[EcoAdvisor Simulation Mode]* — A valid Google Gemini API key was not found or is invalid. Providing local carbon advisory recommendations:\n\n"
            
            # Generate appropriate local mock recommendations based on keywords in query
            msg = user_message.lower()
            if "scope 1" in msg or "vehicle" in msg or "transport" in msg or "fuel" in msg or "diesel" in msg:
                mock_text = """### 🚗 Decarbonizing Scope 1 (Direct Emissions)

Here is a recommended reduction strategy:
1. **Fleet Electrification**: Phase out gasoline and diesel vehicles for battery electric vehicles (BEVs). Decarbonization potential: **~35% to 50%**.
2. **HVAC Optimization**: Replace old heating systems with high-efficiency heat pumps. Decarbonization potential: **~15% to 20%**.
3. **Route Optimization**: Deploy real-time telematics to reduce unnecessary miles.
4. **Alternative Biofuels**: Use biodiesel or ethanol for heavy-duty machinery where electric models are not yet viable."""
            elif "scope 2" in msg or "electricity" in msg or "power" in msg or "solar" in msg:
                mock_text = """### ⚡ Optimizing Scope 2 (Indirect Energy Emissions)

Here is a recommended energy reduction strategy:
1. **Power Purchase Agreements (PPAs)**: Contract directly with solar/wind farms to guarantee clean energy supply. Decarbonization potential: **~80% to 100% of Scope 2**.
2. **On-Site Solar PV**: Install rooftop solar panels. Payback period is typically 3-5 years.
3. **Smart Building Automation**: Implement LED lighting, occupancy sensors, and high-efficiency smart thermostats.
4. **Energy Audits**: Conduct a detailed energy audit during off-peak hours to locate phantom loads."""
            elif "scope 3" in msg or "supply" in msg or "supplier" in msg or "travel" in msg or "waste" in msg:
                mock_text = """### 🏭 Scope 3 Value Chain Strategy

Since Scope 3 often accounts for over 80% of total emissions:
1. **Supplier Code of Conduct**: Require top suppliers to disclose their annual emissions data and commit to SBTi targets.
2. **Business Travel Policy**: Introduce carbon caps for employee flights and incentivize rail travel.
3. **Circular Waste Management**: Partner with certified recycling facilities and set a Zero-Waste-to-Landfill target.
4. **Product Life Cycle Redesigns**: Optimize packaging to reduce weight and shipping volume."""
            else:
                mock_text = """### 🌿 EcoSentinel General Net-Zero Roadmap

To build a comprehensive carbon reduction pathway:
1. **Baseline Audit**: First, verify all Scope 1, 2, and 3 logs.
2. **Set Science-Based Targets (SBTi)**: Aim for a **4.2% absolute annual reduction** to align with the 1.5°C climate pathway.
3. **Efficiency First**: Shift from fossil combustion to direct electrification.
4. **Transition Energy Procurement**: Source 100% renewable power.
5. **Supplier Engagement**: Enforce carbon accounting standards in procurement decisions."""

            # Stream the text chunk-by-chunk for realistic user experience
            import asyncio
            words = mock_text.split(" ")
            chunk_size = 4
            for i in range(0, len(words), chunk_size):
                yield " ".join(words[i:i+chunk_size]) + " "
                await asyncio.sleep(0.04)

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
            if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "mock-api-key":
                raise ValueError("Valid Google Gemini API Key not configured")
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            log.error("Gemini recommendations error, falling back to local advisor", error=str(e))
            top_category = emission_summary.get('top_category', 'purchased_electricity') or 'purchased_electricity'
            category_label = str(top_category).replace('_', ' ').title()
            
            return f"""### 🌱 EcoSentinel Actionable Decarbonization Plan

Based on your current carbon inventory ({emission_summary.get('total_emissions_tonnes', 0.0):.1f} t CO₂e), here are the top 5 prioritized strategies:

1. **Address Top Emission Category ({category_label})**: Focus reduction initiatives on your primary source of impact. If this is electricity, transition to a green tariff or buy PPA energy.
2. **Transition Fleets (Scope 1)**: Convert diesel and petrol logistics or commuter vehicles to electric vehicles (EVs) to reduce direct Scope 1 combustion by ~35%.
3. **Procure Renewable Energy (Scope 2)**: Purchase Energy Attribute Certificates (EACs / RECs) or implement on-site solar panel arrays to approach zero Scope 2 footprint.
4. **Supply Chain Engagement (Scope 3)**: Engage with key suppliers to ensure they have public carbon footprint accounts and align with Net Zero targets.
5. **Zero Waste Target (Scope 3)**: Conduct zero-waste-to-landfill campaigns. Composting and recycling reduce Scope 3 waste emissions by up to 80% compared to landfill disposal.
"""


# Singleton instance
gemini_advisor = GeminiAdvisor()
