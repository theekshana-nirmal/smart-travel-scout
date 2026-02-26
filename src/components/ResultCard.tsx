import { MatchResult } from "@/lib/types";

interface ResultCardProps {
    result: MatchResult;
}

export default function ResultCard({ result }: ResultCardProps) {
    const { experience, reason, score } = result;

    return (
        <article className="border border-gray-200 rounded-lg p-5
                        hover:border-gray-300 transition-colors bg-white">
            {/* Header: Title and Score */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                    {experience.title}
                </h3>
                <span className="text-sm font-medium text-primary">
                    {score}/10
                </span>
            </div>

            {/* Location and Price */}
            <div className="flex gap-4 mb-3 text-sm text-gray-500">
                <span>{experience.location}</span>
                <span className="font-medium text-gray-900">
                    ${experience.price}
                </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {experience.tags.map((tag) => (
                    <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 text-xs
                       px-2 py-0.5 rounded"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Why this matches */}
            <div className="border-l-2 border-primary pl-3">
                <p className="text-sm text-gray-600">{reason}</p>
            </div>
        </article>
    );
}