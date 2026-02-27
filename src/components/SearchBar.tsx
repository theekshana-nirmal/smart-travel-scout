"use client";

import React, {useState} from "react";


interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export default function SearchBar({onSearch, isLoading}: SearchBarProps) {
    const [query, setQuery] = useState("");

    function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const trimmedQuery = query.trim();
        if (trimmedQuery.length === 0) return;

        onSearch(trimmedQuery);
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='e.g. "a chilled beach weekend with surfing vibes under $100"'
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-primary/40
                     disabled:bg-gray-100"
                />
                <button
                    type="submit"
                    disabled={isLoading || query.trim().length === 0}
                    className="px-6 py-3 bg-primary text-white rounded-lg
                     hover:bg-primary-dark disabled:bg-gray-300
                     transition-colors"
                >
                    {isLoading ? "Searching..." : "Search"}
                </button>
            </div>
        </form>
    );
}