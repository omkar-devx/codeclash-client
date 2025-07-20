import { problemset } from "@/api/services/questionService";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
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

const Problemset = () => {
  const navigate = useNavigate();
  const { data, isPending, isError, isSuccess } = useQuery({
    queryKey: ["problemset"],
    queryFn: problemset,
    staleTime: 60 * 60 * 1000,
  });

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  if (isSuccess) {
    console.log("problemset: ", data);
  }

  if (isError) {
    toast.error(isError);
  }

  if (isPending) {
    return (
      <>
        <LoaderCircle className="animate-spin w-6 h-6" />
      </>
    );
  }

  return (
    <div>
      <h1 className="text-center font-bold text-3xl underline mb-5">
        PROBLEMSET
      </h1>
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
            {data.map((question) => (
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
    </div>
  );
};

export default Problemset;
