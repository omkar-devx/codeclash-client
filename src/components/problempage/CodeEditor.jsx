import React, { useCallback, useRef, useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { tomorrowNightBlue } from "@uiw/codemirror-theme-tomorrow-night-blue";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

const CodeEditor = React.memo(({ id, code, memoizedSetCode }) => {
  const timerRef = useRef(null);
  console.log("Codeeditor Rerendering");
  const storeToLocalStorage = (id, val) => {
    const key = id.toString();
    console.log(key);
    // console.log(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  const debounceCode = useCallback(
    (val) => {
      memoizedSetCode(val);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        storeToLocalStorage(id, val);
      }, 2000);
    },
    [id, memoizedSetCode]
  );

  return (
    <ReactCodeMirror
      width="100%"
      minHeight="80vh"
      theme={tomorrowNightBlue}
      value={code}
      onChange={debounceCode}
      extensions={[cpp()]}
    />
  );
});

export default CodeEditor;
