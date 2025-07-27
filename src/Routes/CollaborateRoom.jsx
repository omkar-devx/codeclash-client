import {
  getCurrentRoom,
  getMultipleQuestions,
} from "@/api/services/collaborateService";
import { CodeEditor, Description, Execution, Output } from "@/components";
import Chatbox from "@/components/problempage/Chatbox";
import checkAuth from "@/utils/checkAuth";
import { initSocket } from "@/websocket/socket";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const CollaborateRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomId } = useParams({ from: "/problemset/room/$roomId" });
  const pageType = `room:${roomId}`;
  const [questionLen, setQuestionLen] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [output, setOutput] = useState([]);
  const [roomChecked, setRoomChecked] = useState(false);
  const [code, setCode] = useState([]);

  // get currentUser
  const { data: user, isPending: isUserPending } = useQuery({
    queryKey: ["currentUser"],
    queryFn: checkAuth,
    retry: 1,
  });

  // get currentRoom
  const { data: currentRoom, isPending: currentRoomPending } = useQuery({
    queryKey: ["currentRoom"],
    queryFn: getCurrentRoom,
  });

  // get questions
  const { data: questions, mutate: fetchQuestions } = useMutation({
    mutationFn: ({ questionArray }) => getMultipleQuestions({ questionArray }),
    onSuccess: (questions) => {
      setQuestionLen(questions.length);
      let previousCode = [];
      questions.map((question) => {
        let temp = localStorage.getItem(`${pageType}:uid:${question.uid}`);
        if (temp !== null) {
          previousCode.push(JSON.parse(temp));
        } else {
          previousCode.push("");
        }
        console.log("loop", question.uid);
      });
      console.log("previousCode", previousCode);
      setCode(previousCode);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const memoizedSetCode = useCallback(
    (val) => {
      setCode((prevCode) => {
        const newCode = [...prevCode];
        newCode[selectedQuestion] = val;
        return newCode;
      });
    },
    [selectedQuestion]
  );

  const saveToLocalStorage = useCallback(() => {
    if (code && questions[selectedQuestion].uid) {
      console.log("selected question", questions[selectedQuestion].uid);
      localStorage.setItem(
        `${pageType}:uid:${questions[selectedQuestion].uid}`,
        JSON.stringify(code[selectedQuestion])
      );
    }
  }, [code, questions, selectedQuestion]);

  useEffect(() => {
    const userLoaded = !isUserPending && !!user;
    const roomLoaded = !currentRoomPending && !!currentRoom?.roomId;

    if (userLoaded && roomLoaded && !roomChecked) {
      setRoomChecked(true);

      if (currentRoom.roomId !== roomId) {
        toast.error("Invalid room ID");
        navigate({ to: "/problemset" });
        return;
      }

      const socket = initSocket(
        `${import.meta.env.VITE_WS_BASE_URL}/ws`,
        dispatch
      );

      const userId = user.username;

      if (roomId && userId) {
        socket.onopen = () => {
          socket.send(
            JSON.stringify({ type: "join-room", payload: { roomId, userId } })
          );
        };
      } else {
        toast.error("userId or roomId not found in collaborate");
      }

      if (currentRoom.questionArray?.length > 0) {
        fetchQuestions({ questionArray: currentRoom.questionArray });
      }

      return () => {
        socket.onopen = null;
        socket.close?.();
      };
    }
  }, [user, currentRoom?.roomId, currentRoomPending, roomId]);

  const renderQuestionNumber = () => {
    let items = [];
    for (let len = 1; len <= questionLen; len++) {
      items.push(
        <button
          key={len}
          className={`w-8 cursor-pointer h-8 my-1 mx-1 rounded ${
            selectedQuestion === len - 1 ? "bg-blue-600" : "bg-red-600"
          } text-white text-sm`}
          onClick={() => {
            setSelectedQuestion(len - 1);
            setOutput([]);
          }}
        >
          {len}
        </button>
      );
    }
    return items;
  };

  return (
    <div>
      <div className="flex gap-4">
        <div className="">
          {questions ? renderQuestionNumber() : <p>loading...</p>}
        </div>

        {questions ? (
          <div className="flex">
            <Description question={questions[selectedQuestion]} />
            <div className="w-[15rem]">
              <CodeEditor
                id={questions[selectedQuestion].uid}
                code={code[selectedQuestion]}
                memoizedSetCode={memoizedSetCode}
                pageType={pageType}
              />
              <Execution
                id={questions[selectedQuestion].uid}
                langId={52}
                setOutput={setOutput}
                saveToLocalStorage={saveToLocalStorage}
                pageType={pageType}
                selectedQuestion={selectedQuestion}
              />
            </div>
            <Output outputs={output} />
          </div>
        ) : (
          <p>loading...</p>
        )}

        <Chatbox user={user} currentRoom={currentRoom} />
      </div>
    </div>
  );
};

export default CollaborateRoom;
