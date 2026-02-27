import { NextRequest, NextResponse } from "next/server";
import { SearchRequestSchema } from "@/lib/validation";
import { searchWithAI } from "@/lib/ai";
import { validateAndJoinResults } from "@/lib/validation";
import { SearchResponse } from "@/lib/types";

// Simple in-memory rate limiter: max 10 requests per IP per 60 seconds
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    entry.count++;
    return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
    try {
        // Rate limit check
        const ip = request.headers.get("x-forwarded-for") ?? "unknown";
        if (isRateLimited(ip)) {
            return NextResponse.json(
                {
                    results: [],
                    message: "Too many requests. Please wait a moment before searching again.",
                } satisfies SearchResponse,
                { status: 429 }
            );
        }

        const body = await request.json();
        const validation = SearchRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    results: [],
                    message: validation.error.issues[0]?.message || "Invalid request",
                } satisfies SearchResponse,
                { status: 400 }
            );
        }

        const { query, maxPrice, selectedTags } = validation.data;

        // Get raw matches from the AI model
        const rawMatches = await searchWithAI(query, maxPrice, selectedTags);

        // Validate and join results
        const results = validateAndJoinResults(rawMatches);

        // Apply price filter if maxPrice is provided
        const filteredResults = maxPrice
            ? results.filter((r) => r.experience.price <= maxPrice)
            : results;

        // Build and return the response
        const response: SearchResponse = {
            results: filteredResults,
            message:
                filteredResults.length === 0
                    ? "No matching experiences found. Try broadening your search or adjusting your budget."
                    : undefined,
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error("Search API error:", error);

        return NextResponse.json(
            {
                results: [],
                message: "Something went wrong. Please try again in a moment.",
            } satisfies SearchResponse,
            { status: 500 }
        );
    }
}