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
    <div className="border rounded-md p-4 mb-3 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">Test Case {index + 1}</span>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded ${
            isAccepted
              ? "bg-green-100 text-green-700"
              : isCompilationError
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {verdict}
        </span>
      </div>

      {isCompilationError ? (
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-600">
            Compilation Error:
          </p>
          <pre className="bg-gray-100 p-2 rounded text-sm text-red-700 whitespace-pre-wrap max-h-36 overflow-auto">
            {showMore
              ? compileError || "Unknown error"
              : (compileError || "Unknown error").slice(0, 300)}
          </pre>
          {compileError && compileError.length > 300 && (
            <button
              className="text-blue-600 text-xs mt-1"
              onClick={() => setShowMore((s) => !s)}
            >
              {showMore ? "Show Less ▲" : "Show More ▼"}
            </button>
          )}
        </div>
      ) : isRuntimeError ? (
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-600">Runtime Error:</p>
          <pre className="bg-gray-100 p-2 rounded text-sm text-red-700 whitespace-pre-wrap max-h-36 overflow-auto">
            {showMore
              ? runtimeError || "Unknown runtime error"
              : (runtimeError || "Unknown runtime error").slice(0, 300)}
          </pre>
          {runtimeError && runtimeError.length > 300 && (
            <button
              className="text-blue-600 text-xs mt-1"
              onClick={() => setShowMore((s) => !s)}
            >
              {showMore ? "Show Less ▲" : "Show More ▼"}
            </button>
          )}
        </div>
      ) : isTimeLimit ? (
        <p className="text-sm font-medium text-red-600 mb-2">
          ⏳ Time Limit Exceeded
        </p>
      ) : (
        <>
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-600">Input:</p>
            <pre className="bg-gray-100 p-2 rounded text-sm text-gray-800 whitespace-pre-wrap">
              {output?.stdin ?? "—"}
            </pre>
          </div>

          <div className="mb-2">
            <p className="text-sm font-medium text-gray-600">Your Output:</p>
            <pre className="bg-gray-100 p-2 rounded text-sm text-gray-800 whitespace-pre-wrap">
              {output?.stdout ?? "—"}
            </pre>
          </div>

          <div className="mb-2">
            <p className="text-sm font-medium text-gray-600">
              Expected Output:
            </p>
            <pre className="bg-gray-100 p-2 rounded text-sm text-gray-800 whitespace-pre-wrap">
              {showExpected}
            </pre>
          </div>

          {isWrongAnswer && (
            <div className="mb-2 text-sm text-red-600">
              <strong>Note:</strong> output did not match expected value.
            </div>
          )}
        </>
      )}

      <div className="flex text-xs text-gray-500 mt-2 space-x-4">
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
    <div className="bg-gray-50 border border-gray-300 rounded-md w-full max-h-[70vh] overflow-y-auto shadow-md relative p-4 z-20">
      <div
        className="absolute right-2 top-2 cursor-pointer bg-red-100 hover:bg-red-200 border border-red-400 rounded-full p-1"
        onClick={() => setToggleOutput(false)}
        title="Close"
      >
        <X className="text-red-700 font-bold w-4 h-4" />
      </div>

      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Test Case Results
      </h2>

      {outputs && outputs.length > 0 ? (
        outputs.map((output, index) => (
          <OutputCard key={index} output={output} index={index} />
        ))
      ) : (
        <p className="font-medium text-gray-600">No Output</p>
      )}
    </div>
  );
});

export default Output;
