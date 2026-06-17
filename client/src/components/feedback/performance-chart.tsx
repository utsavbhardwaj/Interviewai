import { Progress } from "@/components/ui/progress";

interface PerformanceChartProps {
  scores: {
    technical: number;
    communication: number;
    problemSolving: number;
    culturalFit: number;
  };
}

export default function PerformanceChart({ scores }: PerformanceChartProps) {
  const categories = [
    { label: "Technical", value: scores.technical, color: "bg-blue-500" },
    { label: "Communication", value: scores.communication, color: "bg-green-500" },
    { label: "Problem Solving", value: scores.problemSolving, color: "bg-purple-500" },
    { label: "Cultural Fit", value: scores.culturalFit, color: "bg-orange-500" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <div key={index}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">{category.label}</span>
            <span className={`text-sm font-bold ${getScoreColor(category.value)}`}>
              {category.value}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ease-out ${
                category.value >= 80 ? "bg-green-500" :
                category.value >= 60 ? "bg-yellow-500" :
                "bg-red-500"
              }`}
              style={{ width: `${category.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
