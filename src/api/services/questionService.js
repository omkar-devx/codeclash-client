import toast from "react-hot-toast";
import api from "../axios";
import { API_ENDPOINTS } from "../endpoints";

// fetch problemset questions
export const problemset = async () => {
  try {
    const res = await api.get(API_ENDPOINTS.QUESTIONS.PROBLEMSET);
    if (!res?.data) {
      toast.error("No Question Found");
      return [];
    }
    console.log("res problem", res.data.data);
    return res.data.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went Wrong on Server"
    );
    return [];
  }
};

export const questionById = async (questionId) => {
  try {
    console.log(API_ENDPOINTS.QUESTIONS.FINDBYID(questionId));
    const res = await api.get(API_ENDPOINTS.QUESTIONS.FINDBYID(questionId));
    if (!res?.data?.data) {
      toast.error("Unable to fetch Question");
      throw new Error("Unable to fetch Question");
    }
    return res.data.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went wrong on server"
    );
    return {};
  }
};
