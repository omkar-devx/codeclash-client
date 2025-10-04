import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { questionById } from "@/api/services/questionService";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { CodeEditor, Description, Execution, Output } from "@/components";
import SubmissionResult from "@/components/problempage/SubmissionResult";

const SoloProblemPage = () => {
  const { id } = useParams({ from: "/problemset/question/$id/$title" });
  const pageType = "solo";
  const queryClient = useQueryClient();
  const previousCode = localStorage.getItem(`${pageType}:uid:${id.toString()}`);
  const [output, setOutput] = useState([]);
  const [submissionOutput, setSubmissionOutput] = useState(null);
  const [lang, setLang] = useState("cpp");
  const [code, setCode] = useState(
    previousCode ? JSON.parse(previousCode) : ""
  );
  const [toggleOutput, setToggleOutput] = useState(false);
  const [toggleSubmission, setToggleSubmission] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["problemset", id],
    queryFn: () => questionById(id),
    staleTime: 10 * 60 * 1000,
  });

  const memoizedSetCode = useCallback((val) => setCode(val), []);

  const saveToLocalStorage = useCallback(() => {
    if (id && code) {
      // console.log("main", code);
      localStorage.setItem(
        `${pageType}:uid:${id.toString()}`,
        JSON.stringify(code)
      );
    }
  }, [id, code]);

  useEffect(() => {
    queryClient.refetchQueries({
      queryKey: ["problemset", id],
      type: "all",
    });
  }, [id, queryClient]);

  // console.log("rendering...");
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
        <div>language choose , copy, reset</div>
        <div className="flex-1 overflow-auto min-h-0">
          <CodeEditor
            id={data.uid}
            code={code}
            memoizedSetCode={memoizedSetCode}
            pageType={pageType}
          />
        </div>
        <div className=" flex-shrink-0">
          <Execution
            id={data.uid}
            langId={52}
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
