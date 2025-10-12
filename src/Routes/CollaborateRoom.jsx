import {
  getCurrentRoom,
  getMultipleQuestions,
  getRoomUsers,
  getUsersOnline,
} from "@/api/services/collaborateService";
import { Description, Execution, Input, Output } from "@/components";
import ActiveUsers from "@/components/problempage/collaborative/ActiveUsers";
import Chatbox from "@/components/problempage/collaborative/Chatbox.jsx";
import CollaborativeEditor from "@/components/problempage/collaborative/CollaborativeEditor";
import LeaveRoom from "@/components/problempage/collaborative/LeaveRoom";
import ReadOnlyCodeEditor from "@/components/problempage/collaborative/ReadOnlyCodeEditor";
import RoomControler from "@/components/problempage/collaborative/RoomControler";
import EditorTools from "@/components/problempage/EditorTools";
import checkAuth from "@/utils/checkAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import React, { useEffect, useState } from "react";
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

  const [langId, setLangId] = useState(54);
  const [code, setCode] = useState(null);
  const [submissionOutput, setSubmissionOutput] = useState(null);
  const [toggleOutput, setToggleOutput] = useState(false);
  const [toggleSubmission, setToggleSubmission] = useState(false);
  const [defaultCode, setDefaultCode] = useState("");

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
    queryKey: ["roomUser", roomId],
    queryFn: () => getRoomUsers({ roomId }),
    refetchInterval: 2000,
  });

  // get users online
  const { data: usersOnline } = useQuery({
    queryKey: ["onlineUsers", roomId],
    queryFn: () => getUsersOnline({ roomId }),
    refetchInterval: 2000,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room Id Copied");
  };

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
  }, [
    user,
    currentRoom?.roomId,
    currentRoomPending,
    roomId,
    isUserPending,
    roomChecked,
    fetchQuestions,
    navigate,
  ]);

  useEffect(() => {
    if (!user?.username) return;
    if (currentUser) return;
    setCurrentUser(user.username);
  }, [user, currentUser]);

  const renderQuestionNumber = () => {
    let items = [];
    for (let len = 1; len <= questionLen; len++) {
      items.push(
        <button
          key={len}
          className={`w-8 cursor-pointer h-8 my-1 mx-1 rounded-full flex items-center justify-center text-sm font-medium transition-shadow
            ${selectedQuestion === len - 1 ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:shadow-md"}`}
          onClick={() => {
            setSelectedQuestion(len - 1);
            setOutput([]);
          }}
          aria-label={`Question ${len}`}
          title={`Question ${len}`}
        >
          {len}
        </button>
      );
    }
    return items;
  };

  const currentQuestion = questions?.[selectedQuestion];
  if (!currentQuestion)
    return <p className="p-4 text-sm text-gray-600">loading question...</p>;

  if (!questions || !roomUsers)
    return <p className="p-4 text-sm text-gray-600">loading...</p>;

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="h-full p-3 gap-3 flex flex-col md:grid md:grid-cols-[40px_0.8fr_1fr_0.7fr]">
        <div className="flex flex-col items-center min-h-0">
          <div className="sticky top-6 flex flex-col items-center rounded-md p-1">
            {renderQuestionNumber()}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">Description</h3>
            <div className="text-xs text-gray-500">
              {currentQuestion?.title ?? ""}
            </div>
          </div>
          <div className="p-4 overflow-auto min-h-0">
            <Description question={currentQuestion} />
          </div>
          <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
            <div>Difficulty: {currentQuestion?.difficulty ?? "NA"}</div>
            <div>UID: {currentQuestion?.uid}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="px-3 py-2 border-b border-gray-100 flex justify-between gap-2 items-center overflow-auto">
            <div className="flex gap-2 items-center overflow-auto">
              {roomUsers.map((u) => {
                const name =
                  typeof u === "string" ? u : (u?.username ?? "unknown");
                return (
                  <div
                    key={typeof u === "string" ? u : (u?.id ?? name)}
                    className={`cursor-pointer px-3 py-1 rounded-md text-xs font-medium select-none transition
                    ${currentUser === name ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    onClick={() => setCurrentUser(name)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setCurrentUser(name);
                    }}
                    aria-label={`Select user ${name}`}
                  >
                    {name}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md shadow-sm w-fit">
              <span className="text-sm font-medium text-gray-600">
                Language:
              </span>
              <span className="text-sm font-semibold text-blue-600 uppercase">
                CPP
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-3 min-h-0">
            <div className="h-full flex flex-col min-h-0">
              <div className="flex-1 overflow-auto min-h-0">
                {currentUser && currentUser === user?.username ? (
                  <div className="h-full min-h-0">
                    <CollaborativeEditor
                      key={`${currentUser}::${currentQuestion.uid}`}
                      roomId={roomId}
                      userId={currentUser}
                      id={currentQuestion.uid}
                      language="cpp"
                      pageType={pageType}
                      defaultCode={currentQuestion.defaultCode}
                    />
                  </div>
                ) : (
                  <ReadOnlyCodeEditor
                    key={`ro::${currentUser}::${currentQuestion.uid}`}
                    roomId={roomId}
                    id={currentQuestion.uid}
                    language="cpp"
                    targetUserId={currentUser}
                  />
                )}
              </div>

              <div className="mt-3 px-1 text-xs text-gray-500 flex justify-between items-center">
                <div>
                  Editing as:{" "}
                  <span className="font-medium text-gray-700">
                    {currentUser || "-"}
                  </span>
                </div>
                <div>Question #{selectedQuestion + 1}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Input
                value={roomId}
                disabled={true}
                className="w-[7rem] text-xs bg-transparent px-0"
              />
              <Copy
                className="w-5 h-5 cursor-pointer text-gray-600"
                onClick={handleCopy}
              />
            </div>
            <div className="flex items-center gap-2">
              <LeaveRoom currentRoom={currentRoom} user={user} />
            </div>
          </div>

          <div className="px-3 py-2 border-b border-gray-100">
            <ActiveUsers />
          </div>

          <div className="flex-1 overflow-auto p-3 min-h-0">
            <Chatbox user={user} currentRoom={currentRoom} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborateRoom;
