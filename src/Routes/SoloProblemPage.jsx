import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { questionById } from "@/api/services/questionService";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { CodeEditor, Description, Execution, Output } from "@/components";

const SoloProblemPage = () => {
  const { id } = useParams({ from: "/problemset/question/$id/$title" });
  const previousCode = localStorage.getItem(`solo:uid:${id.toString()}`);
  const [output, setOutput] = useState([]);
  const queryClient = useQueryClient();
  const [code, setCode] = useState(
    previousCode ? JSON.parse(previousCode) : ""
  );

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["problemset", id],
    queryFn: () => questionById(id),
    staleTime: 10 * 60 * 1000,
  });

  const memoizedSetCode = useCallback((val) => setCode(val), []);

  const saveToLocalStorage = useCallback(() => {
    if (id && code) {
      console.log("main", code);
      localStorage.setItem(`solo:uid:${id.toString()}`, JSON.stringify(code));
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
    <div>
      <div className="flex grow   px-4 py-5">
        <Description question={data} />
        <div>
          <CodeEditor
            id={data.uid}
            code={code}
            memoizedSetCode={memoizedSetCode}
          />
          <Execution
            id={data.uid}
            langId={52}
            setOutput={setOutput}
            saveToLocalStorage={saveToLocalStorage}
          />
        </div>
        <Output outputs={output} />
      </div>
    </div>
  );
};

export default SoloProblemPage;
