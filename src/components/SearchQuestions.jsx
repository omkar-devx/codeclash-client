import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from ".";
import { Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { questionSearch } from "@/api/services/questionService";

const SearchQuestions = () => {
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const debounceRef = useRef(null);

  const handleInput = async (e) => {
    let value = e.target.value;
    setInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      (async () => {
        if (value) {
          const questions = await questionSearch(value);
          queryClient.setQueriesData(["problemset"], questions);
          console.log(questions);
        }
      })();
    }, 500);
  };

  useEffect(() => {
    if (input === "") {
      console.log("inside useeffect");
      queryClient.invalidateQueries(["problemset"]);
    }
  }, [input]);

  return (
    <div className="flex w-[80%] m-auto border-1 border-black rounded-3xl px-4 gap-3 justify-center items-center">
      <Input
        className="border-none"
        placeholder="Search Question Number and Title"
        onChange={handleInput}
      />
      <Search />
    </div>
  );
};

export default SearchQuestions;
