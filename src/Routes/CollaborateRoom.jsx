import {
  getCurrentRoom,
  getMultipleQuestions,
  getRoomUsers,
  getUsersOnline,
} from "@/api/services/collaborateService";
import { CodeEditor, Description, Execution, Output } from "@/components";
import Chatbox from "@/components/problempage/collaborative/Chatbox.jsx";
import CollaborativeEditor from "@/components/problempage/collaborative/CollaborativeEditor";
import ReadOnlyCodeEditor from "@/components/problempage/collaborative/ReadOnlyCodeEditor";
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
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // get room users
  const { data: roomUsers } = useQuery({
    queryKey: ["roomUser"],
    queryFn: () => getRoomUsers({ roomId }),
    staleTime: 10000,
    refetchInterval: 10000,
  });

  // get users online
  const { data: usersOnline } = useQuery({
    queryKey: ["onlineUsers"],
    queryFn: () => getUsersOnline({ roomId }),
    staleTime: 10000,
    refetchInterval: 10000,
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
              <CollaborativeEditor
                roomId={roomId}
                userId={user.username}
                id={questions[selectedQuestion].uid}
                language="cpp"
                pageType={pageType}
              />
              <Execution
                id={questions[selectedQuestion].uid}
                langId={52}
                setOutput={setOutput}
                pageType={pageType}
                selectedQuestion={selectedQuestion}
              />
            </div>
            <div className="w-[20rem] mx-5">
              <ReadOnlyCodeEditor
                roomId={roomId}
                id={questions[selectedQuestion].uid}
                language="cpp"
                targetUserId="test1"
              />
            </div>

            {/* <Output outputs={output} /> */}
          </div>
        ) : (
          <p>loading...</p>
        )}

        <div>
          {
            // roomUsers && roomUsers.map((ruser)=>)
          }
          <Chatbox user={user} currentRoom={currentRoom} />
        </div>
      </div>
    </div>
  );
};

export default CollaborateRoom;
