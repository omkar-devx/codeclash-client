import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React, { useEffect, useRef, useState } from "react";
import { Button, Input } from "../../";
import { initSocket } from "@/websocket/socket";
import { useDispatch, useSelector } from "react-redux";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getChatHistory } from "@/api/services/collaborateService";
import { addChatHistory, addChatMessage } from "@/features/room/chatSlice";

const Chatbox = React.memo(({ user, currentRoom }) => {
  const chats = useSelector((state) => state.chat.message);
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const socketRef = useRef(null);

  const handleSendMsg = () => {
    if (socketRef.current && msg.trim() && currentRoom && user) {
      // console.log("chat", socketRef.current);
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

  const { data: chatHistory, mutate: chatHistoryMutation } = useMutation({
    mutationFn: ({ roomId }) => getChatHistory({ roomId }),
    onSuccess: (res) => {
      dispatch(addChatHistory(res));
    },
  });

  useEffect(() => {
    if (user && currentRoom) {
      chatHistoryMutation({ roomId: currentRoom.roomId });
      const socket = initSocket(
        `${import.meta.env.VITE_WS_BASE_URL}/ws`,
        dispatch
      );
      socketRef.current = socket;
      return () => {
        socket.close();
        socketRef.current = null;
      };
    }
  }, [user, currentRoom]);

  return (
    <div>
      <div className="h-[20rem] border-2 border-red-600">
        <MainContainer>
          <ChatContainer>
            <MessageList>
              {chats &&
                chats.map((msg, idx) => (
                  <Message
                    key={idx}
                    model={{
                      // this message won't be shown, we use CustomContent instead
                      message: "",
                      direction:
                        msg.userId === user.username ? "outgoing" : "incoming",
                    }}
                  >
                    <Message.CustomContent>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {/* Sender Name */}
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#888",
                            marginBottom: "4px",
                          }}
                        >
                          {msg.userId}
                        </span>

                        {/* Actual Message Content */}
                        <div
                          style={{
                            backgroundColor:
                              msg.userId === user.username ? "#DCF8C6" : "#FFF",
                            color: "#000",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            maxWidth: "80%",
                            wordWrap: "break-word",
                          }}
                        >
                          {msg.message}
                        </div>
                      </div>
                    </Message.CustomContent>
                  </Message>
                ))}
            </MessageList>
          </ChatContainer>
        </MainContainer>
      </div>
      <div>
        <Input value={msg} onChange={(e) => setMsg(e.target.value)} />
        <Button disabled={!socketRef.current} onClick={handleSendMsg}>
          Send
        </Button>
      </div>
    </div>
  );
});

export default Chatbox;
