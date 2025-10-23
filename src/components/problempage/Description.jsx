import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { isQuestionSubmitted } from "@/api/services/questionService";
import { Link } from "@tanstack/react-router";

const Description = React.memo(({ question }) => {
  const [showTopics, setShowTopics] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const { data: isSolved } = useQuery({
    queryKey: ["isSubmitted", question.uid],
    queryFn: () => isQuestionSubmitted(question.uid),
  });

  if (!question) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        No problem found
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold text-balance leading-tight text-white">
            {question.uid}. {question.title}
          </h1>
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors">
              <Link
                to={`/solution/${question.uid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                Solution
              </Link>
              <ExternalLink className="w-4 h-4" />
            </div>

            <span
              className={`font-medium capitalize ${getDifficultyColor(question.difficulty)}`}
            >
              {question.difficulty}
            </span>
            <div className="flex items-center gap-1">
              {/* {console.log("submitted -> ", isSolved)} */}
              {isSolved?.isSubmitted > 0 ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-sm text-slate-400">
                {isSolved?.isSubmitted > 0 ? "Solved" : "Unsolved"}
              </span>
            </div>
          </div>
        </div>
        <div className="h-px bg-slate-800" />
      </div>

      <div className="space-y-3">
        <p className="text-slate-300 leading-relaxed whitespace-pre-line">
          {question.description}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-white">Examples</h2>
        <div className="space-y-4">
          {question?.examples.map((example, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-2 font-mono text-sm"
            >
              <div>
                <span className="font-semibold text-white">Input:</span>{" "}
                <span className="text-slate-400">{example.input}</span>
              </div>
              <div>
                <span className="font-semibold text-white">Output:</span>{" "}
                <span className="text-slate-400">{example.output}</span>
              </div>
              {example.explanation && (
                <div>
                  <span className="font-semibold text-white">Explanation:</span>{" "}
                  <span className="text-slate-400">{example.explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium text-white">Constraints</h2>
        <ul className="space-y-1 font-mono text-sm">
          {question.constraints.map((constraint, index) => (
            <li key={index} className="text-slate-400">
              • {constraint}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setShowTopics(!showTopics)}
          className="flex items-center gap-2 text-lg font-medium text-slate-300 hover:text-blue-400 transition-colors"
        >
          {showTopics ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          Topics
        </button>
        {showTopics && (
          <div className="flex flex-wrap gap-2">
            {question.topics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/50 rounded-full text-sm font-medium hover:bg-blue-600/30 transition-colors"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-2 text-lg font-medium text-slate-300 hover:text-blue-400 transition-colors"
        >
          {showHints ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          Hints
        </button>
        {showHints && (
          <ul className="space-y-2">
            {question.hints.map((hint, index) => (
              <li key={index} className="text-slate-400 leading-relaxed">
                {index + 1}. {hint}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

Description.displayName = "ProblemDescription";
export default Description;
