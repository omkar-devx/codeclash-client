import React, { useState } from "react";
import { Button, Input } from ".";
import { useNavigate } from "@tanstack/react-router";
import {
  leaveRoom,
  userCreateRoom,
  userJoinRoom,
} from "../api/services/collaborateService";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";
import { CirclePlus, Clipboard, Copy, ExternalLink, Merge } from "lucide-react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const JoinRoomBox = React.memo(({ currentRoom, currentRoomPending }) => {
  const queryClient = useQueryClient();
  const [joinRoom, setJoinRoom] = useState(false);
  const [createRoom, setCreateRoom] = useState(false);
  const [inputRoomId, setInputRoomId] = useState("");

  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const createRoomMutation = useMutation({
    mutationFn: ({ roomId, questionArray }) =>
      userCreateRoom({ roomId, questionArray }),
    onSuccess: (res) => {
      console.log("sucess on room creating", res.roomId);
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
      console.log("inputRoomId", JSON.stringify(inputRoomId));
      const inputRoomIdString = JSON.stringify(inputRoomId);
      joinRoomMutation({ roomId: inputRoomIdString });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreateRoom = async () => {
    try {
      const arrayId = [1, 2];
      // const roomId = uuidv4();
      const roomId = nanoid(10);
      console.log(arrayId, roomId);
      3;
      createRoomMutation.mutate({ roomId, questionArray: arrayId });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLeave = useMutation({
    mutationFn: leaveRoom,
    onSuccess: async () => {
      const questions = currentRoom.questionArray;
      const roomId = currentRoom.roomId;
      const userId = user.username;

      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider("/yjs", `room-${roomId}`, ydoc);

      // wait for provider status 'connected'
      await new Promise((resolve) => {
        const onStatus = (s) => {
          try {
            if (s.status === "connected") {
              provider.off("status", onStatus);
              resolve();
            }
          } catch (e) {
            // ignore
          }
        };
        provider.on("status", onStatus);
        // fallback timeout
        setTimeout(() => {
          provider.off("status", onStatus);
          resolve();
        }, 3000);
      });

      // also wait for an initial sync event (safeguard) (used to get current data means sync ydoc created in this file)
      await new Promise((resolve) => {
        const onSync = (isSynced) => {
          provider.off("sync", onSync);
          resolve();
        };
        provider.on("sync", onSync);
        // fallback
        setTimeout(() => {
          provider.off("sync", onSync);
          resolve();
        }, 3000);
      });

      // perform deletion in a transaction
      ydoc.transact(() => {
        questions.forEach((uid) => {
          console.log(`Deleting room:${roomId}: user:${userId} q:${uid}`);
          localStorage.removeItem(`room:${roomId}:uid:${uid}`);
          const yText = ydoc.getText(`code-${userId}-${uid}`);
          if (yText && yText.length > 0) {
            yText.delete(0, yText.length);
          }
        });
      });

      // give the update time to propagate to the server/persistence
      await new Promise((r) => setTimeout(r, 200));

      provider.destroy();
      ydoc.destroy();

      queryClient.invalidateQueries(["currentRoom"]);
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(currentRoom.roomId);
    toast.success("Room Id Copied");
  };

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <p className="text-lg font-bold underline">Room:</p>
      <div className="flex flex-col gap-3 w-[60%]">
        <Button
          disabled={!user || currentRoomPending || currentRoom}
          onClick={handleCreateRoom}
        >
          <CirclePlus />
          Create Room
        </Button>
        <Button
          disabled={!user || currentRoomPending || currentRoom}
          variant="outline"
          onClick={() => {
            joinRoom ? setJoinRoom(false) : setJoinRoom(true);
          }}
        >
          <Merge />
          Join Room
        </Button>
      </div>

      <div className={joinRoom ? "block" : "hidden"}>
        <Input onChange={(e) => setInputRoomId(e.target.value)} />
        {console.log("users->", user)}
        <Button disabled={!user} onClick={handleJoinRoom}>
          Join Room
        </Button>
      </div>
      {/* <div className={createRoom ? "block" : "hidden"}></div> */}

      {user && currentRoom && (
        <div className="border-dashed border-black flex flex-col gap-2 bg-white border-2 rounded-2xl px-9 py-5">
          <div className="flex gap-2 items-center">
            <Input
              value={currentRoom.roomId}
              disabled={true}
              className="w-[7rem]"
            />
            <Copy className="w-5 cursor-pointer" onClick={handleCopy} />
          </div>
          {/* <p onClick={() => navigate({ to: `room/${currentRoom.roomId}` })}>
              {currentRoom.roomId}
            </p> */}
          <Button
            className="h-8 cursor-pointer "
            variant="secondary"
            onClick={() => navigate({ to: `room/${currentRoom.roomId}` })}
          >
            <ExternalLink />
            Enter Room
          </Button>
          <Button
            className="h-8 cursor-pointer"
            variant="destructive"
            onClick={() => handleLeave.mutate()}
          >
            Leave
          </Button>
        </div>
      )}
    </div>
  );
});

export default JoinRoomBox;
