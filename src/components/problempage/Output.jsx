import React from "react";
import { X } from "lucide-react";

const OutputCard = ({ output, index, onClose }) => {
  const [showMore, setShowMore] = React.useState(false);

  const verdict = output?.verdict || output?.status?.description || "Unknown";
  const isAccepted = verdict === "Accepted";
  const isCompilationError = output?.status?.id === 6;
  const isTimeLimit = output?.status?.id === 5;
  const isRuntimeError = output?.status?.id === 7;
  const isWrongAnswer = verdict === "Wrong Answer";

  const compileError = output?.compile_output || "";
  const runtimeError = output?.stderr || "";

  const showExpected =
    Array.isArray(output?.expected_output) && output.expected_output.length > 0
      ? output.expected_output.join("\n")
      : (output?.expected_output ?? "—");

  return (
    <div className="border border-slate-700 rounded-lg p-4 mb-3 bg-slate-800/50 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-slate-300">
          Test Case {index + 1}
        </span>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-lg ${
            isAccepted
              ? "bg-green-500/20 text-green-400"
              : isCompilationError
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
          }`}
        >
          {verdict}
        </span>
      </div>

      {isCompilationError ? (
        <div className="mb-2">
          <p className="text-sm font-medium text-slate-300">
            Compilation Error:
          </p>
          <pre className="bg-slate-900/50 border border-slate-700 p-2 rounded-lg text-sm text-red-400 whitespace-pre-wrap max-h-36 overflow-auto">
            {showMore
              ? compileError || "Unknown error"
              : (compileError || "Unknown error").slice(0, 300)}
          </pre>
          {compileError && compileError.length > 300 && (
            <button
              className="text-blue-400 text-xs mt-1 hover:text-blue-300 transition-colors"
              onClick={() => setShowMore((s) => !s)}
            >
              {showMore ? "Show Less ▲" : "Show More ▼"}
            </button>
          )}
        </div>
      ) : isRuntimeError ? (
        <div className="mb-2">
          <p className="text-sm font-medium text-slate-300">Runtime Error:</p>
          <pre className="bg-slate-900/50 border border-slate-700 p-2 rounded-lg text-sm text-red-400 whitespace-pre-wrap max-h-36 overflow-auto">
            {showMore
              ? runtimeError || "Unknown runtime error"
              : (runtimeError || "Unknown runtime error").slice(0, 300)}
          </pre>
          {runtimeError && runtimeError.length > 300 && (
            <button
              className="text-blue-400 text-xs mt-1 hover:text-blue-300 transition-colors"
              onClick={() => setShowMore((s) => !s)}
            >
              {showMore ? "Show Less ▲" : "Show More ▼"}
            </button>
          )}
        </div>
      ) : isTimeLimit ? (
        <p className="text-sm font-medium text-red-400 mb-2">
          ⏳ Time Limit Exceeded
        </p>
      ) : (
        <>
          <div className="mb-2">
            <p className="text-sm font-medium text-slate-300">Input:</p>
            <pre className="bg-slate-900/50 border border-slate-700 p-2 rounded-lg text-sm text-slate-300 whitespace-pre-wrap">
              {output?.stdin ?? "—"}
            </pre>
          </div>

          <div className="mb-2">
            <p className="text-sm font-medium text-slate-300">Your Output:</p>
            <pre className="bg-slate-900/50 border border-slate-700 p-2 rounded-lg text-sm text-slate-300 whitespace-pre-wrap">
              {output?.stdout ?? "—"}
            </pre>
          </div>

          <div className="mb-2">
            <p className="text-sm font-medium text-slate-300">
              Expected Output:
            </p>
            <pre className="bg-slate-900/50 border border-slate-700 p-2 rounded-lg text-sm text-slate-300 whitespace-pre-wrap">
              {showExpected}
            </pre>
          </div>

          {isWrongAnswer && (
            <div className="mb-2 text-sm text-yellow-400">
              <strong>Note:</strong> output did not match expected value.
            </div>
          )}
        </>
      )}

      <div className="flex text-xs text-slate-500 mt-2 space-x-4">
        <span>Time: {output?.time ?? "—"}s</span>
        <span>Memory: {output?.memory ?? "—"} KB</span>
        <span>Lang: {output?.language?.name ?? "—"}</span>
      </div>
    </div>
  );
};

const Output = React.memo(({ toggleOutput, setToggleOutput, outputs }) => {
  if (!toggleOutput) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-lg w-full max-h-[50vh] overflow-y-auto shadow-xl relative p-4 z-20">
      <div
        className="absolute right-2 top-2 cursor-pointer bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-full p-1 transition-colors"
        onClick={() => setToggleOutput(false)}
        title="Close"
      >
        <X className="text-red-400 font-bold w-4 h-4" />
      </div>

      <h2 className="text-lg font-semibold mb-4 text-white">
        Test Case Results
      </h2>

      {outputs && outputs.length > 0 ? (
        outputs.map((output, index) => (
          <OutputCard key={index} output={output} index={index} />
        ))
      ) : (
        <p className="font-medium text-slate-400">No Output</p>
      )}
    </div>
  );
});

Output.displayName = "Output";
export default Output;
