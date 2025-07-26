import toast from "react-hot-toast";
import { addChatMessage } from "@/features/room/chatSlice";

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;
let reconnectTimeout = null;
let globalDispatch = null;
let socketURL = null;

export const getSocket = () => socket;

export const initSocket = (url, dispatch) => {
  socketURL = url;
  globalDispatch = dispatch;

  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }
  socket = new WebSocket(url);

  setupSocketListners(socket, globalDispatch);

  return socket;
};

export const setupSocketListners = (socket, dispatch) => {
  socket.onopen = () => {
    console.log("websocket connected");
    reconnectAttempts = 0;
  };

  socket.onmessage = (e) => {
    const { type, payload } = JSON.parse(e.data);

    switch (type) {
      case `chat-message`:
        dispatch(addChatMessage(payload));
        break;
      case "error":
        console.log("error", payload.message);
        break;
      default:
        console.warn("Unknown message type", type);
    }
  };

  socket.onclose = () => {
    console.warn("websocket disconnected");
    tryReconnect();
  };

  socket.onerror = (e) => {
    console.warn("websocket error", e);
  };
};

export const tryReconnect = () => {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    return;
  }

  reconnectAttempts++;

  reconnectTimeout = setTimeout(() => {
    if (socketURL && globalDispatch) {
      initSocket(socketURL, globalDispatch);
    }
  }, RECONNECT_DELAY);
};

// export const sendMessage = (type, payload) => {
//   // const socket = getSocket();
//   if (socket?.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify({ type, payload }));
//   } else {
//     toast.error("websocket not ready");
//   }
// };
