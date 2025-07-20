import toast from "react-hot-toast";
import api from "../axios";
import { API_ENDPOINTS } from "../endpoints";

export const codeRun = async ({ questionUId, language_id, source_code }) => {
  try {
    const res = await api.post(API_ENDPOINTS.CODE.CODERUN, {
      questionUId,
      language_id,
      source_code,
    });
    if (!res?.data) {
      toast.error("Something went wrong try again..");
    }
    return res.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Something Went Wrong");
    return {};
  }
};

export const codeSubmit = async ({ questionUid, language_id, source_code }) => {
  try {
    const res = await api.post(API_ENDPOINTS.CODE.CODESUBMIT, {
      questionUid,
      language_id,
      source_code,
    });
    if (!res?.data) {
      toast.error("Something went wrong try again..");
    }
    return res.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Something Went Wrong");
    return {};
  }
};
