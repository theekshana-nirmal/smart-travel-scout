"use client";

import React, {useState} from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
    maxPrice: number | undefined;
    onMaxPriceChange: (value: number | undefined) => void;
}

export default function SearchBar({onSearch, isLoading, maxPrice, onMaxPriceChange}: SearchBarProps) {
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
                    placeholder='e.g. "a chilled beach weekend with surfing vibes"'
                    disabled={isLoading}
                    className="flex-1 min-w-0 px-4 py-2.5 text-sm border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-primary/40
                     disabled:bg-gray-100 placeholder:text-gray-400"
                />
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                        type="number"
                        min={1}
                        placeholder="Max"
                        value={maxPrice ?? ""}
                        onChange={(e) =>
                            onMaxPriceChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                        disabled={isLoading}
                        className="w-20 pl-7 pr-2 py-2.5 text-sm border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-primary/40
                         disabled:bg-gray-100 placeholder:text-gray-400
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                         [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || query.trim().length === 0}
                    className="px-5 py-2.5 text-sm font-medium bg-primary text-white rounded-lg
                     hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors whitespace-nowrap"
                >
                    {isLoading ? "Searching..." : "Search"}
                </button>
            </div>
        </form>
    );
}