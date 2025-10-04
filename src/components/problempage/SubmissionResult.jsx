import React from "react";
import { X } from "lucide-react";

export default function SubmissionResult({
  toggleSubmission,
  setToggleSubmission,
  setSubmissionOutput,
  submissionOutput,
}) {
  if (!toggleSubmission) return null;

  // Use submissionOutput or a sample fallback
  const submit = submissionOutput;
  //   || {
  //     questionUId: 1,
  //     testcase_count: 7,
  //     passed_count: 7,
  //     stdout: "1 2",
  //     status: "passed",
  //     compile_output: "",
  //     stderr: "",
  //     message: "Accepted",
  //     time: 0.003,
  //     memory: 1548,
  //   };

  const total = submit?.testcase_count ? submit.testcase_count : 0;
  const passed = submit?.testcase_passed ?? total;
  const percent = total === 0 ? 0 : Math.round((passed / total) * 100);

  // Generate test case statuses (pass/fail)
  const statuses = Array.from({ length: total }, (_, i) =>
    i < passed ? "pass" : "fail"
  );

  return (
    <div className="max-w-2xl mx-auto p-4 max-h-80 overflow-auto space-y-4 bg-white shadow rounded-md relative">
      <div
        className="absolute top-2 right-2 cursor-pointer p-1 rounded-full bg-red-100 hover:bg-red-200 border border-red-400"
        onClick={() => setToggleSubmission(false)}
      >
        <X className="w-4 h-4 text-red-700" />
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">Submission Result</h2>
          <p className="text-sm text-gray-500">
            Question UID: {submit?.questionUId}
          </p>
        </div>
        <div className="text-right px-7">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              submit?.message?.toLowerCase().includes("accept")
                ? "bg-green-100 text-green-800"
                : submit?.compile_output
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {submit?.message}
          </span>
          <div className="text-xs text-gray-500 mt-1">
            Time: {submit?.time}s
          </div>
          <div className="text-xs text-gray-500">
            Memory: {submit?.memory} KB
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm font-medium">
          <span>Testcases Passed</span>
          <span>
            {passed}/{total} ({percent}%)
          </span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-4 rounded"
            style={{
              width: `${percent}%`,
              backgroundColor: percent === 100 ? "#16a34a" : "#4f46e5",
            }}
          />
        </div>
      </div>

      <div>
        <div className="text-sm font-medium mb-1">Testcase Results</div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s, i) => (
            <div
              key={i}
              className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded ${
                s === "pass"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Green = passed, Red = failed
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <div className="text-sm font-medium">Stdout</div>
          <pre className="bg-gray-50 p-2 rounded text-sm text-gray-800 whitespace-pre-wrap">
            {submit?.stdout || "—"}
          </pre>
        </div>

        {submit?.compile_output && (
          <div>
            <div className="text-sm font-medium text-gray-700">
              Compilation Error
            </div>
            <pre className="bg-gray-50 p-2 rounded text-sm text-red-700 whitespace-pre-wrap">
              {submit?.compile_output}
            </pre>
          </div>
        )}

        {submit?.stderr && (
          <div>
            <div className="text-sm font-medium text-gray-700">
              Runtime Error / Stderr
            </div>
            <pre className="bg-gray-50 p-2 rounded text-sm text-red-700 whitespace-pre-wrap">
              {submit?.stderr}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
