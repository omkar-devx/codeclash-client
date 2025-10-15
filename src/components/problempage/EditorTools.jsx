import { Copy, Repeat2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

const EditorTools = React.memo(
  ({ defaultCode = {}, code = "", setCode, langId, setLangId }) => {
    const handleCopy = () => {
      if (!code) {
        toast.error("Nothing to copy");
        return;
      }
      navigator.clipboard
        .writeText(code)
        .then(() => toast.success("Code Copied ✅"))
        .catch(() => toast.error("Copy failed"));
    };

    const handleReset = (langId, defaultCode) => {
      const resetCode = getCodeByLang(langId, defaultCode);
      if (typeof setCode === "function") {
        setCode(resetCode);
        toast.success("Reset to default");
      } else {
        toast.error("Reset failed — setCode not provided");
      }
    };

    const getCodeByLang = (langId, defaultCode) => {
      switch (Number(langId)) {
        case 54:
          return defaultCode?.cpp ?? "";
        case 62:
          return defaultCode?.java ?? "";
        case 71:
          return defaultCode?.python ?? "";
        default:
          return "";
      }
    };

    return (
      <div className="flex justify-between items-center px-2 bg-white shadow-md ">
        <div className="flex items-center gap-2">
          <label htmlFor="language" className="text-sm font-medium ">
            Language:
          </label>
          <select
            id="language"
            value={langId}
            onChange={(e) => setLangId(Number(e.target.value))} // coerce to Number
            className="border border-zinc-600 rounded-md px-3 py-1 text-sm focus:ring-2 cursor-pointer outline-none"
          >
            <option value={54}>C++</option>
            <option value={62}>Java</option>
            <option value={71}>Python</option>
          </select>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={handleCopy}
            className="p-2 rounded-md hover:bg-blue-300 transition-all duration-150 cursor-pointer"
            title="Copy Code"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleReset(langId, defaultCode)}
            className="p-2 rounded-md hover:bg-blue-300 transition-all duration-150 cursor-pointer"
            title="Reset Code"
          >
            <Repeat2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
);

export default EditorTools;
