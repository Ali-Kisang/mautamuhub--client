import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://mautamuhub.com";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});
