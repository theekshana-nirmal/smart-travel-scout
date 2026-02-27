"use client";

import {allTags} from "@/lib/inventory";

interface TagFilterProps {
    selectedTags: string[];
    onTagToggle: (tag: string) => void;
}

export default function TagFilter({selectedTags, onTagToggle}: TagFilterProps) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => onTagToggle(tag)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                            isActive
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-gray-500 border-gray-300 hover:border-gray-400"
                        }`}
                    >
                        {tag}
                    </button>
                );
            })}
        </div>
    );
}
