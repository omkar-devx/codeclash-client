import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChatMessage: (state, action) => {
      state.message.push(action.payload);
    },
    addChatHistory: (state, action) => {
      const chatHistoryArry = action.payload;
      state.message = chatHistoryArry.reverse();
    },
  },
});

export const { addChatMessage, addChatHistory } = chatSlice.actions;
export default chatSlice.reducer;
