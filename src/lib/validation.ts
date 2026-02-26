import {z} from "zod";
import {validIds, getExperienceById} from "./inventory";
import {MatchResult} from "./types";

// Schema for validating the user's search request
export const SearchRequestSchema = z.object({
    query: z
        .string()
        .min(2, "Search query must be at least 2 characters")
        .max(500, "Search query is too long"),
    maxPrice: z.number().positive().optional(),
    selectedTags: z.array(z.string()).optional(),
});


// Validate a single AI match
const LLMMatchSchema = z.object({
    id: z.number().refine((id) => validIds.has(id), {
        message: "ID does not match any experience in inventory",
    }),
    reason: z.string().min(1, "Reason cannot be empty"),
    score: z.number().min(1).max(10),
});


// The full AI response is an array of matches
const LLMResponseSchema = z.array(LLMMatchSchema);

// The main validation + join function
export function validateAndJoinResults(rawMatches: unknown): MatchResult[] {
    // Validate the entire array
    const validation = LLMResponseSchema.safeParse(rawMatches);

    if (!validation.success) {
        console.warn("LLM response validation failed:", validation.error.issues);

        if (Array.isArray(rawMatches)) {
            return rawMatches
                .map((item) => {
                    const singleValidation = LLMMatchSchema.safeParse(item);
                    if (!singleValidation.success) return null;
                    const experience = getExperienceById(singleValidation.data.id);
                    if (!experience) return null;
                    return {
                        experience,
                        reason: singleValidation.data.reason,
                        score: singleValidation.data.score,
                    };
                })
                .filter((item): item is MatchResult => item !== null);
        }
        return [];
    }

    return validation.data
        .map((match) => {
            const experience = getExperienceById(match.id);
            if (!experience) return null;
            return {
                experience,
                reason: match.reason,
                score: match.score,
            };
        })
        .filter((item): item is MatchResult => item !== null);
}