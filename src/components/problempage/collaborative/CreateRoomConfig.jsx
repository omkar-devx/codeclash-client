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

  // if (!toggleCreateRoomConfig) return null;

  return (
    <div className="relative">
      {toggleCreateRoomConfig && (
        <button
          aria-expanded={toggleCreateRoomConfig}
          onClick={() => setToggleCreateRoomConfig(false)}
          className="fixed right-6 top-6 z-50 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur hover:scale-105 transition-transform"
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
      <div
        className={`fixed right-6 top-20 z-40 w-[min(720px,95vw)] rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 transition-transform duration-200 ${
          toggleCreateRoomConfig
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Create Collaborative Room</h3>
            <span className="text-sm text-muted-foreground">
              Select up to your questions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm">Selected:</div>
            <div className="inline-flex items-center gap-2">
              <div className="rounded-full bg-blue-600 px-3 py-1 text-white text-sm font-medium">
                {questionArr.length}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-3">
            <Input
              value={search}
              onChange={handleSearch}
              placeholder="Search problems by title or uid"
            />
            <Button onClick={() => setSearch("")} className="px-4">
              Clear
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {questionArr.length === 0 ? (
              <div className="text-sm text-slate-500">
                No questions selected yet.
              </div>
            ) : (
              questionArr.map((uid) => (
                <div
                  key={uid}
                  className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm"
                >
                  <span className="font-mono">{uid}</span>
                  <button
                    onClick={() => handleRemoveSelected(uid)}
                    className="rounded-full p-1 hover:bg-slate-200"
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

          <div className="max-h-[40vh] overflow-y-auto border rounded-lg">
            <Table>
              <TableBody>
                {questions.slice(0, 50).map((question) => {
                  const isSelected = questionArr.includes(question.uid);
                  return (
                    <TableRow
                      key={question.uid}
                      onClick={() => toggleQuestion(question.uid)}
                      className={`cursor-pointer transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-slate-50"}`}
                    >
                      <TableCell className="font-mono text-sm w-24">
                        {question.uid}
                      </TableCell>
                      <TableCell className="truncate max-w-[60ch] text-sm">
                        {question.title}
                      </TableCell>
                      <TableCell
                        className={`font-semibold whitespace-nowrap text-sm ${
                          question.difficulty === "easy"
                            ? "text-green-600"
                            : question.difficulty === "medium"
                              ? "text-orange-500"
                              : "text-red-600"
                        }`}
                      >
                        {question.difficulty}
                      </TableCell>
                      <TableCell className="w-10">
                        {isSelected ? (
                          <div className="inline-flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-600"
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

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Tip: click a row to select/deselect a question.
            </div>
            <div className="flex items-center gap-2">
              <Button
                disabled={!user || currentRoomPending || currentRoom}
                onClick={() => handleCreateRoom(questionArr)}
                className="bg-blue-600"
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
