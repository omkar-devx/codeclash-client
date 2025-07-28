import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { tomorrowNightBlue } from "@uiw/codemirror-theme-tomorrow-night-blue";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { yCollab } from "y-codemirror.next";
import { EditorView } from "@uiw/react-codemirror";

const CollaborativeEditor = React.memo(
  ({ roomId, userId, id, language, pageType }) => {
    const [ready, setReady] = useState(false);
    const ydocRef = useRef(null);
    const providerRef = useRef(null);
    const yTextRef = useRef(null);

    const key = `${pageType}:uid:${userId}:qid:${id}`;

    useEffect(() => {
      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider("/yjs", `room-${roomId}`, ydoc);
      const yText = ydoc.getText(`code-${userId}-${id}`);

      ydocRef.current = ydoc;
      providerRef.current = provider;
      yTextRef.current = yText;

      provider.awareness.setLocalStateField("user", {
        color: "#2196f3",
      });

      setReady(true);

      return () => {
        provider.destroy();
        ydoc.destroy();
      };
    }, [id, userId, roomId]);

    if (
      !ready ||
      !yTextRef.current ||
      !providerRef.current ||
      !ydocRef.current
    ) {
      return <div>Loading editor...</div>;
    }

    return (
      <ReactCodeMirror
        width="100%"
        minHeight="80vh"
        theme={tomorrowNightBlue}
        extensions={[
          getLanguageExtension(language),
          yCollab(yTextRef.current, providerRef.current?.awareness, {
            clientID: ydocRef.current?.clientID,
          }),
          EditorView.editable.of(true),
        ]}
      />
    );
  }
);

export default CollaborativeEditor;

function getLanguageExtension(language) {
  switch (language.toLowerCase()) {
    case "cpp":
    case "c++":
      return cpp();
    case "python":
      return python();
    case "java":
      return java();
    default:
      return cpp();
  }
}
