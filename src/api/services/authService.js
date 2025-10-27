import axios from "axios";
import { API_ENDPOINTS } from "../endpoints";
import api from "../axios";
import toast from "react-hot-toast";

// current user
export const userCheck = async () => {
  try {
    const res = await api.get(API_ENDPOINTS.AUTH.CURRENTUSER);

    return res.data.user;
  } catch (error) {
    throw new Error(error.response?.data?.message || "User is not Logged in");
  }
};

// try to refresh the access token
export const refreshAccessToken = async () => {
  try {
    const res = await api.post(API_ENDPOINTS.AUTH.REFRESH_ACCESSTOKEN);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "access token is not refreshed"
    );
  }
};

// user login
export const userLogin = async (userCredentials) => {
  try {
    const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, userCredentials, {
      withCredentials: true,
    });
    console.log(res.data);
    // api.defaults.headers.common.Authorization = `Bearer${res.data.data.accessToken}`;
    // api.defaults.headers.common.refreshToken = res.data.data.refreshToken;
    return res.data;
  } catch (error) {
    // console.log("login error", error.response?.data?.message);
    throw new Error(error.response?.data?.message || "User Login Failed");
  }
};

// user register
export const userRegister = async (userData) => {
  try {
    const res = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.log("Register error", error.response?.data?.message);
    throw new Error(error.response?.data?.message || "User Register Failed");
  }
};

// user logout
export const userLogout = async () => {
  try {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    throw new Error(error.response?.data?.message || "User Logout Failed");
  }
};

export const getUserProfile = async (username) => {
  try {
    console.log("this is username", username);
    const res = await api.post(
      `${API_ENDPOINTS.AUTH.GETUSERPROFILE(username)}`
    );
    if (!res) {
      toast.error("something went wrong on userprofile");
    }
    // console.log(res.data);
    return res.data.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went wrong on server"
    );
    return {};
  }
};
