import { Card, CardContent } from "@/components/ui/card";

interface QuestionProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  questionText: string;
}

export default function QuestionProgress({ 
  currentQuestion, 
  totalQuestions, 
  questionText 
}: QuestionProgressProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <div className="bg-gray-200 rounded-full h-2 w-32">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
          {questionText}
        </h3>
      </CardContent>
    </Card>
  );
}