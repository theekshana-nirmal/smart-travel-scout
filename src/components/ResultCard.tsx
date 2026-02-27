import { MatchResult } from "@/lib/types";

interface ResultCardProps {
    result: MatchResult;
}

export default function ResultCard({ result }: ResultCardProps) {
    const { experience, reason, score } = result;

    return (
        <article className="border border-gray-200 rounded-lg p-4 bg-white
                        hover:border-gray-300 transition-colors">
            <div className="flex justify-between items-start gap-4 mb-1.5">
                <h3 className="text-base font-semibold text-gray-900 leading-snug">
                    {experience.title}
                </h3>
                <span className="text-xs font-medium text-primary whitespace-nowrap mt-0.5">
                    {score}/10
                </span>
            </div>

            <div className="flex items-center gap-3 mb-2.5 text-sm text-gray-500">
                <span>{experience.location}</span>
                <span className="text-gray-300">|</span>
                <span className="font-medium text-gray-800">${experience.price}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
                {experience.tags.map((tag) => (
                    <span
                        key={tag}
                        className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="border-l-2 border-primary pl-3">
                <p className="text-sm text-gray-600 leading-relaxed">{reason}</p>
            </div>
        </article>
    );
}