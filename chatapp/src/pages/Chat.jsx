import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import { socket } from "../utils/socket";
import moment from "moment";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

export default function Chat() {
  const { id: receiverId } = useParams();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [receiverName, setReceiverName] = useState("User");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // ✅ mark message as seen (update DB and emit socket)
  const markAsSeen = (msg) => {
    api.put(`/chat/seen/${msg._id}`);
    socket.emit("markSeen", {
      messageId: msg._id,
      senderId: msg.senderId,
      receiverId: user._id,
    });
  };

  

  // ✅ scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ fetch receiver name
  useEffect(() => {
    const fetchReceiverName = async () => {
      try {
        const res = await api.get(`/users/profile/${receiverId}`);
        setReceiverName(res.data.personal?.username || "User");
      } catch (err) {
        console.error("Error fetching receiver name:", err);
      }
    };
    if (receiverId) fetchReceiverName();
  }, [receiverId]);

  // ✅ play sound
  const playNotificationSound = () => {
    const audio = new Audio("/notify.wav");
    audio.play().catch((err) => console.error("Audio play failed:", err));
  };

  // ✅ main socket effect
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("joinRoom", user._id);

    // new message
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.senderId === receiverId && msg.receiverId === user._id) ||
        (msg.receiverId === receiverId && msg.senderId === user._id)
      ) {
        setMessages((prev) => [...prev, msg]);

        // ✅ mark seen if I am receiver
        if (msg.receiverId === user._id) {
          markAsSeen(msg);
        }

        // ✅ mark delivered
        socket.emit("markDelivered", {
          messageId: msg._id,
          receiverId: msg.senderId,
        });

        // ✅ play notification + toast if message is from the other user
        if (msg.senderId === receiverId) {
          playNotificationSound();
          toast.success(`${receiverName}: ${msg.message}`, {
            icon: "💌",
            duration: 4000,
            style: {
              background: "#fff",
              color: "#333",
              fontSize: "14px",
            },
          });
        }
      }
    });

    // edited
    socket.on("messageEdited", (msg) => {
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
    });

    // deleted
    socket.on("messageDeleted", (msgId) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, deleted: true } : m))
      );
    });

    // typing
    socket.on("typing", (senderId) => {
      if (senderId === receiverId) setTypingUser(receiverName);
    });

    socket.on("stopTyping", (senderId) => {
      if (senderId === receiverId) setTypingUser(null);
    });

    // ✅ seen status update
    socket.on("messageSeen", (msgId) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, status: "seen" } : m))
      );
    });

    // ✅ delivered status update
    socket.on("messageDelivered", (msgId) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, status: "delivered" } : m))
      );
    });

    // initial fetch
    (async () => {
      try {
        const res = await api.get(`/chat/${receiverId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    })();

    return () => {
      socket.off("receiveMessage");
      socket.off("messageEdited");
      socket.off("messageDeleted");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messageSeen");
      socket.off("messageDelivered");
    };
  }, [receiverId, user?._id, receiverName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ send message
  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await api.post("/chat", { receiverId, message: text });
      socket.emit("sendMessage", res.data);
      setMessages((prev) => [...prev, res.data]);
      setText("");
      socket.emit("stopTyping", { senderId: user._id, receiverId });
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  // ✅ edit message
  const handleEdit = async (m) => {
    const newText = prompt("Edit message", m.message);
    if (!newText || newText === m.message) return;
    try {
      const res = await api.put("/chat/edit", {
        messageId: m._id,
        newText,
      });
      socket.emit("editMessage", res.data);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === m._id ? res.data : msg))
      );
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  // ✅ delete message
  const handleDelete = async (id) => {
    try {
      await api.delete(`/chat/${id}`);
      socket.emit("deleteMessage", id);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, deleted: true } : m))
      );
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ typing
  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", { senderId: user._id, receiverId });
    if (e.target.value === "") {
      socket.emit("stopTyping", { senderId: user._id, receiverId });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 mt-16">
      <div className="p-4 bg-pink-600 text-white font-semibold text-lg shadow flex items-center justify-between">
        <span>Chat with {receiverName}</span>
        <button
          onClick={() => navigate("/profile")}
          className="bg-white text-pink-600 px-3 py-1 rounded-md text-sm hover:bg-pink-100 transition"
        >
          ← Back to Profile
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isMine = m.senderId === user._id;
          return (
            <div
              key={m._id}
              className={`p-3 rounded-2xl shadow-sm max-w-[70%] break-words relative ${
                isMine
                  ? "ml-auto bg-pink-500 text-white rounded-br-sm"
                  : "mr-auto bg-white text-gray-800 border rounded-bl-sm"
              }`}
            >
              {m.deleted ? (
                <p className="italic flex items-center space-x-1">
                  <span>🗑️</span>
                  <span>This message was deleted</span>
                </p>
              ) : (
                <>
                  <p>{m.message}</p>
                  {m.edited && (
                    <span className="text-[10px] italic opacity-70">
                      (edited)
                    </span>
                  )}
                </>
              )}

              {/* timestamp + status */}
              <p className="text-[10px] mt-1 opacity-60 flex items-center space-x-1">
                <span>{moment(m.createdAt).fromNow()}</span>
                {isMine && !m.deleted && (
                  <>
                    {m.status === "sent" && <span title="Sent">✔</span>}
                    {m.status === "delivered" && (
                      <span className="text-green-500" title="Delivered">
                        ✔✔
                      </span>
                    )}
                    {m.status === "seen" && <span title="Seen">👁️👁️</span>}
                  </>
                )}
              </p>

              {isMine && !m.deleted && (
                <div className="text-[11px] mt-1 flex space-x-3">
                  <button
                    onClick={() => handleEdit(m)}
                    className="hover:underline text-yellow-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="hover:underline text-red-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {typingUser && (
          <p className="italic text-sm text-gray-500 mt-2">
            ✍️ <span className="font-medium">{typingUser}</span> is typing...
          </p>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={text}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="
              flex-1 rounded-2xl border border-gray-300 
              px-4 py-3 text-sm 
              focus:outline-none focus:ring-2 focus:ring-pink-400
              transition duration-200
            "
          />
          <button
            onClick={sendMessage}
            className="
              flex items-center justify-center 
              bg-pink-500 hover:bg-pink-600 
              text-white rounded-full 
              h-12 w-12 
              transition duration-200
              shadow-md hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-pink-300
            "
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
