"use client";

import {useState} from "react";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import ResultsList from "@/components/ResultsList";
import {MatchResult, SearchResponse} from "@/lib/types";

const EXAMPLE_QUERIES = [
    "a chilled beach weekend with surfing vibes under $100",
    "historical sites with a good view",
    "adventure in the wild with animals",
    "cold weather hiking trip",
];

export default function Home() {
    const [results, setResults] = useState<MatchResult[]>([]);
    const [message, setMessage] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | undefined>();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    async function handleSearch(query: string) {
        setIsLoading(true);
        setError(null);
        setResults([]);
        setMessage(undefined);

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
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 pt-12 pb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Smart Travel Scout
                    </h1>
                    <p className="text-sm text-gray-400 mb-6">
                        Find your perfect Sri Lankan experience
                    </p>

                    {/* Search row: query + max price + button */}
                    <SearchBar
                        onSearch={handleSearch}
                        isLoading={isLoading}
                        maxPrice={maxPrice}
                        onMaxPriceChange={setMaxPrice}
                    />

                    {/* Tag filters */}
                    <div className="mt-4 max-w-2xl mx-auto flex justify-center">
                        <TagFilter
                            selectedTags={selectedTags}
                            onTagToggle={handleTagToggle}
                        />
                    </div>

                    {/* Example queries */}
                    {!hasSearched && (
                        <div className="mt-5 max-w-2xl mx-auto">
                            <p className="text-xs text-gray-400 mb-2">Try one of these:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {EXAMPLE_QUERIES.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleSearch(q)}
                                        disabled={isLoading}
                                        className="text-xs px-3 py-1.5 bg-gray-50 text-gray-500
                                             border border-gray-200 rounded-full
                                             hover:bg-gray-100 hover:text-gray-700
                                             disabled:opacity-50 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="max-w-3xl mx-auto px-4 py-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700
                          rounded-lg p-4 mb-6 text-sm">
                        {error}
                    </div>
                )}

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