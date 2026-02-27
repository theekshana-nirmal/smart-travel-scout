import {GoogleGenAI} from "@google/genai";
import {experiences} from "./inventory";
import {LLMMatch} from "./types";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});

// Build the system prompt for the AI model
function buildSystemPrompt(
    maxPrice?: number,
    selectedTags?: string[]
): string {
    // Convert inventory to JSON
    const inventoryJSON = JSON.stringify(experiences, null, 2);

    let filterInstructions = "";
    if (maxPrice) {
        filterInstructions += `\n- Only include experiences with price ≤ $${maxPrice}.`;
    }
    if (selectedTags && selectedTags.length > 0) {
        filterInstructions += `\n- Prefer experiences that have these tags: ${selectedTags.join(", ")}.`;
    }

    return `You are a travel recommendation assistant for Sri Lankan travel experiences.

AVAILABLE EXPERIENCES (this is your ONLY source of truth):
${inventoryJSON}

RULES:
- ONLY recommend experiences from the list above. Never invent new ones.
- Return a JSON array of matches, sorted by relevance (best match first).
- Each match must have: "id" (number from the list), "reason" (1-2 sentence explanation), "score" (1-10).
- If no experiences match the query, return an empty array: []
- Consider the title, location, tags, and price when matching.${filterInstructions}

RESPONSE FORMAT (JSON only, no markdown, no explanation outside the array):
[
  { "id": 1, "reason": "Why this matches the query", "score": 8 }
]`;
}

// Search for experiences using AI
export async function searchWithAI(
    query: string,
    maxPrice?: number,
    selectedTags?: string[]
): Promise<LLMMatch[]> {
    const systemPrompt = buildSystemPrompt(maxPrice, selectedTags);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            temperature: 0.3,
        },
    });

    const responseText = response.text;

    if (!responseText) {
        console.error("AI returned empty response");
        return [];
    }

    try {
        const parsed = JSON.parse(responseText);
        if (!Array.isArray(parsed)) {
            console.error("AI returned non-array:", parsed);
            return [];
        }
        return parsed as LLMMatch[];
    } catch (error) {
        console.error("Failed to parse AI response as JSON:", responseText);
        return [];
    }
}