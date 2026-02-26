// Travel item data
export interface TravelExperience {
    id: number;
    title: string;
    description: string;
    location: string;
    price: number;
    tags: string[];
}

// AI model output
export interface LLMMatch {
    id: number;
    reason: string;
    score: number;
}