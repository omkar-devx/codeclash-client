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
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const CollaborateRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomId } = useParams({ from: "/problemset/room/$roomId" });
  const [questionLen, setQuestionLen] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [output, setOutput] = useState([]);
  const [roomChecked, setRoomChecked] = useState(false);

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
    },
  });

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
        socket.close?.();
      };
    }
  }, [user, currentRoom?.roomId, currentRoomPending, roomId]);

  const renderQuestionNumber = () => {
    let items = [];
    for (let len = 1; len <= questionLen; len++) {
      items.push(
        <p
          className="border-solid cursor-pointer bg-red-600 size-max w-6 text-center my-2"
          onClick={() => setSelectedQuestion(len - 1)}
          key={len}
        >
          {len}
        </p>
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
              <CodeEditor />
              <Execution />
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
