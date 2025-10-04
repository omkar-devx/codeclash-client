import toast from "react-hot-toast";
import api from "../axios";
import { API_ENDPOINTS } from "../endpoints";

const DEFAULT_TIMEOUT_MS = 120000;

export const codeRun = async ({
  questionUId,
  language_id,
  source_code,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}) => {
  try {
    const res = await api.post(
      API_ENDPOINTS.CODE.CODERUN,
      { questionUId, language_id, source_code },
      { timeout: timeoutMs }
    );

    if (!res?.data) {
      const msg = "No response data from server";
      toast.error(msg);
      throw new Error(msg);
    }

    return res.data.data ?? res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something Went Wrong";
    toast.error(message);
    throw error;
  }
};

export const codeSubmit = async ({
  questionUId,
  language_id,
  source_code,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}) => {
  try {
    const res = await api.post(
      API_ENDPOINTS.CODE.CODESUBMIT,
      { questionUId, language_id, source_code },
      { timeout: timeoutMs }
    );

    if (!res?.data) {
      const msg = "No response data from server";
      toast.error(msg);
      throw new Error(msg);
    }

    return res.data.data ?? res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something Went Wrong";
    toast.error(message);
    throw error;
  }
};
