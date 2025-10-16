import { userCreateRoom } from "@/api/services/collaborateService";
import { questionSearch } from "@/api/services/questionService";
import { Button, Input } from "@/components";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const CreateRoomConfig = ({
  problems = [],
  currentRoomPending,
  currentRoom,
  toggleCreateRoomConfig,
  setToggleCreateRoomConfig,
}) => {
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState(problems);
  const debounceRef = useRef(null);
  const [questionArr, setQuestionArr] = useState([]);
  const queryClient = useQueryClient();

  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);

  const handleCreateRoom = async (questionArrParam) => {
    try {
      if (!questionArrParam || questionArrParam.length < 1) {
        toast.error("No questions are selected!!");
        return;
      }
      const roomId = nanoid(10);
      createRoomMutation.mutate({ roomId, questionArray: questionArrParam });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createRoomMutation = useMutation({
    mutationFn: ({ roomId, questionArray }) =>
      userCreateRoom({ roomId, questionArray }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["currentRoom"]);
      navigate({ to: `room/${res.roomId}` });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSearch = async (e) => {
    let value = e.target.value;
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      (async () => {
        if (value) {
          const res = await questionSearch(value);
          setQuestions(res);
        }
      })();
    }, 450);
  };

  const toggleQuestion = (uid) => {
    setQuestionArr((prev) => {
      if (prev.includes(uid)) return prev.filter((id) => id !== uid);
      return [...prev, uid];
    });
  };

  const handleRemoveSelected = (uid) => {
    setQuestionArr((prev) => prev.filter((id) => id !== uid));
  };

  useEffect(() => {
    if (search === "") {
      setQuestions(problems);
    }
  }, [search, problems]);

  return (
    <div className="relative">
      {/* Custom Scrollbar and Cursor Styles */}
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

      {/* Close Button */}
      {toggleCreateRoomConfig && (
        <button
          aria-expanded={toggleCreateRoomConfig}
          onClick={() => setToggleCreateRoomConfig(false)}
          className="fixed right-6 top-6 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-700 px-4 py-2 shadow-lg backdrop-blur hover:scale-105 transition-transform text-slate-300 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={toggleCreateRoomConfig && "M6 18L18 6M6 6l12 12"}
            />
          </svg>
          <span className="text-sm font-medium">
            {toggleCreateRoomConfig && "Close"} Create Room
          </span>
        </button>
      )}

      {/* Modal */}
      <div
        className={`fixed right-6 top-20 z-40 w-[min(720px,95vw)] rounded-2xl bg-slate-900/95 backdrop-blur-sm shadow-2xl border border-slate-800 transition-transform duration-200 ${
          toggleCreateRoomConfig
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">
              Create Collaborative Room
            </h3>
            <span className="text-sm text-slate-400">
              Select up to your questions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-slate-300">Selected:</div>
            <div className="inline-flex items-center gap-2">
              <div className="rounded-full bg-blue-600 px-3 py-1 text-white text-sm font-medium shadow-lg shadow-blue-600/30">
                {questionArr.length}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <Input
              value={search}
              onChange={handleSearch}
              placeholder="Search problems by title or uid"
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-lg focus:ring-blue-600/50 focus:border-blue-600"
            />
            <Button
              onClick={() => setSearch("")}
              className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg"
            >
              Clear
            </Button>
          </div>

          {/* Selected Questions Tags */}
          <div className="flex flex-wrap gap-2">
            {questionArr.length === 0 ? (
              <div className="text-sm text-slate-500">
                No questions selected yet.
              </div>
            ) : (
              questionArr.map((uid) => (
                <div
                  key={uid}
                  className="flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-600/50 px-3 py-1.5 text-sm text-blue-400"
                >
                  <span className="font-mono">{uid}</span>
                  <button
                    onClick={() => handleRemoveSelected(uid)}
                    className="rounded-full p-1 hover:bg-blue-600/30 transition-colors text-blue-400 hover:text-blue-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Questions Table */}
          <div className="max-h-[40vh] overflow-y-auto border border-slate-800 rounded-lg custom-scrollbar bg-slate-950">
            <Table>
              <TableBody>
                {questions.slice(0, 50).map((question) => {
                  const isSelected = questionArr.includes(question.uid);
                  return (
                    <TableRow
                      key={question.uid}
                      onClick={() => toggleQuestion(question.uid)}
                      className={`cursor-pointer transition-colors border-b border-slate-800 ${
                        isSelected
                          ? "bg-blue-600/20 hover:bg-blue-600/30"
                          : "hover:bg-slate-800/50"
                      }`}
                    >
                      <TableCell className="font-mono text-sm w-24 text-slate-300">
                        {question.uid}
                      </TableCell>
                      <TableCell className="truncate max-w-[60ch] text-sm text-slate-300">
                        {question.title}
                      </TableCell>
                      <TableCell
                        className={`font-semibold whitespace-nowrap text-sm ${
                          question.difficulty === "easy"
                            ? "text-green-400"
                            : question.difficulty === "medium"
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {question.difficulty}
                      </TableCell>
                      <TableCell className="w-10">
                        {isSelected ? (
                          <div className="inline-flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Tip: click a row to select/deselect a question.
            </div>
            <div className="flex items-center gap-2">
              <Button
                disabled={!user || currentRoomPending || currentRoom}
                onClick={() => handleCreateRoom(questionArr)}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg shadow-blue-600/30 transition-all"
              >
                Create Room
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomConfig;
