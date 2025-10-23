import React, { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSolutionById } from "@/api/services/questionService";
import { Loader2Icon, Code, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

const SolutionPage = () => {
  const { id } = useParams({ from: "/solution/$id" });
  const [activeTab, setActiveTab] = useState("cpp");
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["solution", id],
    queryFn: ({ queryKey }) => getSolutionById(queryKey[1]),
  });

  const handleCopy = () => {
    if (data?.solution?.[activeTab]) {
      navigator.clipboard.writeText(data.solution[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Code Copied ✅");
    }
  };

  const languages = [
    { key: "cpp", label: "C++", color: "blue" },
    { key: "java", label: "Java", color: "orange" },
    { key: "python", label: "Python", color: "green" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="animate-spin text-blue-400 w-12 h-12" />
          <p className="text-slate-400">Loading solution...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Failed to load solution</p>
          <p className="text-slate-500 text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="fixed inset-0 w-screen h-screen bg-slate-950 overflow-hidden pointer-events-none -z-50">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-slate-950 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <Code className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Solution
              </h1>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">
              Choose a language to view the solution
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                <div className="flex gap-2 sm:gap-3 overflow-x-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.key}
                      onClick={() => setActiveTab(lang.key)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                        activeTab === lang.key
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                          : "bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="ml-4 p-2 cursor-pointer rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 sm:p-6 overflow-x-auto">
                <code className="text-sm sm:text-base text-slate-300 font-mono leading-relaxed whitespace-pre">
                  {data.solution?.[activeTab] || "No solution available"}
                </code>
              </pre>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl p-4">
              <p className="text-slate-500 text-sm mb-1">Solution ID</p>
              <p className="text-slate-200 font-mono text-sm">
                {data._id || "N/A"}
              </p>
            </div>
            <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl p-4">
              <p className="text-slate-500 text-sm mb-1">Created At</p>
              <p className="text-slate-200 text-sm">
                {data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionPage;
