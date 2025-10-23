import React, { useEffect } from "react";
import { Circle } from "lucide-react";

const ActiveUsers = ({ usersOnline }) => {
  useEffect(() => {
    console.log("online users are this -> ", usersOnline);
  }, [usersOnline]);

  return (
    <>
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
        <span>Active Users ({usersOnline?.length || 0})</span>
      </div>
      <div
        className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900/50 pb-1"
        style={{ flexWrap: "nowrap" }}
      >
        {usersOnline && usersOnline.length > 0 ? (
          usersOnline.map((username, index) => (
            <div
              key={`${username}-${index}`}
              className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg relative group flex-shrink-0"
              title={username}
            >
              <Circle className="w-2 h-2 text-green-400 fill-green-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm max-w-[50px] truncate">
                {username}
              </span>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 border border-slate-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                <span className="text-slate-200 text-xs">{username}</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                  <div className="border-4 border-transparent border-t-slate-900"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <span className="text-slate-500 text-xs">No users online</span>
        )}
      </div>
    </>
  );
};

export default ActiveUsers;
