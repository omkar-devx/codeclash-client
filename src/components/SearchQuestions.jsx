import React, { useEffect, useRef, useState } from "react";
import { Input } from ".";
import { Search, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
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
        }
      })();
    }, 450);
  };

  useEffect(() => {
    if (input === "") {
      queryClient.invalidateQueries(["problemset"]);
    }
  }, [input]);

  const clear = () => {
    setInput("");
    queryClient.invalidateQueries(["problemset"]);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <label className="relative block">
        <span className="sr-only">Search questions</span>
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="w-5 h-5 text-blue-400" />
        </span>
        <Input
          value={input}
          onChange={handleInput}
          placeholder="Search by id or title..."
          className="pl-10 pr-10 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 hover:bg-slate-800/70 transition-all"
        />
        {input && (
          <button
            onClick={clear}
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
            aria-label="clear"
          >
            <X className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
          </button>
        )}
      </label>
    </div>
  );
};

export default SearchQuestions;
