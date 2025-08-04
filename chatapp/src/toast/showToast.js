import { toast } from "react-toastify";

export const showToast = (message, isError = false) => {
  toast(message, {
    type: isError ? "error" : "success",
    style: {
      background: isError ? "#FF6F61" : "#ec407a",
      color: "white",
    },
    position: "top-right",
    autoClose: 10000,
    hideProgressBar: true,
  });
};
