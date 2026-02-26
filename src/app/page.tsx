"use client";

import {useState} from "react";
import SearchBar from "@/components/SearchBar";
import ResultsList from "@/components/ResultsList";
import {MatchResult, SearchResponse} from "@/lib/types";

export default function Home() {
    // State
    const [results, setResults] = useState<MatchResult[]>([]);
    const [message, setMessage] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Search Handler
    async function handleSearch(query: string) {
        setIsLoading(true);
        setError(null);
        setResults([]);
        setMessage(undefined);

        try {
            const response = await fetch("/api/search", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({query}),
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

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-14 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Smart Travel Scout
                    </h1>
                    <p className="text-base text-gray-500 mb-8">
                        Find your perfect Sri Lankan experience
                    </p>
                    <SearchBar onSearch={handleSearch} isLoading={isLoading}/>
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