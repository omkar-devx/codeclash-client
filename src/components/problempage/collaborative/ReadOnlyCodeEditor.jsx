import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { tomorrowNightBlue } from "@uiw/codemirror-theme-tomorrow-night-blue";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { EditorView } from "@codemirror/view";
import { yCollab } from "y-codemirror.next";

function getLanguageExtension(language) {
  switch ((language || "").toLowerCase()) {
    case "cpp":
    case "c++":
      return cpp();
    case "java":
      return java();
    case "python":
      return python();
    default:
      return cpp();
  }
}

const ReadOnlyCodeEditor = React.memo(
  ({ roomId, id, language, targetUserId }) => {
    const [ready, setReady] = useState(false);
    const ydocRef = useRef(null);
    const providerRef = useRef(null);
    const yTextRef = useRef(null);

    useEffect(() => {
      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider("/yjs", `room-${roomId}`, ydoc);
      const yText = ydoc.getText(`code-${targetUserId}-${id}`);

      ydocRef.current = ydoc;
      providerRef.current = provider;
      yTextRef.current = yText;

      //   provider.awareness.setLocalStateField("user", {
      //     color: "#2196f3",
      //   });

      setReady(true);

      // provider.on("sync", (isSynced) => {
      //   if (isSynced) {
      //     ydocRef.current = ydoc;
      //     providerRef.current = provider;
      //     yTextRef.current = yText;
      //     setReady(true); // only show editor once synced
      //   }
      // });

      return () => {
        provider.destroy();
        ydoc.destroy();
      };
    }, [roomId, targetUserId]);

    if (
      !ready ||
      !yTextRef.current ||
      !providerRef.current ||
      !ydocRef.current
    ) {
      return <div>Loading shared code...</div>;
    }

    return (
      <ReactCodeMirror
        width="100%"
        minHeight="80vh"
        theme={tomorrowNightBlue}
        editable={false}
        extensions={[
          getLanguageExtension(language),
          yCollab(yTextRef.current, providerRef.current.awareness, {
            clientID: ydocRef.current.clientID,
          }),
          EditorView.editable.of(false),
        ]}
      />
    );
  }
);

export default ReadOnlyCodeEditor;
