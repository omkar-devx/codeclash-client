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
      <div className="flex justify-between items-center px-3 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 py-2">
        <div className="flex items-center gap-2">
          <label
            htmlFor="language"
            className="text-sm font-medium text-slate-300"
          >
            Language:
          </label>
          <select
            id="language"
            value={langId}
            onChange={(e) => setLangId(Number(e.target.value))}
            className="border border-slate-700 bg-slate-800/50 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 cursor-pointer outline-none transition-all"
          >
            <option className="bg-blue-500" value={54}>
              C++
            </option>
            <option className="bg-blue-500" value={62}>
              Java
            </option>
            <option className="bg-blue-500" value={71}>
              Python
            </option>
          </select>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={handleCopy}
            className="p-2 cursor-pointer rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-blue-400"
            title="Copy Code"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleReset(langId, defaultCode)}
            className="p-2 cursor-pointer rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-blue-400"
            title="Reset Code"
          >
            <Repeat2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
);

EditorTools.displayName = "EditorTools";
export default EditorTools;
