import React, { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle, XCircle } from "lucide-react";

const Description = React.memo(({ question }) => {
  const [showTopics, setShowTopics] = useState(false);
  const [showHints, setShowHints] = useState(false);

  if (!question) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No problem found
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-easy";
      case "medium":
        return "text-medium";
      case "hard":
        return "text-hard";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold text-balance leading-tight">
            {question.uid}. {question.title}
          </h1>
          <div className="flex items-center gap-3 ml-4">
            <span
              className={`font-medium capitalize ${getDifficultyColor(question.difficulty)}`}
            >
              {question.difficulty}
            </span>
            <div className="flex items-center gap-1">
              {question.submitted > 0 ? (
                <CheckCircle className="w-4 h-4 text-easy" />
              ) : (
                <XCircle className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">
                {question.submitted > 0 ? "Solved" : "Unsolved"}
              </span>
            </div>
          </div>
        </div>
        <div className="h-px bg-border" />
      </div>

      <div className="space-y-3">
        <p className="text-foreground leading-relaxed whitespace-pre-line">
          {question.description}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Examples</h2>
        <div className="space-y-4">
          {question.examples.map((example, index) => (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 space-y-2 font-mono text-sm"
            >
              <div>
                <span className="font-semibold text-foreground">Input:</span>{" "}
                <span className="text-muted-foreground">{example.input}</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">Output:</span>{" "}
                <span className="text-muted-foreground">{example.output}</span>
              </div>
              {example.explanation && (
                <div>
                  <span className="font-semibold text-foreground">
                    Explanation:
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {example.explanation}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Constraints</h2>
        <ul className="space-y-1 font-mono text-sm">
          {question.constraints.map((constraint, index) => (
            <li key={index} className="text-muted-foreground">
              • {constraint}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setShowTopics(!showTopics)}
          className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
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
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
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
          className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
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
              <li key={index} className="text-muted-foreground leading-relaxed">
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
