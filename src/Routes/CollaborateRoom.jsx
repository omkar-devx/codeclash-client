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
import { Copy, Loader } from "lucide-react";
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
          className={`w-8 cursor-pointer h-8 my-1 mx-1 rounded-lg flex items-center justify-center text-sm font-medium transition-all
            ${
              selectedQuestion === len - 1
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
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
    return (
      <div className="p-4 text-sm text-slate-400 bg-slate-950 h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-blue-400" />
          <span>Loading question...</span>
        </div>
      </div>
    );

  if (!questions || !roomUsers)
    return (
      <div className="p-4 text-sm text-slate-400 bg-slate-950 h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-blue-400" />
          <span>Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="lg:h-screen bg-slate-950 lg:overflow-hidden">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
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

      <div className="h-full p-3 gap-3 flex flex-col md:grid md:grid-cols-[40px_0.8fr_1fr_0.7fr]">
        <div className="flex flex-col items-center lg:min-h-0">
          <div className="sticky top-6 flex lg:flex-col items-center rounded-lg p-1 bg-slate-900/50 border border-slate-800">
            {renderQuestionNumber()}
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col min-h-100 max-h-150 lg:min-h-0">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <h3 className="text-sm font-semibold text-white">Description</h3>
            <div className="text-xs text-slate-400">
              {currentQuestion?.title ?? ""}
            </div>
          </div>
          <div className="p-4 overflow-auto min-h-0 custom-scrollbar">
            <Description question={currentQuestion} />
          </div>
          <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500 flex justify-between bg-slate-900/50">
            <div>
              Difficulty:{" "}
              <span className="text-slate-400 font-medium">
                {currentQuestion?.difficulty ?? "NA"}
              </span>
            </div>
            <div>
              UID:{" "}
              <span className="text-slate-400 font-medium">
                {currentQuestion?.uid}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col min-h-150 max-h-150 lg:min-h-0">
          <div className="px-3 py-2 border-b border-slate-800 flex justify-between gap-2 items-center overflow-auto bg-slate-900/80 custom-scrollbar">
            <div className="flex gap-2 items-center overflow-auto custom-scrollbar">
              {roomUsers.map((u) => {
                const name =
                  typeof u === "string" ? u : (u?.username ?? "unknown");
                return (
                  <div
                    key={typeof u === "string" ? u : (u?.id ?? name)}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium select-none transition-all ${
                      currentUser === name
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
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

            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-lg shadow-sm w-fit">
              <span className="text-sm font-medium text-slate-400">
                Language:
              </span>
              <span className="text-sm font-semibold text-blue-400 uppercase">
                CPP
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-3 min-h-0">
            <div className="h-full flex flex-col min-h-0">
              <div className="flex-1 overflow-auto min-h-0 custom-scrollbar">
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

              <div className="mt-3 px-1 text-xs text-slate-500 flex justify-between items-center">
                <div>
                  Editing as:{" "}
                  <span className="font-medium text-slate-400">
                    {currentUser || "-"}
                  </span>
                </div>
                <div>Question #{selectedQuestion + 1}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col max-h-150 lg:min-h-0">
          <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between gap-2 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <Input
                value={roomId}
                disabled={true}
                className="w-[7rem] text-xs bg-slate-800/50 border-slate-700 text-slate-300 px-2 py-1 rounded-lg"
              />
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-blue-400"
                title="Copy room ID"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <LeaveRoom currentRoom={currentRoom} user={user} />
            </div>
          </div>

          <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/50">
            <ActiveUsers />
          </div>

          <div className="flex-1 overflow-auto p-3 min-h-0 custom-scrollbar">
            <Chatbox user={user} currentRoom={currentRoom} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborateRoom;
