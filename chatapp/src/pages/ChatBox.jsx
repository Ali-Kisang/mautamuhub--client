import { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";
import api from "../utils/axiosInstance";
import moment from "moment";
import { Send } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function ChatBox({ receiver, onBack }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!receiver) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${receiver.userId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };
    fetchMessages();
  }, [receiver]);

  useEffect(() => {
    const handleReceive = (msg) => {
      if (
        msg.senderId === receiver.userId ||
        msg.receiverId === receiver.userId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("receiveMessage", handleReceive);

    socket.on("typing", (senderId) => {
      if (senderId === receiver.userId) setIsTyping(true);
    });
    socket.on("stopTyping", (senderId) => {
      if (senderId === receiver.userId) setIsTyping(false);
    });

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [receiver]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await api.post("/chat", {
        receiverId: receiver.userId,
        message: text,
      });
      socket.emit("sendMessage", res.data);
      setMessages((prev) => [...prev, res.data]);
      setText("");
      socket.emit("stopTyping", {
        senderId: user._id,
        receiverId: receiver.userId,
      });
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setText(value);

    socket.emit("typing", { senderId: user._id, receiverId: receiver.userId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: user._id,
        receiverId: receiver.userId,
      });
    }, 2000);
  };

  return (
    <div className="mt-4 border rounded-xl bg-white shadow flex flex-col h-full">
      {/* Header */}
      <div className="p-3 bg-pink-600 text-white rounded-t-xl flex items-center justify-between">
        <h2 className="font-semibold text-sm sm:text-base">
          Chat with {receiver.username}
        </h2>
        <button
          onClick={onBack}
          className="text-xs sm:text-sm underline hover:text-gray-200"
        >
          ← Back to profile
        </button>
      </div>

      {/* Messages */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {messages.map((m) => {
          const isMine = m.senderId === user._id;
          return (
            <div
              key={m._id}
              className={`p-2 rounded-lg max-w-[70%] break-words shadow-sm ${
                isMine
                  ? "ml-auto bg-pink-500 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              <p>{m.message}</p>
              <p className="text-[10px] opacity-60 mt-1">
                {moment(m.createdAt).fromNow()}
              </p>
            </div>
          );
        })}
        {isTyping && (
          <p className="italic text-sm text-gray-500 mt-2 animate-pulse">✍️ typing…</p>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-3 border-t flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="Type your message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          onClick={sendMessage}
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
