import React, { useEffect, useState } from "react";
import { Button } from "..";
import { useMutation } from "@tanstack/react-query";
import { codeRun } from "@/api/services/coderunnerService";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Execution = React.memo(
  ({ id, langId, setOutput, saveToLocalStorage }) => {
    const user = useSelector((state) => state.auth.userData);
    console.log("Execution Rendering");
    const { mutate: runCode, isPending } = useMutation({
      mutationFn: ({ questionUId, language_id, source_code }) =>
        codeRun({ questionUId, language_id, source_code }),
      onSuccess: (res) => {
        toast.success("code run successfull");
        console.log(res.output);
        setOutput(res.output);
      },
      onError: (error) => {
        console.log(error.message || "something went wrong");
      },
    });

    const handleRun = () => {
      saveToLocalStorage();
      const source_code = JSON.parse(
        localStorage.getItem(`solo:uid:${id.toString()}`)
      );
      console.log({ questionUId: id, language_id: langId, source_code });
      runCode({ questionUId: id, language_id: langId, source_code });
    };

    if (isPending) {
      return <p>loading....</p>;
    }

    return (
      <div>
        {user ? (
          <div>
            <Button onClick={handleRun}>run</Button>
            <Button>submit</Button>
          </div>
        ) : (
          <div>please login to run or submit</div>
        )}
      </div>
    );
  }
);
export default Execution;
