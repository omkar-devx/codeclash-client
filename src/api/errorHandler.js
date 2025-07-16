import toast from "react-hot-toast";

export default function ApiError(error) {
  const status = error?.response?.status;

  switch (status) {
    case 400:
      toast.error(`Validation Error : ${error.response?.data?.message}`);
      console.warn("Validation Error", error.response?.data?.message);
      break;
    case 401:
      toast.error(`Unauthorized Access`);
      console.warn("Unauthorized Access");
      break;
    case 403:
      toast.error(`Forbidden : Access Denied`);
      console.warn("Forbidden : Access Denied");
      break;
    case 404:
      toast.error(`Resourse Not Found`);
      console.warn("Resourse Not Found");
      break;
    case 500:
      toast.error(`Internal Server Error`);
      console.warn("Internal Server Error");
      break;
    default:
      toast.error(`Something Went Wrong..`);
      console.warn("Something Went Wrong..");
  }
}
