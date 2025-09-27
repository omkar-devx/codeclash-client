// src/websocket/socket.js
import toast from "react-hot-toast";
import { addChatMessage } from "@/features/room/chatSlice";

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 6;
const BASE_RECONNECT_DELAY = 1500; // ms
let reconnectTimeout = null;
let globalDispatch = null;
let socketURL = null;
let pendingQueue = []; // queue of raw JSON strings

export const getSocket = () => socket;

export const initSocket = (url, dispatch) => {
  socketURL = url;
  globalDispatch = dispatch;

  // reuse if already open/connecting
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return socket;
  }

  // clean up closed socket if present
  try {
    if (socket) {
      socket.close?.();
    }
  } catch (e) {
    console.warn("[WS] error closing old socket", e);
  }

  socket = new WebSocket(url);
  setupSocketListeners(socket, globalDispatch);

  return socket;
};

export const setupSocketListeners = (sock, dispatch) => {
  if (!sock) return;
  if (sock.__ws_listeners_installed) return;
  sock.__ws_listeners_installed = true;

  const onOpen = () => {
    console.log("[WS] connected");
    reconnectAttempts = 0;
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    // flush queue
    while (pendingQueue.length > 0 && sock.readyState === WebSocket.OPEN) {
      const raw = pendingQueue.shift();
      try {
        sock.send(raw);
      } catch (e) {
        console.warn("[WS] flush failed", e);
        pendingQueue.unshift(raw);
        break;
      }
    }
  };

  const onMessage = (ev) => {
    let parsed;
    try {
      parsed = JSON.parse(ev.data);
    } catch (err) {
      console.warn("[WS] invalid JSON", ev.data);
      return;
    }

    const { type, payload } = parsed;

    // chat handling: support "chat" or "chat-message"
    if ((type === "chat" || type === "chat-message") && payload) {
      if (dispatch) dispatch(addChatMessage(payload));
      return;
    }

    if (type === "error" && payload?.message) {
      console.warn("[WS] server error", payload.message);
      toast.error(payload.message);
      return;
    }

    // unknown message types
    console.debug("[WS] message", type, payload);
  };

  const onClose = (evt) => {
    console.warn("[WS] disconnected", evt?.reason || "");
    tryReconnect();
  };

  const onError = (e) => {
    console.warn("[WS] error", e);
  };

  sock.addEventListener("open", onOpen);
  sock.addEventListener("message", onMessage);
  sock.addEventListener("close", onClose);
  sock.addEventListener("error", onError);

  // store refs for cleanup
  sock._ws_onOpen = onOpen;
  sock._ws_onMessage = onMessage;
  sock._ws_onClose = onClose;
  sock._ws_onError = onError;
};

export const sendMessage = (type, payload) => {
  const s = socket;
  const raw = JSON.stringify({ type, payload });

  if (s && s.readyState === WebSocket.OPEN) {
    try {
      s.send(raw);
      return true;
    } catch (e) {
      console.warn("[WS] send failed", e);
      pendingQueue.push(raw);
      return false;
    }
  }

  pendingQueue.push(raw);
  return false;
};

export const joinRoom = (roomId, userId) => {
  if (!roomId || !userId) return;
  sendMessage("join-room", { roomId, userId });
};

export const leaveRoom = (roomId, userId) => {
  if (!roomId || !userId) return;
  sendMessage("leave-room", { roomId, userId });
};

export const tryReconnect = () => {
  if (reconnectTimeout || reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return;

  reconnectAttempts += 1;
  const delay = Math.min(
    30000,
    BASE_RECONNECT_DELAY * 2 ** (reconnectAttempts - 1)
  );

  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    if (socketURL && globalDispatch) {
      initSocket(socketURL, globalDispatch);
    }
  }, delay);
};

export const destroySocket = () => {
  try {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    if (socket) {
      if (socket.__ws_listeners_installed) {
        try {
          socket.removeEventListener("open", socket._ws_onOpen);
          socket.removeEventListener("message", socket._ws_onMessage);
          socket.removeEventListener("close", socket._ws_onClose);
          socket.removeEventListener("error", socket._ws_onError);
        } catch (e) {
          /* ignore */
        }
        socket.__ws_listeners_installed = false;
      }
      socket.close?.();
    }
  } catch (e) {
    console.warn("[WS] destroy error", e);
  } finally {
    socket = null;
    pendingQueue = [];
    globalDispatch = null;
    socketURL = null;
    reconnectAttempts = 0;
  }
};
