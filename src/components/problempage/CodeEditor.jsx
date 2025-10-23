import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { tomorrowNightBlue } from "@uiw/codemirror-theme-tomorrow-night-blue";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

const CodeEditor = React.memo(
  ({ id, langId, code, memoizedSetCode, pageType }) => {
    const timerRef = useRef(null);

    const makeKey = useCallback(
      (lid) => `${pageType}:uid:${id?.toString()}:lang:${lid}`,
      [pageType, id]
    );

    const extensions = useMemo(() => {
      switch (langId) {
        case 54:
          return [cpp()];
        case 62:
          return [java()];
        case 71:
          return [python()];
        default:
          return [cpp()];
      }
    }, [langId]);

    const storeToLocalStorage = useCallback(
      (lid, val) => {
        try {
          const key = makeKey(lid);
          // console.log(key);
          localStorage.setItem(key, JSON.stringify(val));
        } catch (e) {
          console.warn("storeToLocalStorage failed", e);
        }
      },
      [makeKey]
    );

    const debounceCode = useCallback(
      (val) => {
        memoizedSetCode(val);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          storeToLocalStorage(langId, val);
        }, 800);
      },
      [memoizedSetCode, langId, storeToLocalStorage]
    );

    useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    return (
      <ReactCodeMirror
        key={`${id}-${langId}`}
        className="h-full w-full"
        height="100%"
        width="100%"
        theme={tomorrowNightBlue}
        value={code ?? ""}
        onChange={debounceCode}
        extensions={extensions}
      />
    );
  }
);

export default CodeEditor;
