// ✅ src/utils/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// // Load token from localStorage on startup
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;