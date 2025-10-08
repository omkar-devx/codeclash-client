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
    `${pageType}:uid:54:${id.toString()}`
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
        `${pageType}:uid:${langId}:${id.toString()}`,
        JSON.stringify(code)
      );
    }
  }, [id, code]);

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
    const key = `${pageType}:uid:${langId}:${id?.toString()}`;

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

    console.log({ key, raw, storedCode, hasStored, defaultCode });

    if (hasStored) {
      setCode(storedCode);
      console.log("Loaded stored code");
      return;
    }

    if (defaultCode) {
      // console.log("this is default code : ", defaultCode.python);
      // console.log(getCodeByLang(langId, defaultCode));
      setCode(getCodeByLang(langId, defaultCode) || "");
      console.log("Loaded default code for language");
      return;
    }

    // fallback to empty
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
      <>
        <LoaderCircle />
      </>
    );
  }

  if (isError) {
    toast.error(error?.message || "Something went wrong!");
    return <p>Error loading problem.</p>;
  }

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-2 px-2 h-full min-h-0">
      <div className="h-full overflow-auto min-h-0 border-1 border-red-600">
        <Description question={data} />
      </div>

      <div className="h-full flex flex-col min-h-0 border-1 border-blue-700 relative">
        <EditorTools
          defaultCode={defaultCode}
          code={code}
          setCode={setCode}
          langId={langId}
          setLangId={setLangId}
        />
        <div className="flex-1 overflow-auto min-h-0">
          <CodeEditor
            id={data.uid}
            langId={langId}
            code={code}
            memoizedSetCode={memoizedSetCode}
            pageType={pageType}
          />
        </div>
        <div className=" flex-shrink-0">
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
        <div className="absolute w-full bottom-0 overflow-auto">
          <Output
            toggleOutput={toggleOutput}
            setToggleOutput={setToggleOutput}
            outputs={output}
          />
        </div>
        <div className="absolute w-full bottom-0 overflow-auto">
          <SubmissionResult
            toggleSubmission={toggleSubmission}
            setToggleSubmission={setToggleSubmission}
            setSubmissionOutput={setSubmissionOutput}
            submissionOutput={submissionOutput}
          />
        </div>
      </div>
    </div>
  );
};

export default SoloProblemPage;
