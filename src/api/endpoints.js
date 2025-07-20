export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_ACCESSTOKEN: "/auth/refresh-accesstoken",
    CURRENTUSER: "/auth/me",
  },
  USER: {},
  QUESTIONS: {
    PROBLEMSET: "/questions/problemset",
    FINDBYID: (questionId) => `/questions/${questionId}`,
    QUESTIONLIKE: (questionId) => `/questions/${questionId}/like`,
    QUESTIONCOMMENT: (questionId) => `/questions/${questionId}/comment`,
    QUESTIONBOOKMARK: (questionId) => `/questions/${questionId}/bookmark`,
  },
  CODE: {
    CODERUN: "/coderunner/run",
    CODESUBMIT: "/coderunner/submit",
  },
};
