import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { tomorrowNightBlue } from "@uiw/codemirror-theme-tomorrow-night-blue";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { yCollab } from "y-codemirror.next";
import { EditorView } from "@codemirror/view";
import EditorTools from "../EditorTools";
import { Execution, Output } from "@/components";
import SubmissionResult from "../SubmissionResult";

function getLanguageExtension(language) {
  switch ((language || "").toLowerCase()) {
    case "cpp":
      return cpp();
    case "python":
      return python();
    case "java":
      return java();
    default:
      return cpp();
  }
}

const getCodeByLang = (langId, defaultCode) => {
  switch (Number(langId)) {
    case 54:
      return defaultCode?.cpp || "";
    case 62:
      return defaultCode?.java || "";
    case 71:
      return defaultCode?.python || "";
    default:
      return "";
  }
};

const getLanguageNameById = (langId) => {
  switch (Number(langId)) {
    case 54:
      return "cpp";
    case 62:
      return "java";
    case 71:
      return "python";
    default:
      return "cpp";
  }
};

const CollaborativeEditor = React.memo(
  ({ roomId, userId, id, language, pageType, defaultCode = {} }) => {
    const [ready, setReady] = useState(false);
    const ydocRef = useRef(null);
    const providerRef = useRef(null);
    const yTextRef = useRef(null);
    const saveTimeoutRef = useRef(null);

    const [langId, setLangId] = useState(54);
    const [code, setCode] = useState(null);
    const [submissionOutput, setSubmissionOutput] = useState(null);
    const [toggleOutput, setToggleOutput] = useState(false);
    const [toggleSubmission, setToggleSubmission] = useState(false);
    const [output, setOutput] = useState([]);

    useEffect(() => {
      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider("/yjs", `room-${roomId}`, ydoc);
      const yText = ydoc.getText(`code-${userId}-${id}`);

      ydocRef.current = ydoc;
      providerRef.current = provider;
      yTextRef.current = yText;

      provider.awareness.setLocalStateField("user", {
        id: userId,
        name: userId,
        color: "#2563eb",
      });

      const scheduleSave = () => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
          try {
            const key = `${pageType}:uid:${id}:lang:${langId}`;
            localStorage.setItem(key, JSON.stringify(yText.toString()));
          } catch (err) {
            console.warn("LocalStorage write failed:", err);
          } finally {
            saveTimeoutRef.current = null;
          }
        }, 500);
      };

      yText.observe(scheduleSave);

      setReady(true);

      return () => {
        provider.destroy();
        ydoc.destroy();
      };
    }, [id, userId, roomId, pageType, langId]);

    if (
      !ready ||
      !yTextRef.current ||
      !providerRef.current ||
      !ydocRef.current
    ) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-400">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading editor...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col min-h-0 relative bg-slate-950">
        <style>{`
          .codemirror-container::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .codemirror-container::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.3);
            border-radius: 4px;
          }
          .codemirror-container::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.3);
            border-radius: 4px;
          }
          .codemirror-container::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.5);
          }
          
          /* CodeMirror custom scrollbar */
          .cm-gutters {
            background: #0f172a !important;
            border-right: 1px solid #334155 !important;
          }
          .cm-content {
            background: #0f172a !important;
          }
          .cm-line {
            color: #cbd5e1 !important;
          }
          
          /* Custom Cursor */
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

        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full min-h-0 codemirror-container bg-slate-950 border border-slate-800 rounded-t-2xl">
                <ReactCodeMirror
                  height="100%"
                  className="h-full"
                  theme={tomorrowNightBlue}
                  extensions={[
                    getLanguageExtension(getLanguageNameById(langId)),
                    yCollab(yTextRef.current, providerRef.current?.awareness, {
                      clientID: ydocRef.current?.clientID,
                    }),
                    EditorView.editable.of(true),
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 bg-slate-900/50 backdrop-blur-sm border-t border-slate-800 rounded-b-2xl">
          <div className="p-2">
            <Execution
              id={id}
              langId={langId}
              setOutput={setOutput}
              setSubmissionOutput={setSubmissionOutput}
              pageType={pageType}
              setToggleOutput={setToggleOutput}
              setToggleSubmission={setToggleSubmission}
            />
          </div>
        </div>

        <div className="absolute max-h-70 left-0 right-0 bottom-0 pointer-events-none">
          <div className="pointer-events-auto">
            <Output
              toggleOutput={toggleOutput}
              setToggleOutput={setToggleOutput}
              outputs={output}
            />
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
  }
);

CollaborativeEditor.displayName = "CollaborativeEditor";
export default CollaborativeEditor;
