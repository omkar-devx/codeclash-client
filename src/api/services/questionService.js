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

export const questionSearch = async (searchKey) => {
  try {
    console.log("serach key", searchKey);
    const questions = await api.get(
      `${API_ENDPOINTS.QUESTIONS.QUESTIONSEARCH}?searchKey=${searchKey}`
    );
    console.log("search questions", questions.data.data);
    return questions.data.data;
  } catch (error) {
    console.warn(
      error.response?.data?.message ||
        "something went wrong while search questions"
    );
    return [];
  }
};

export const isQuestionSubmitted = async (questionId) => {
  try {
    const res = await api.get(
      `${API_ENDPOINTS.QUESTIONS.ISSUBMITTED(questionId)}`
    );
    if (!res) {
      toast.error("something went wrong !!! (question is submitted)");
      throw new Error("something went wrong !!");
    }
    return res?.data?.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went wrong on server"
    );
    return {};
  }
};
