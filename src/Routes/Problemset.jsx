import { problemset } from "@/api/services/questionService";
import { useMutation, useQuery } from "@tanstack/react-query";
// import { LoaderCircle, Sidebar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import JoinRoomBox from "@/components/JoinRoomBox";
import { getCurrentRoom } from "@/api/services/collaborateService";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components";
import SearchQuestions from "@/components/SearchQuestions";
import Sidebar from "@/components/Sidebar";
import { LoaderCircle } from "lucide-react";

const Problemset = () => {
  const navigate = useNavigate();
  const {
    data: problems,
    isPending: problemPending,
    isError: problemError,
    isSuccess: problemSuccess,
  } = useQuery({
    queryKey: ["problemset"],
    queryFn: problemset,
    staleTime: 60 * 60 * 1000,
  });

  const { data: currentRoom, isPending: currentRoomPending } = useQuery({
    queryKey: ["currentRoom"],
    queryFn: getCurrentRoom,
  });

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
      <>
        <LoaderCircle className="animate-spin w-6 h-6" />
      </>
    );
  }

  return (
    <div className="px-4 py-2 h-screen flex gap-1">
      <Card className="w-[77%] h-full bg-muted ">
        <CardHeader>
          <SearchQuestions />
        </CardHeader>
        <div className="px-5">
          <Table>
            <TableCaption>Code Clash Problemset</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Question Id</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Level</TableHead>
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
                >
                  <TableCell>{question.uid}</TableCell>
                  <TableCell>{question.title}</TableCell>
                  <TableCell
                    className={`font-bold
                    ${
                      question.difficulty === "easy"
                        ? "text-green-500"
                        : question.difficulty === "medium"
                          ? "text-orange-400"
                          : "text-red-600"
                    }
                    `}
                  >
                    {question.difficulty}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      <Sidebar
        currentRoom={currentRoom}
        currentRoomPending={currentRoomPending}
      />
    </div>
  );
};

export default Problemset;
