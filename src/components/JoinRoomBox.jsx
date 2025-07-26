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

const JoinRoomBox = React.memo(({ currentRoom, currentRoomPending }) => {
  const queryClient = useQueryClient();
  const [joinRoom, setJoinRoom] = useState(false);
  const [createRoom, setCreateRoom] = useState(false);
  const [inputRoomId, setInputRoomId] = useState("");

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
    onSuccess: () => {
      queryClient.invalidateQueries(["currentRoom"]);
    },
  });

  return (
    <div>
      <Button
        disabled={currentRoomPending || currentRoom}
        onClick={() => {
          joinRoom ? setJoinRoom(false) : setJoinRoom(true);
        }}
      >
        Join Room
      </Button>
      <Button
        disabled={currentRoomPending || currentRoom}
        onClick={handleCreateRoom}
      >
        Create Room
      </Button>
      <div className={joinRoom ? "block" : "hidden"}>
        <Input onChange={(e) => setInputRoomId(e.target.value)} />
        <Button onClick={handleJoinRoom}>Join Room</Button>
      </div>
      <div className={createRoom ? "block" : "hidden"}></div>
      {currentRoom && (
        <div>
          <p onClick={() => navigate({ to: `room/${currentRoom.roomId}` })}>
            {currentRoom.roomId}
          </p>
          <Button onClick={() => handleLeave.mutate()}>Leave</Button>
        </div>
      )}
    </div>
  );
});

export default JoinRoomBox;
