# Smart Travel Scout

A simple web app where users type what kind of Sri Lankan travel experience they want in plain English, and the app finds the best matches from a fixed inventory using AI. Each result shows why it matched.

Built with Next.js 16, TypeScript, Tailwind CSS 4, and Google Gemini 2.5 Flash.

**Live:** [Smart Travel Scout](https://smart-travel-scout-lilac.vercel.app/)

---

## How It Works

1. User types a query like "beach weekend with surfing under $100" on the home page.
2. The query goes to a server-side route handler (`POST /api/search`) where Zod validates the input.
3. The server sends the query to Gemini along with the full inventory as a system prompt.
4. Gemini returns matched item IDs, a reason for each match, and a relevance score.
5. The server validates every returned ID against the real inventory. Anything the AI made up gets dropped.
6. The client displays the matched experiences with scores and explanations.

## How the AI Stays Grounded

The AI only knows about the 5 experiences we give it. It cannot invent new ones. There are multiple layers to prevent that:

- The system prompt says "ONLY recommend from this list. Never invent new ones." (`src/lib/ai.ts`)
- Response format is forced to JSON using `responseMimeType: "application/json"` so the output is always parseable (`src/lib/ai.ts`)
- Temperature is set to `0.3` to reduce randomness (`src/lib/ai.ts`)
- Every ID the AI returns is checked against a `Set` of valid IDs using Zod. If the ID doesn't exist in our inventory, that result is thrown out (`src/lib/validation.ts`)
- The server also re-checks the price filter after the AI responds, in case the model ignored the budget (`src/app/api/search/route.ts`)
- If the whole response fails validation, the server tries to salvage individual valid items instead of returning nothing (`src/lib/validation.ts`)

## Tech

- Next.js 16.1.6 (App Router)
- React 19
- TypeScript 5 (strict mode)
- Tailwind CSS 4
- Zod 4 for validation
- Google Gemini 2.5 Flash for the LLM

Deployed on Vercel. The only env variable needed is `GEMINI_API_KEY`.

---

## Submission Questions

**Q1: Describe one specific technical hurdle you faced while connecting the AI API to your frontend. How did you debug it?**

The first real problem I hit was Gemini wrapping its JSON response in markdown code fences (triple backticks). So `JSON.parse()` kept failing on the server and I couldn't figure out why at first because when I logged the response, it looked like valid JSON visually.

I debugged it by logging the raw `response.text` and noticed the extra characters around the actual array. The fix was setting `responseMimeType: "application/json"` in the Gemini config, which tells the model to return raw JSON without any formatting. I also wrapped `JSON.parse()` in a try/catch that logs the exact raw string on failure, so if this ever happens again in production I'll see exactly what came back.

**Q2: If we had 50,000 travel packages instead of 5, how would you change your approach?**

Right now I pass all 5 items directly in the system prompt. That won't scale to 50,000 items. The prompt would exceed token limits and every request would be expensive.

I'd use a RAG (Retrieval-Augmented Generation) approach. The idea is simple: don't send everything to the LLM. Instead, narrow it down first, then let the LLM do the final ranking. I'd generate embeddings for each travel package and store them in a vector database. When a query comes in, I'd embed the query and retrieve only the most relevant items using similarity search. That part is fast and cheap.

Then I'd pass just those relevant candidates to Gemini in the system prompt, the same way I currently pass all 5. The LLM works with a small, focused set instead of the whole catalog, so the prompt stays short, cost stays low, and the model gives better results. The Zod validation and ID-checking I already have would stay the same since it works regardless of inventory size.

**Q3: Which AI tool did you use to help build this? Share one instance where it gave you a bad suggestion.**

I used GitHub Copilot during development, mostly for boilerplate and repetitive code.

One bad suggestion: when I was writing the Zod schema to validate the AI's response, Copilot suggested `z.enum(["1", "2", "3", "4", "5"])` for the ID field. This was wrong in two ways. It used strings instead of numbers, and it hardcoded the IDs so any change to the inventory would require manually updating the schema.

I replaced it with `z.number().refine((id) => validIds.has(id))`, where `validIds` is a Set built from the inventory array at runtime. That keeps the schema and the data in sync automatically.
