import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSubmissionById } from "@/api/services/questionService";
import {
  LoaderCircle,
  CheckCircle,
  XCircle,
  Timer,
  MemoryStick,
  Code,
  AlertCircle,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SubmissionModal = ({
  sid = "68e0da2aadc1771a1a398f3b",
  isOpen,
  onClose,
}) => {
  const {
    data: submissionData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["submission", sid],
    queryFn: ({ queryKey }) => getSubmissionById(queryKey[1]),
    enabled: !!sid && isOpen,
  });

  useEffect(() => {
    if (submissionData) {
      // console.log("Submission Data -> ", submissionData);
    }
  }, [submissionData]);

  if (!isOpen) return null;

  const sub = submissionData?.data || submissionData;
  const isPassed = sub?.status === "passed";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <style>{`
          .modal-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .modal-scrollbar::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.3);
            border-radius: 4px;
          }
          .modal-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.3);
            border-radius: 4px;
          }
          .modal-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.5);
          }

          * {
            cursor: default;
          }
          button, [role="button"], .cursor-pointer {
            cursor: pointer;
          }
          input, textarea, select {
            cursor: text;
          }
          a {
            cursor: pointer;
          }
        `}</style>

        <div className="w-full max-w-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl my-8">
          <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Submission Details
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Review your code submission and results
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="modal-scrollbar overflow-y-auto max-h-[calc(100vh-200px)]">
            {isPending ? (
              <div className="flex justify-center items-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-600 blur-lg opacity-50 rounded-full"></div>
                    <LoaderCircle className="relative w-10 h-10 animate-spin text-blue-400" />
                  </div>
                  <p className="text-slate-400">
                    Loading submission details...
                  </p>
                </div>
              </div>
            ) : isError ? (
              <div className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 font-semibold mb-2">
                  Error Loading Submission
                </p>
                <p className="text-slate-400">
                  {error?.message || "Unknown error occurred"}
                </p>
              </div>
            ) : !sub ? (
              <div className="p-8 text-center">
                <p className="text-slate-400">No submission data available.</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status</span>
                  <Badge
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border ${
                      isPassed
                        ? "bg-green-600/20 border-green-600/50 text-green-400"
                        : "bg-red-600/20 border-red-600/50 text-red-400"
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span className="capitalize">{sub.status}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-3">
                    <p className="text-slate-500 text-xs mb-1">Question UID</p>
                    <p className="text-lg font-bold text-white">
                      {sub.questionUId}
                    </p>
                  </div>

                  <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-3">
                    <p className="text-slate-500 text-xs mb-1">User ID</p>
                    <p className="text-sm font-semibold text-slate-300 truncate">
                      {sub.userId}
                    </p>
                  </div>

                  <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Timer className="w-3.5 h-3.5 text-blue-400" />
                      <p className="text-slate-500 text-xs">Execution Time</p>
                    </div>
                    <p className="text-lg font-bold text-blue-400">
                      {sub.time ?? "-"}s
                    </p>
                  </div>

                  <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MemoryStick className="w-3.5 h-3.5 text-purple-400" />
                      <p className="text-slate-500 text-xs">Memory</p>
                    </div>
                    <p className="text-lg font-bold text-purple-400">
                      {sub.memory ?? "-"}KB
                    </p>
                  </div>

                  <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-3">
                    <p className="text-slate-500 text-xs mb-1">Test Cases</p>
                    <p className="text-lg font-bold">
                      <span className="text-green-400">
                        {sub.testcase_passed}
                      </span>
                      <span className="text-slate-500">
                        /{sub.testcase_count}
                      </span>
                    </p>
                  </div>

                  <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-3">
                    <p className="text-slate-500 text-xs mb-1">Submitted</p>
                    <p className="text-xs font-semibold text-slate-300">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-4 h-4 text-blue-400" />
                    <h3 className="font-bold text-white">Source Code</h3>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                    <pre className="text-xs text-slate-300 p-4 font-mono whitespace-pre-wrap modal-scrollbar max-h-48 overflow-auto break-words">
                      {sub.source_code}
                    </pre>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-white">
                    Test Case Information
                  </h3>

                  {sub.failedTestCase && (
                    <div>
                      <p className="text-slate-500 text-xs mb-1">
                        Failed Test Case
                      </p>
                      <pre className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-300 text-xs whitespace-pre-wrap modal-scrollbar max-h-20 overflow-auto">
                        {sub.failedTestCase}
                      </pre>
                    </div>
                  )}

                  {sub.expected_output && (
                    <div>
                      <p className="text-slate-500 text-xs mb-1">
                        Expected Output
                      </p>
                      <pre className="bg-slate-950 border border-green-800/30 p-3 rounded-lg text-green-400 text-xs whitespace-pre-wrap modal-scrollbar max-h-20 overflow-auto">
                        {sub.expected_output}
                      </pre>
                    </div>
                  )}

                  {sub.stdout && (
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Your Output</p>
                      <pre className="bg-slate-950 border border-yellow-800/30 p-3 rounded-lg text-yellow-400 text-xs whitespace-pre-wrap modal-scrollbar max-h-20 overflow-auto">
                        {sub.stdout}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-white">Result</h3>

                  <div
                    className={`p-3 rounded-lg border text-sm ${
                      isPassed
                        ? "border-green-800/30 bg-green-950/20 text-green-400"
                        : "border-red-800/30 bg-red-950/20 text-red-400"
                    } font-semibold`}
                  >
                    {sub.message || "No message"}
                  </div>

                  {sub.compile_output && (
                    <div>
                      <p className="text-slate-500 text-xs mb-1">
                        Compiler Output
                      </p>
                      <pre className="bg-slate-950 border border-red-800/30 p-3 rounded-lg text-red-400 text-xs whitespace-pre-wrap modal-scrollbar max-h-24 overflow-auto">
                        {sub.compile_output}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-white font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmissionModal;
