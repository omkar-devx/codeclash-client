import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React, { useEffect, useRef, useState } from "react";
import { Button, Input } from "../../";
import { initSocket } from "@/websocket/socket";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { getChatHistory } from "@/api/services/collaborateService";
import { addChatHistory } from "@/features/room/chatSlice";

/**
 * Compact & professional Chatbox UI
 * - Avatars removed (only username displayed)
 * - Reduced padding and gaps for compact message height
 * - Preserves all behavior (socket, Redux, grouping, normalization)
 */

const Chatbox = React.memo(({ user, currentRoom }) => {
  const rawChats = useSelector((state) => state.chat.message);
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const socketRef = useRef(null);
  const listRef = useRef(null);

  const normalizedChats = Array.isArray(rawChats)
    ? rawChats.map((c) => {
        if (!c) return { userId: "unknown", message: "" };
        if (typeof c === "string") return { userId: "unknown", message: c };
        return {
          userId: c.userId ?? c.userid ?? c.user ?? "unknown",
          message: c.message ?? c.text ?? String(c),
          createdAt: c.createdAt ?? c.timestamp ?? c.time ?? c.ts ?? null,
        };
      })
    : [];

  const handleSendMsg = () => {
    if (socketRef.current && msg.trim() && currentRoom && user) {
      const data = {
        type: "chat",
        payload: {
          roomId: currentRoom.roomId,
          userId: user.username,
          message: msg,
        },
      };
      console.log("message", data);
      socketRef.current.send(JSON.stringify(data));
      setMsg("");
    }
  };

  const { mutate: chatHistoryMutation } = useMutation({
    mutationFn: ({ roomId }) => getChatHistory({ roomId }),
    onSuccess: (res) => {
      dispatch(addChatHistory(res));
    },
  });

  useEffect(() => {
    if (user && currentRoom) {
      chatHistoryMutation({ roomId: currentRoom.roomId });
      const socket = initSocket("/ws", dispatch);

      socketRef.current = socket;

      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            type: "join-room",
            payload: { roomId: currentRoom.roomId, userId: user.username },
          })
        );
      };

      return () => {
        try {
          socket.close();
        } catch (e) {
          /* ignore */
        }
        socketRef.current = null;
      };
    }
  }, [user, currentRoom]);

  const grouped = [];
  for (let i = 0; i < normalizedChats.length; i++) {
    const cur = normalizedChats[i];
    const prev = grouped[grouped.length - 1];
    if (prev && prev.userId === cur.userId) {
      prev.messages.push(cur);
    } else {
      grouped.push({ userId: cur.userId, messages: [cur] });
    }
  }

  useEffect(() => {
    if (!listRef.current) return;
    const t = setTimeout(() => {
      try {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      } catch (e) {
        // ignore
      }
    }, 60);
    return () => clearTimeout(t);
  }, [normalizedChats.length]);

  const formatTime = (t) => {
    if (!t) return null;
    try {
      const d = typeof t === "number" ? new Date(t) : new Date(t);
      if (isNaN(d.getTime())) return null;
      const hh = d.getHours().toString().padStart(2, "0");
      const mm = d.getMinutes().toString().padStart(2, "0");
      return `${hh}:${mm}`;
    } catch {
      return null;
    }
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="px-3 py-2 border-b border-gray-100">
          <div className="text-sm font-medium text-gray-800">Room Chat</div>
          <div className="text-xs text-gray-500">
            Keep messages short and clear
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div
            ref={listRef}
            className="px-3 py-3 h-full overflow-auto flex flex-col"
            style={{ gap: "6px" }}
          >
            {grouped.length === 0 ? (
              <div className="text-xs text-gray-400 italic">
                No messages yet — say hello 👋
              </div>
            ) : (
              grouped.map((group, gi) => {
                const isMe = group.userId === user?.username;
                const lastMsg = group.messages[group.messages.length - 1];
                const time = formatTime(lastMsg?.createdAt);
                return (
                  <div
                    key={gi}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex ${isMe ? "flex-row-reverse items-end" : "items-start"}`}
                    >
                      <div className="max-w-[82%]">
                        <div
                          className={`text-[0.72rem] mb-1 ${isMe ? "text-right text-gray-500" : "text-left text-gray-500"}`}
                        >
                          {group.userId}
                        </div>

                        <div className="flex flex-col gap-1">
                          {group.messages.map((m, mi) => (
                            <div
                              key={mi}
                              className={`px-3 py-1.5 max-w-100 text-sm leading-tight rounded-lg break-words shadow-sm ${
                                isMe
                                  ? "bg-blue-600 text-white self-end"
                                  : "bg-gray-50 border border-gray-100 text-gray-800 self-start"
                              }`}
                            >
                              {m.message}
                            </div>
                          ))}

                          {time && (
                            <div
                              className={`text-[0.68rem] mt-1 ${isMe ? "text-white/80 text-right" : "text-gray-400 text-left"}`}
                            >
                              {time}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type a message..."
            className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMsg();
              }
            }}
          />
        </div>

        <div>
          <Button
            disabled={!socketRef.current}
            onClick={handleSendMsg}
            className="px-4 py-2"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
});

export default Chatbox;
