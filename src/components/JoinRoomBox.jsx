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

    const handleCreateRoom = async () => {
      try {
        const arrayId = [1, 2];
        const roomId = nanoid(10);
        createRoomMutation.mutate({ roomId, questionArray: arrayId });
      } catch (error) {
        toast.error(error.message);
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
        <p className="text-sm font-medium text-slate-600">Room</p>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            disabled={!user || currentRoomPending || currentRoom}
            onClick={() => setToggleCreateRoomConfig(true)}
          >
            <CirclePlus />
            <span className="ml-2">Create</span>
          </Button>

          <Button
            className="flex-1"
            disabled={!user || currentRoomPending || currentRoom}
            variant="outline"
            onClick={() => setJoinRoom((s) => !s)}
          >
            <Merge />
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
          />
          <Button disabled={!user} onClick={handleJoinRoom} className="w-full">
            Join Room
          </Button>
        </div>

        {user && currentRoom && (
          <div className="w-full bg-slate-50 p-3 rounded-lg flex flex-col gap-3 border border-slate-100">
            <div className="flex items-center gap-2">
              <Input value={currentRoom.roomId} disabled className="flex-1" />
              <Copy
                className="w-5 cursor-pointer text-slate-600"
                onClick={handleCopy}
              />
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => navigate({ to: `room/${currentRoom.roomId}` })}
              >
                <ExternalLink />
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
