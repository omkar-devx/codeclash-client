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
  const [currentUser, setCurrentUser] = useState("");
  const [participants, setParticipants] = useState([]);

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
    refetchInterval: 2000,
  });

  // get users online
  const { data: usersOnline } = useQuery({
    queryKey: ["onlineUsers"],
    queryFn: () => getUsersOnline({ roomId }),
    refetchInterval: 2000,
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

      if (currentRoom.questionArray?.length > 0) {
        fetchQuestions({ questionArray: currentRoom.questionArray });
      }
    }
  }, [user, currentRoom?.roomId, currentRoomPending, roomId]);

  const changeCurrentUser = () => {};

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

  return !questions || !roomUsers ? (
    <p>loading...</p>
  ) : (
    <div className="grid grid-cols-[50px_0.6fr_1fr_0.6fr] gap-1 h-screen ">
      <div className="border-2 border-red-500 ">{renderQuestionNumber()}</div>
      <div className="border-1 border-green-500">
        {<Description question={questions[selectedQuestion]} />}
      </div>
      <div className="border-1 border-yellow-500 flex flex-col gap-1">
        <div className="border-1 border-red-500 h-[3rem] flex gap-2">
          {roomUsers.map((user) => (
            <div
              className="border-1 border-black cursor-pointer"
              onClick={() => setCurrentUser(user)}
            >
              {user}
            </div>
          ))}
        </div>
        <div className="border-1 border-green-500 h-full">
          <div>
            {currentUser === user.username ? (
              <div>
                <CollaborativeEditor
                  key={currentUser}
                  roomId={roomId}
                  userId={currentUser}
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
            ) : (
              <ReadOnlyCodeEditor
                roomId={roomId}
                id={questions[selectedQuestion].uid}
                language="cpp"
                targetUserId={currentUser}
              />
            )}
          </div>
        </div>
      </div>
      <div className="border-1 border-blue-500">
        <Chatbox user={user} currentRoom={currentRoom} />
      </div>
    </div>
  );
};

export default CollaborateRoom;
