"use client";

import {useState} from "react";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import ResultsList from "@/components/ResultsList";
import {MatchResult, SearchResponse} from "@/lib/types";

// Example queries to help users get started
const EXAMPLE_QUERIES = [
    "a chilled beach weekend with surfing vibes under $100",
    "historical sites with a good view",
    "adventure in the wild with animals",
    "cold weather hiking trip",
];

export default function Home() {
    // State
    const [results, setResults] = useState<MatchResult[]>([]);
    const [message, setMessage] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | undefined>();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [activeQuery, setActiveQuery] = useState("");

    // Search Handler
    async function handleSearch(query: string) {
        setIsLoading(true);
        setError(null);
        setResults([]);
        setMessage(undefined);
        setActiveQuery(query);

        try {
            const response = await fetch("/api/search", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    query,
                    maxPrice: maxPrice || undefined,
                    selectedTags: selectedTags.length > 0 ? selectedTags : undefined,
                }),
            });

            const data: SearchResponse = await response.json();

            if (!response.ok) {
                setError(data.message || "Something went wrong");
                return;
            }

            setResults(data.results);
            setMessage(data.message);
        } catch (err) {
            setError("Failed to connect to the server. Please try again.");
        } finally {
            setIsLoading(false);
            setHasSearched(true);
        }
    }

    function handleTagToggle(tag: string) {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-14 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Smart Travel Scout
                    </h1>
                    <p className="text-base text-gray-500 mb-6">
                        Find your perfect Sri Lankan experience
                    </p>
                    <SearchBar onSearch={handleSearch} isLoading={isLoading}/>

                    {/* Filters */}
                    <div className="mt-5 max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Price filter */}
                            <div className="flex items-center gap-2">
                                <label htmlFor="maxPrice" className="text-sm text-gray-500 whitespace-nowrap">
                                    Max price:
                                </label>
                                <input
                                    id="maxPrice"
                                    type="number"
                                    min={1}
                                    placeholder="Any"
                                    value={maxPrice ?? ""}
                                    onChange={(e) =>
                                        setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                                    }
                                    className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                                         focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>

                            {/* Tag filter */}
                            <TagFilter
                                selectedTags={selectedTags}
                                onTagToggle={handleTagToggle}
                            />
                        </div>
                    </div>

                    {/* Example queries (only shown before first search) */}
                    {!hasSearched && (
                        <div className="mt-6 max-w-2xl mx-auto">
                            <p className="text-xs text-gray-400 mb-2">Try one of these:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {EXAMPLE_QUERIES.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleSearch(q)}
                                        className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600
                                             rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700
                          rounded-lg p-4 mb-6">
                        <p>{error}</p>
                    </div>
                )}

                {/* Results List */}
                <ResultsList
                    results={results}
                    message={message}
                    isLoading={isLoading}
                    hasSearched={hasSearched}
                />
            </div>
        </main>
    );
}