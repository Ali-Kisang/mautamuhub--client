import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore"; // ✅ Added for active chat tracking
import { socket } from "../utils/socket";
import moment from "moment";
import { Check, CheckCheck, Send, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { MessageCircle } from "lucide-react";

export default function Chat() {
  const { id: receiverId } = useParams();
  const { user } = useAuthStore();
  const { setActiveChat } = useChatStore(); // ✅ Track open chat for unread logic
  const [editingMessage, setEditingMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [receiverName, setReceiverName] = useState("User");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const typingTimeoutRef = useRef(null); // ✅ For debounced typing

  // ✅ scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Chat.jsx
  useEffect(() => {
    const fetchReceiverName = async () => {
      try {
        const res = await api.get(`/users/profile/${receiverId}`);
        // ✅ Corrected path
        setReceiverName(res.data.user.username || "User");
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

    // new message (NO auto-markAsSeen—chat is open!)
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.senderId.toString() === receiverId && msg.receiverId.toString() === user._id.toString()) ||
        (msg.receiverId.toString() === receiverId && msg.senderId.toString() === user._id.toString())
      ) {
        setMessages((prev) => [...prev, msg]); // Just add—no DB mark for unread sync

        // ✅ mark delivered (still useful)
        socket.emit("markDelivered", {
          messageId: msg._id,
          receiverId: msg.senderId,
        });

        // ✅ play notification + toast if message is from the other user
        if (msg.senderId.toString() === receiverId) {
          playNotificationSound();
          toast.success(`${receiverName}: ${msg.message}`, {
            icon: <MessageCircle size={22} />,
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
      if (senderId.toString() === receiverId) setTypingUser(receiverName);
    });

    socket.on("stopTyping", (senderId) => {
      if (senderId.toString() === receiverId) setTypingUser(null);
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

    // initial fetch + mark all as seen
    (async () => {
      try {
        const res = await api.get(`/chat/${receiverId}`);
        setMessages(res.data);

        // ✅ Mark ALL prior messages as seen (DB sync for unread)
        if (res.data.length > 0) {
          await api.put(`/chat/mark-read/${receiverId}`);
        }
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    })();

    // ✅ Set active chat
    setActiveChat(receiverId);

    return () => {
      socket.off("receiveMessage");
      socket.off("messageEdited");
      socket.off("messageDeleted");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messageSeen");
      socket.off("messageDelivered");
      setActiveChat(null); // ✅ Clear on unmount (close chat)
    };
  }, [receiverId, user?._id, receiverName, setActiveChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ send message (with FormData for Multer compatibility)
  const sendMessage = async () => {
    if (!text.trim()) return;

    if (editingMessage) {
      try {
        const res = await api.put("/chat/edit", {
          messageId: editingMessage._id,
          newText: text,
        });
        socket.emit("editMessage", res.data);
        setMessages((prev) =>
          prev.map((msg) => (msg._id === editingMessage._id ? res.data : msg))
        );
        setEditingMessage(null);
        setText("");
      } catch (err) {
        console.error("Edit failed FULL ERROR:", err.response?.data || err.message || err); 
        toast.error("Failed to edit message: " + (err.response?.data?.error || err.message));
      }
      return;
    }

    try {
      // ✅ Use FormData for text-only send (Multer expects multipart)
      const formData = new FormData();
      formData.append("receiverId", receiverId);
      formData.append("message", text);

      const res = await api.post("/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Sent res.data:", res.data); // Debug: Confirm add payload
      socket.emit("sendMessage", res.data);
      setMessages((prev) => {
        const updated = [...prev, res.data];
        console.log("📝 Updated messages count:", updated.length); // Debug: See growth
        return updated;
      });
      setText("");
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket.emit("stopTyping", { senderId: user._id, receiverId });
    } catch (err) {
      console.error("Send failed FULL ERROR:", err.response?.data || err.message || err); 
      toast.error("Failed to send message: " + (err.response?.data?.error || err.message));
    }
  };

  // ✅ edit message
  const handleEdit = (m) => {
    setEditingMessage(m);
    setText(m.message);
  };

  // ✅ delete message
  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col space-y-3">
          <span className="text-sm">Do you want to delete this message?</span>
          <div className="flex space-x-3">
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              onClick={async () => {
                try {
                  await api.delete(`/chat/${id}`);
                  socket.emit("deleteMessage", id);
                  setMessages((prev) =>
                    prev.map((m) =>
                      m._id === id ? { ...m, deleted: true } : m
                    )
                  );
                  toast.dismiss(t.id);
                  toast.success("Message deleted");
                } catch (err) {
                  console.error("Delete failed:", err);
                  toast.error("Failed to delete message");
                }
              }}
            >
              Delete
            </button>
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 4000,
        position: "left-center",
      }
    );
  };

  // ✅ typing (debounced to avoid spam)
  const handleTyping = (e) => {
    const value = e.target.value;
    setText(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (value.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", { senderId: user._id, receiverId });
      }, 500); // Debounce 500ms
    } else {
      socket.emit("stopTyping", { senderId: user._id, receiverId });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 mt-16">
      <div className="p-4 bg-pink-600 text-white font-semibold text-lg shadow flex items-center justify-between">
        <span>Chat with {receiverName}</span>
        <button
          onClick={() => navigate("/profile")}
          className="bg-white text-pink-600 px-3 py-1 rounded-md text-sm hover:bg-pink-100 transition hover:cursor-pointer"
        >
          ← Back to Profile
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isMine = m.senderId.toString() === user._id.toString();
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
                  <Trash2 className="text-gray-800" />
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
                      <Check
                        className={`w-4 h-4 ${isMine ? "text-white" : "text-gray-800"}`}
                        aria-label="Delivered"
                      />
                    )}
                    {m.status === "seen" && (
                      <CheckCheck
                        className={`w-4 h-4 ${isMine ? "text-white" : "text-gray-800"}`}
                        aria-label="Seen"
                      />
                    )}
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

        {typingUser && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-500 font-medium">{typingUser}</span>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        {editingMessage && (
          <div className="p-2 bg-yellow-100 text-sm text-gray-700 flex justify-between items-center rounded-t-md">
            <span>Editing: {editingMessage.message}</span>
            <button
              onClick={() => {
                setEditingMessage(null);
                setText("");
              }}
              className="text-red-500 hover:underline text-xs"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={text}
            onChange={handleTyping}
            placeholder={editingMessage ? "Edit your message..." : "Type your message..."}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()} 
            className="
              flex-1 rounded-2xl border border-gray-300 
              px-4 py-3 text-sm 
              focus:outline-none focus:ring-2 focus:ring-pink-400
              transition duration-200
            "
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()} 
            className="
              flex items-center justify-center 
              bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed
              text-white rounded-full 
              h-12 w-12 
              transition duration-200
              shadow-md hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-pink-300
            "
          >
            <Send className="w-5 h-5 hover:cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
}