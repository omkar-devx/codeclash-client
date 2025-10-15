// FILE: SoloProblemPage.refactor.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { questionById } from "@/api/services/questionService";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { CodeEditor, Description, Execution, Output } from "@/components";
import SubmissionResult from "@/components/problempage/SubmissionResult";
import EditorTools from "@/components/problempage/EditorTools";

const SoloProblemPage = () => {
  const { id } = useParams({ from: "/problemset/question/$id/$title" });
  const pageType = "solo";
  const queryClient = useQueryClient();
  const previousCode = localStorage.getItem(
    `${pageType}:uid:${id.toString()}:lang:54`
  );
  const [output, setOutput] = useState([]);
  const [submissionOutput, setSubmissionOutput] = useState(null);
  const [langId, setLangId] = useState(54);
  const [code, setCode] = useState(
    previousCode ? JSON.parse(previousCode) : ""
  );
  const [toggleOutput, setToggleOutput] = useState(false);
  const [toggleSubmission, setToggleSubmission] = useState(false);
  const [defaultCode, setDefaultCode] = useState("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["problemset", id],
    queryFn: () => questionById(id),
    staleTime: 10 * 60 * 1000,
  });

  const memoizedSetCode = useCallback((val) => setCode(val), []);

  const saveToLocalStorage = useCallback(() => {
    if (id && code) {
      localStorage.setItem(
        `${pageType}:uid:${id.toString()}:lang:${langId}`,
        JSON.stringify(code)
      );
    }
  }, [id, code, langId]);

  useEffect(() => {
    if (data?.defaultCode) {
      setDefaultCode(data.defaultCode);
    }
  }, [data]);

  useEffect(() => {
    if (defaultCode && code === "") {
      setCode(getCodeByLang(langId, defaultCode));
    }
  }, [defaultCode]);

  useEffect(() => {
    const key = `${pageType}:uid:${id?.toString()}:lang:${langId}`;

    let raw = null;
    try {
      raw = localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage.getItem failed", e);
      raw = null;
    }

    let storedCode = null;
    try {
      storedCode = raw !== null ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("JSON.parse failed, fallback to raw string", e);
      storedCode = raw;
    }

    const hasStored =
      storedCode !== null &&
      storedCode !== undefined &&
      !(typeof storedCode === "string" && storedCode.trim() === "");

    if (hasStored) {
      setCode(storedCode);
      return;
    }

    if (defaultCode) {
      setCode(getCodeByLang(langId, defaultCode) || "");
      return;
    }

    setCode("");
  }, [langId, id, defaultCode, pageType, defaultCode]);

  useEffect(() => {
    queryClient.refetchQueries({
      queryKey: ["problemset", id],
      type: "all",
    });
  }, [id, queryClient]);

  const getCodeByLang = (langId, defaultCode) => {
    switch (Number(langId)) {
      case 54:
        return defaultCode.cpp;
      case 62:
        return defaultCode.java;
      case 71:
        return defaultCode.python;
      default:
        return "";
    }
  };

  if (isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <LoaderCircle className="animate-spin w-12 h-12 text-blue-600" />
      </div>
    );
  }

  if (isError) {
    toast.error(error?.message || "Something went wrong!");
    return <p className="p-4 text-red-600">Error loading problem.</p>;
  }

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-4 px-3 py-2 h-full min-h-0">
      {/* LEFT: Problem description */}
      <div className="h-full overflow-auto min-h-0 bg-white rounded-lg shadow-sm border border-slate-100 p-6">
        <div className="prose max-w-none text-slate-700">
          <Description question={data} />
        </div>
      </div>

      {/* RIGHT: Editor + tools + execution + outputs */}
      <div className="h-full flex flex-col min-h-0 bg-white rounded-lg shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Editor tools (kept in place) */}
        <div className="sticky top-0 z-10 bg-white border-b px-1 py-2">
          <EditorTools
            defaultCode={defaultCode}
            code={code}
            setCode={setCode}
            langId={langId}
            setLangId={setLangId}
          />
        </div>

        {/* Code editor area */}
        <div className="flex-1 overflow-auto min-h-0 p-2">
          {/* Make this container relative so overlays inside it match the editor width */}
          <div className="h-full rounded-md overflow-hidden border border-slate-100 relative">
            <CodeEditor
              id={data.uid}
              langId={langId}
              code={code}
              memoizedSetCode={memoizedSetCode}
              pageType={pageType}
            />

            {/* Output & SubmissionResult moved INSIDE the editor container so their width exactly matches the editor */}
            <div
              className={`absolute left-0 right-0 bottom-0 z-20 max-h-60 flex justify-center transition-all ${
                toggleOutput || toggleSubmission
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {/* overlay area matches editor width and is half the editor height */}
              <div className="w-full h-1/2 flex gap-1">
                <div
                  className={`${toggleOutput ? "block" : "hidden"} w-full h-full bg-white rounded-md border border-slate-200 shadow p-4 overflow-auto`}
                >
                  <Output
                    toggleOutput={toggleOutput}
                    setToggleOutput={setToggleOutput}
                    outputs={output}
                  />
                </div>

                <div
                  className={`${toggleSubmission ? "block" : "hidden"} w-full h-full bg-white rounded-md border border-slate-200 shadow p-4 overflow-auto`}
                >
                  <SubmissionResult
                    toggleSubmission={toggleSubmission}
                    setToggleSubmission={setToggleSubmission}
                    setSubmissionOutput={setSubmissionOutput}
                    submissionOutput={submissionOutput}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Execution controls */}
        <div className="flex-shrink-0 border-t bg-slate-50 px-2 py-1">
          <Execution
            id={data.uid}
            langId={langId}
            setOutput={setOutput}
            setSubmissionOutput={setSubmissionOutput}
            saveToLocalStorage={saveToLocalStorage}
            pageType={pageType}
            setToggleOutput={setToggleOutput}
            setToggleSubmission={setToggleSubmission}
          />
        </div>
      </div>
    </div>
  );
};

export default SoloProblemPage;
