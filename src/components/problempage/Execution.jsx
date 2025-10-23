// components/Execution.jsx
import React, { useState } from "react";
import { Button } from "..";
import { useMutation } from "@tanstack/react-query";
import { codeRun, codeSubmit } from "@/api/services/coderunnerService";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ChevronUp, Loader2 } from "lucide-react";

const Execution = React.memo(
  ({
    id,
    langId,
    setOutput,
    setSubmissionOutput,
    pageType,
    setToggleOutput,
    setToggleSubmission,
  }) => {
    const user = useSelector((state) => state.auth.userData);
    const [busy, setBusy] = useState(false);
    const [runPending, setRunPending] = useState(false);
    const [submitPending, setSubmitPending] = useState(false);

    const { mutateAsync: runCode } = useMutation({
      mutationFn: ({ questionUId, language_id, source_code }) =>
        codeRun({ questionUId, language_id, source_code }),
      retry: false,
    });

    const { mutateAsync: submitCode } = useMutation({
      mutationFn: ({ questionUId, language_id, source_code }) =>
        codeSubmit({ questionUId, language_id, source_code }),
      retry: false,
    });

    const extractPayload = (raw) => {
      if (!raw) return null;
      if (raw?.data && raw.data?.data) return raw.data.data;
      if (raw?.data) return raw.data;
      return raw;
    };

    const getSourceFromLocal = () => {
      try {
        // console.log("this is page type : ", pageType);
        const item = localStorage.getItem(
          `${pageType}:uid:${id.toString()}:lang:${langId}`
        );
        return item ? JSON.parse(item) : null;
      } catch (err) {
        return null;
      }
    };

    const handleRun = async () => {
      const source_code = getSourceFromLocal();
      // console.log("before running", id, langId, source_code);
      if (!id || !langId || !source_code) return toast.error("Missing fields");
      // console.log("running -> ", source_code);
      try {
        setRunPending(true);
        const raw = await runCode({
          questionUId: id,
          language_id: langId,
          source_code,
        });

        const payload = extractPayload(raw);
        const output = payload?.output ?? payload;
        if (!output) {
          setOutput(null);
          setToggleOutput(true);
          return toast.error("No output returned from server");
        }

        setOutput(output);
        setToggleOutput(true);
        toast.success("Code executed successfully ✅");
      } catch (err) {
        console.error("handleRun error:", err);
        toast.error(err?.message || "Execution error ❌");
      } finally {
        setRunPending(false);
      }
    };

    const handleSubmit = async () => {
      const source_code = getSourceFromLocal();
      if (!id || !langId || !source_code) return toast.error("Missing fields");

      try {
        setSubmitPending(true);
        const raw = await submitCode({
          questionUId: id,
          language_id: langId,
          source_code,
        });

        const payload = extractPayload(raw);
        const submit = payload?.submit ?? payload;
        if (!submit) {
          return toast.error("No submission result returned");
        }

        setSubmissionOutput(submit);
        setToggleSubmission(true);
        toast.success("Code submitted successfully ✅");
      } catch (err) {
        console.error("handleSubmit error:", err);
        toast.error(err?.message || "Submission error ❌");
      } finally {
        setSubmitPending(false);
      }
    };

    const disabled = runPending || submitPending || busy;

    return (
      <div className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800 py-2 px-3 flex justify-between items-center">
        {user ? (
          <>
            <div className="flex gap-3">
              <Button
                onClick={handleRun}
                disabled={disabled}
                className="px-5 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
              >
                {runPending ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" /> Running...
                  </>
                ) : (
                  "Run"
                )}
              </Button>

              <Button
                disabled={disabled}
                onClick={handleSubmit}
                className="px-5 py-2 cursor-pointer bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg shadow-green-600/30 transition-all"
              >
                {submitPending ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" /> Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>

            <div
              className="cursor-pointer flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors"
              onClick={() => setToggleOutput(true)}
            >
              <ChevronUp className="w-5 h-5" />
              <span className="text-sm font-medium">Show Output</span>
            </div>
          </>
        ) : (
          <div className="text-slate-400 text-sm italic">
            Please login to run or submit code
          </div>
        )}
      </div>
    );
  }
);

Execution.displayName = "Execution";
export default Execution;
