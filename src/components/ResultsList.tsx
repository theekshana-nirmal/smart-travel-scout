import {MatchResult} from "@/lib/types";
import ResultCard from "./ResultCard";

interface ResultsListProps {
    results: MatchResult[];
    message?: string;
    isLoading: boolean;
    hasSearched: boolean;
}

export default function ResultsList({
    results,
    message,
    isLoading,
    hasSearched,
}: ResultsListProps) {

    if (isLoading) {
        return (
            <div className="text-center py-16">
                <div className="animate-spin h-5 w-5 border-2 border-primary
                        border-t-transparent rounded-full mx-auto mb-3"/>
                <p className="text-sm text-gray-400">Searching...</p>
            </div>
        );
    }

    if (!hasSearched) {
        return (
            <div className="text-center py-16">
                <p className="text-sm text-gray-400">
                    Describe your ideal trip to get started
                </p>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 mb-1">No matching experiences found</p>
                <p className="text-sm text-gray-400">
                    {message || "Try adjusting your search or broadening your criteria."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <p className="text-xs text-gray-400">
                {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((result) => (
                <ResultCard key={result.experience.id} result={result}/>
            ))}
        </div>
    );
}