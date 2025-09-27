import toast from "react-hot-toast";
import api from "../axios";
import { API_ENDPOINTS } from "../endpoints";

export const userCreateRoom = async ({ roomId, questionArray }) => {
  try {
    const room = await api.post(API_ENDPOINTS.ROOM.CREATEROOM, {
      roomId,
      questionArray,
    });
    if (!room) {
      toast.error("Room was not created");
    }
    return room.data.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went wrong in room creation"
    );
    return null;
  }
};

export const userJoinRoom = async ({ roomId }) => {
  try {
    // console.log("service roomid", roomId);
    const room = await api.post(API_ENDPOINTS.ROOM.JOINROOM, { roomId });
    if (!room) {
      toast.error("Unable To Join Room");
    }
    return room.data.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went wrong while Join Room"
    );
    return null;
  }
};

export const getCurrentRoom = async () => {
  try {
    const currentRoom = await api.post(API_ENDPOINTS.ROOM.CURRENTROOM);
    console.log("room", currentRoom.data.data);

    return currentRoom.data.data;
  } catch (error) {
    console.log(error.response?.data?.message);
    // toast.error("Something went Wrong on Current Room");
    return null;
  }
};

export const leaveRoom = async () => {
  try {
    await api.post(API_ENDPOINTS.ROOM.LEAVEROOM);
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went wrong on leave room"
    );
    return null;
  }
};

export const getMultipleQuestions = async ({ questionArray }) => {
  try {
    // console.log("question array ", questionArray);
    const questions = await api.post(
      API_ENDPOINTS.QUESTIONS.MULTIPLEQUESTIONS,
      { questionArray }
    );
    if (!questions) {
      toast.error("Unable to Fetch Questions");
    }
    // console.log("main question", questions.data);

    return questions.data.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Something went wrong while Fetching Questions"
    );
    return null;
  }
};

export const getChatHistory = async ({ roomId }) => {
  try {
    const chatHistory = await api.post(API_ENDPOINTS.ROOM.CHATHISTORY, {
      roomId,
    });
    // console.log(chatHistory.data.data);
    return chatHistory.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message);
    return [];
  }
};

export const getRoomUsers = async ({ roomId }) => {
  try {
    const roomUsers = await api.post(API_ENDPOINTS.ROOM.ROOMUSERS, { roomId });
    console.log("get room users", roomUsers.data.data);
    return roomUsers.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message);
    return [];
  }
};

export const getUsersOnline = async ({ roomId }) => {
  try {
    const usersOnline = await api.post(API_ENDPOINTS.ROOM.USERSONLINE, {
      roomId,
    });
    console.log("get users online", usersOnline.data.data);
    return usersOnline.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message);
    return [];
  }
};
