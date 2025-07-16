import { refreshAccessToken, userCheck } from "@/api/services/authService";

const checkAuth = async () => {
  try {
    const data = await userCheck();
    return data;
  } catch (error) {
    try {
      await refreshAccessToken();
      const data = await userCheck();
      return data;
    } catch (error) {
      return null;
    }
  }
};

export default checkAuth;
