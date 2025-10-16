import { problemset } from "@/api/services/questionService";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import { getCurrentRoom } from "@/api/services/collaborateService";
import { Card } from "@/components/ui/card";
import SearchQuestions from "@/components/SearchQuestions";
import Sidebar from "@/components/Sidebar";
import { LoaderCircle } from "lucide-react";
import CreateRoomConfig from "@/components/problempage/collaborative/CreateRoomConfig";

const Problemset = () => {
  const navigate = useNavigate();
  const [toggleCreateRoomConfig, setToggleCreateRoomConfig] = useState(false);

  const {
    data: problems = [],
    isPending: problemPending,
    isError: problemError,
  } = useQuery({
    queryKey: ["problemset"],
    queryFn: problemset,
    staleTime: 60 * 60 * 1000,
  });

  const { data: currentRoom, isPending: currentRoomPending } = useQuery({
    queryKey: ["currentRoom"],
    queryFn: getCurrentRoom,
  });

  const getDifficultyColor = (difficulty = "") => {
    const d = String(difficulty).trim().toLowerCase();

    if (d === "easy") {
      return "bg-green-500/20 text-green-400 border-green-500/30";
    }
    if (d === "medium") {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
    if (d === "hard") {
      return "bg-red-500/20 text-red-400 border-red-500/30";
    }
    return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  if (problemError) {
    toast.error(problemError);
  }

  if (problemPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-4 bg-slate-950">
        <LoaderCircle className="animate-spin w-12 h-12 text-blue-400" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-slate-950 p-2 md:p-3 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="w-full h-full flex flex-col md:flex-row gap-2 relative z-10">
        <div className="lg:flex-1 h-full overflow-hidden bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-xl">
          <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 px-3 py-2">
            <SearchQuestions />
          </div>

          <div className="px-3 pb-3 pt-2 h-full">
            <div className="overflow-y-auto h-[calc(100%_-_3.25rem)] pr-2 custom-scrollbar">
              <Table>
                <TableCaption className="text-sm text-slate-500">
                  CodeClash Problemset
                </TableCaption>
                <TableHeader>
                  <TableRow className="border-b border-slate-800 hover:bg-transparent">
                    <TableHead className="w-28 text-slate-400 font-semibold">
                      Question Id
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold">
                      Title
                    </TableHead>
                    <TableHead className="w-28 text-slate-400 font-semibold">
                      Level
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {problems.map((question) => (
                    <TableRow
                      onClick={() =>
                        navigate({
                          to: `/problemset/question/$id/$title`,
                          params: {
                            id: question.uid,
                            title: slugify(question.title),
                          },
                        })
                      }
                      key={question.uid}
                      className="cursor-pointer hover:bg-slate-800/50 transition-colors border-b border-slate-800/50"
                    >
                      <TableCell className="cursor-pointer font-mono text-sm text-slate-300">
                        {question.uid}
                      </TableCell>
                      <TableCell className="cursor-pointer truncate max-w-[60ch] text-sm text-slate-300">
                        {question.title}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`cursor-pointer px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}
                        >
                          {question.difficulty}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {problems.length === 0 && (
                <div className="mt-4 text-center text-slate-400">
                  No questions found.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-72 lg:w-80 h-full">
          <div className="h-full">
            <Sidebar
              currentRoom={currentRoom}
              currentRoomPending={currentRoomPending}
              setToggleCreateRoomConfig={setToggleCreateRoomConfig}
            />
          </div>
        </div>
      </div>

      <div>
        <CreateRoomConfig
          problems={problems}
          currentRoom={currentRoom}
          currentRoomPending={currentRoomPending}
          toggleCreateRoomConfig={toggleCreateRoomConfig}
          setToggleCreateRoomConfig={setToggleCreateRoomConfig}
        />
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default Problemset;
