import { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";
import { useAuthStore } from "../store/useAuthStore";
import api from "../utils/axiosInstance";
import moment from "moment";
import { Send } from "lucide-react";

export default function ChatPanel({ receiver }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ Fetch chat history when receiver changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiver?._id || !user?._id) return;
      try {
        const res = await api.get(`/chat/${receiver._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };
    fetchMessages();
  }, [receiver?._id, user?._id]);

  // ✅ Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Socket listeners
  useEffect(() => {
    if (!receiver?._id) return;

    const handleReceive = (msg) => {
      if (
        (msg.senderId === receiver._id && msg.receiverId === user._id) ||
        (msg.receiverId === receiver._id && msg.senderId === user._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTyping = (senderId) => {
      if (senderId === receiver._id) setTyping(true);
    };

    const handleStopTyping = (senderId) => {
      if (senderId === receiver._id) setTyping(false);
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [receiver?._id, user?._id]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!text.trim() || !receiver?._id) return;
    try {
      const res = await api.post("/chat", { receiverId: receiver._id, message: text });
      setMessages((prev) => [...prev, res.data]);
      socket.emit("sendMessage", res.data);
      setText("");
      socket.emit("stopTyping", { senderId: user._id, receiverId: receiver._id });
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  // ✅ Typing handler
  const handleTyping = (e) => {
    setText(e.target.value);
    if (e.target.value.trim()) {
      socket.emit("typing", { senderId: user._id, receiverId: receiver._id });
    } else {
      socket.emit("stopTyping", { senderId: user._id, receiverId: receiver._id });
    }
  };

  if (!receiver?._id) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        👈 Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 bg-pink-600 text-white font-semibold flex items-center gap-3 shadow">
        <img
          src={receiver.avatar || "/default-avatar.png"}
          alt={receiver.username}
          className="w-10 h-10 rounded-full object-cover border border-white"
        />
        <div>
          <p className="text-lg">{receiver.username}</p>
          {typing && <p className="text-xs italic text-white/80">✍️ typing…</p>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m) => {
          const mine = m.senderId === user._id;
          return (
            <div
              key={m._id}
              className={`p-3 rounded-2xl max-w-[70%] shadow ${
                mine
                  ? "ml-auto bg-pink-500 text-white rounded-br-sm"
                  : "mr-auto bg-white text-gray-800 border rounded-bl-sm"
              }`}
            >
              <p>{m.message}</p>
              <p className="text-[10px] mt-1 opacity-60">{moment(m.createdAt).fromNow()}</p>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white">
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={handleTyping}
            placeholder="Type a message…"
            className="flex-1 rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          <button
            onClick={sendMessage}
            className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
