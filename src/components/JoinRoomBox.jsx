import React, { useEffect, useState } from "react";
import { Button, Input } from ".";
import { useNavigate } from "@tanstack/react-router";
import {
  userCreateRoom,
  userJoinRoom,
} from "../api/services/collaborateService";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";
import { CirclePlus, Copy, ExternalLink, Merge } from "lucide-react";
import LeaveRoom from "./problempage/collaborative/LeaveRoom";

const JoinRoomBox = React.memo(
  ({
    currentRoom,
    currentRoomPending,
    setToggleCreateRoomConfig,
    toggleCreateRoomConfig,
  }) => {
    const queryClient = useQueryClient();
    const [joinRoom, setJoinRoom] = useState(false);
    const [inputRoomId, setInputRoomId] = useState("");
    const [toggleLeave, setToggleLeave] = useState(false);

    const user = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();

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

    const { mutate: joinRoomMutation } = useMutation({
      mutationFn: ({ roomId }) => userJoinRoom({ roomId }),
      onSuccess: (res) => {
        navigate({ to: `room/${res.roomId}` });
        setInputRoomId("");
        setJoinRoom(false);
        toast.success("Joined Room");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });

    const handleJoinRoom = async () => {
      try {
        const inputRoomIdString = JSON.stringify(inputRoomId);
        joinRoomMutation({ roomId: inputRoomIdString });
      } catch (err) {
        toast.error(err.message);
      }
    };

    const handleCopy = () => {
      if (currentRoom && currentRoom.roomId) {
        navigator.clipboard.writeText(currentRoom.roomId);
        toast.success("Room Id Copied");
      }
    };

    useEffect(() => {
      queryClient.invalidateQueries(["currentRoom"]);
    }, [toggleLeave]);

    return (
      <div className="w-full flex flex-col gap-4">
        <p className="text-sm font-medium text-slate-400">
          Room{" "}
          {!user ? (
            <span className="italic font-light">
              {" "}
              (login for create or join room)
            </span>
          ) : (
            ""
          )}
        </p>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg shadow-blue-600/30"
            disabled={!user || currentRoomPending || currentRoom}
            onClick={() => setToggleCreateRoomConfig(true)}
          >
            <CirclePlus className="w-4 h-4" />
            <span className="ml-2">Create</span>
          </Button>

          <Button
            className="flex-1 border-2 border-slate-700 bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white hover:border-blue-600 font-medium transition-all disabled:opacity-50"
            disabled={!user || currentRoomPending || currentRoom}
            variant="outline"
            onClick={() => setJoinRoom((s) => !s)}
          >
            <Merge className="w-4 h-4" />
            <span className="ml-2">Join</span>
          </Button>
        </div>

        <div
          className={`${joinRoom ? "block" : "hidden"} w-full flex flex-col gap-2`}
        >
          <Input
            placeholder="Enter room id"
            value={inputRoomId}
            onChange={(e) => setInputRoomId(e.target.value)}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-lg focus:ring-blue-600/50 focus:border-blue-600"
          />
          <Button
            disabled={!user}
            onClick={handleJoinRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/30"
          >
            Join Room
          </Button>
        </div>

        {user && currentRoom && (
          <div className="w-full bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl flex flex-col gap-3 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2">
              <Input
                value={currentRoom.roomId}
                disabled
                className="flex-1 bg-slate-800/50 border-slate-700 text-slate-300 rounded-lg"
              />
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-blue-400"
                aria-label="Copy room ID"
              >
                <Copy className="w-5 h-5 cursor-pointer" />
              </button>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-600/50 font-medium transition-all"
                onClick={() => navigate({ to: `room/${currentRoom.roomId}` })}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="ml-2">Enter Room</span>
              </Button>

              <LeaveRoom
                currentRoom={currentRoom}
                user={user}
                toggleLeave={toggleLeave}
                setToggleLeave={setToggleLeave}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default JoinRoomBox;
