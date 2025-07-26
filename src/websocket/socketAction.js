// import toast from "react-hot-toast";
// import { getSocket } from "./socket";
// import { addChatMessage } from "@/features/room/chatSlice";

// let reconnectAttempts = 0;
// const MAX_RECONNECT_ATTEMPTS = 5;
// const RECONNECT_DELAY = 3000;
// let reconnectTimeout = null;

// export const setupSocketListners = (socket, dispatch) => {
//   socket.onopen = () => {
//     console.log("websocket connected");
//     reconnectAttempts = 0;
//   };

//   socket.onmessage = (e) => {
//     const { type, payload } = JSON.parse(e.data);

//     switch (type) {
//       case `chat-message`:
//         dispatch(addChatMessage(payload));
//         break;
//       case "error":
//         console.log("error", payload.message);
//         break;
//       default:
//         console.warn("Unknown message type", type);
//     }
//   };

//   socket.onclose = () => {
//     console.warn("websocket disconnected");
//   };

//   socket.onerror = (e) => {
//     console.warn("websocket error", e);
//   };
// };

// export const tryReconnect = () => {
//   if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
//     return;
//   }
//   reconnectAttempts++;
//   reconnectTimeout = setTimeout(() => {

//   }, RECONNECT_DELAY);
// };

// export const sendMessage = (type, payload) => {
//   // const socket = getSocket();
//   if (socket?.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify({ type, payload }));
//   } else {
//     toast.error("websocket not ready");
//   }
// };
