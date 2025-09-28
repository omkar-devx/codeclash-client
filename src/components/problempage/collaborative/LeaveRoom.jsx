import { leaveRoom } from "@/api/services/collaborateService";
import React from "react";
import * as Y from "yjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WebsocketProvider } from "y-websocket";
import { Button } from "@/components";
import { useNavigate } from "@tanstack/react-router";

const LeaveRoom = ({
  currentRoom,
  user,
  toggleLeave = false,
  setToggleLeave = () => {},
}) => {
  const navigate = useNavigate();
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

      setToggleLeave(!toggleLeave);
      navigate({ to: "/problemset" });
    },
  });
  return (
    <div>
      <Button
        className="h-8 cursor-pointer w-full"
        variant="destructive"
        onClick={() => handleLeave.mutate()}
      >
        Leave
      </Button>
    </div>
  );
};

export default LeaveRoom;
