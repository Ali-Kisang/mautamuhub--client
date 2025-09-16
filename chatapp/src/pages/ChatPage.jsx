// src/pages/ChatPage.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import { socket } from "../utils/socket";
import moment from "moment";
import { Check, CheckCheck, Send, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  const { id: receiverId } = useParams();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [receiverName, setReceiverName] = useState("User");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Fetch receiver name
  useEffect(() => {
    if (!receiverId) return;
    (async () => {
      try {
        const res = await api.get(`/users/profile/${receiverId}`);
        setReceiverName(res.data.user.username || "User");
      } catch (err) {
        console.error("Fetch receiver name failed:", err);
      }
    })();
  }, [receiverId]);

  // ✅ Socket listeners
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("joinRoom", user._id);

    socket.on("receiveMessage", (msg) => {
      if (
        (msg.senderId === receiverId && msg.receiverId === user._id) ||
        (msg.receiverId === receiverId && msg.senderId === user._id)
      ) {
        setMessages((prev) => [...prev, msg]);

        if (msg.receiverId === user._id) {
          api.put(`/chat/seen/${msg._id}`);
          socket.emit("markSeen", {
            messageId: msg._id,
            senderId: msg.senderId,
            receiverId: user._id,
          });
        }

        socket.emit("markDelivered", {
          messageId: msg._id,
          receiverId: msg.senderId,
        });

        if (msg.senderId === receiverId) {
          const audio = new Audio("/notify.wav");
          audio.play().catch(() => {});
          toast.success(`${receiverName}: ${msg.message}`, {
            icon: <MessageCircle size={20} />,
            duration: 4000,
          });
        }
      }
    });

    socket.on("messageEdited", (msg) =>
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)))
    );

    socket.on("messageDeleted", (msgId) =>
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, deleted: true } : m))
      )
    );

    socket.on("typing", (senderId) => {
      if (senderId === receiverId) setTypingUser(receiverName);
    });

    socket.on("stopTyping", (senderId) => {
      if (senderId === receiverId) setTypingUser(null);
    });

    socket.on("messageSeen", (msgId) =>
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, status: "seen" } : m))
      )
    );

    socket.on("messageDelivered", (msgId) =>
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, status: "delivered" } : m))
      )
    );

    // Initial fetch
    (async () => {
      try {
        const res = await api.get(`/chat/${receiverId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch chat failed:", err);
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

  // ✅ Send / Edit Message
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
        console.error("Edit failed:", err);
      }
      return;
    }

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

  // ✅ Delete message
  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col space-y-2">
          <span className="text-sm">Delete this message?</span>
          <div className="flex space-x-3">
            <button
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
                } catch (err) {
                  console.error("Delete failed:", err);
                }
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 4000, position: "top-center" }
    );
  };

  // ✅ Typing
  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", { senderId: user._id, receiverId });
    if (e.target.value === "")
      socket.emit("stopTyping", { senderId: user._id, receiverId });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 mt-16">
      {/* Header */}
      <div className="p-4 bg-pink-600 text-white font-semibold text-lg shadow flex justify-between items-center">
        <span>Chat with {receiverName}</span>
        <button
          onClick={() => navigate("/profile")}
          className="bg-white text-pink-600 px-3 py-1 rounded-md text-sm hover:bg-pink-100"
        >
          ← Back
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isMine = m.senderId === user._id;
          return (
            <div
              key={m._id}
              className={`p-3 rounded-2xl max-w-[70%] shadow-sm relative ${
                isMine
                  ? "ml-auto bg-pink-500 text-white rounded-br-sm"
                  : "mr-auto bg-white text-gray-800 border rounded-bl-sm"
              }`}
            >
              {/* Deleted Message */}
              {m.deleted ? (
                <p className="italic text-gray-400 flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> This message was deleted
                </p>
              ) : (
                <>
                  <p>{m.message}</p>
                  {m.edited && (
                    <span className="text-[11px] italic opacity-70">(edited)</span>
                  )}
                </>
              )}

              {/* Timestamp + status */}
              <div className="text-[10px] mt-1 opacity-60 flex items-center gap-1">
                <span>{moment(m.createdAt).fromNow()}</span>
                {isMine && !m.deleted && (
                  <>
                    {m.status === "sent" && <span>✔</span>}
                    {m.status === "delivered" && <Check className="w-3 h-3" />}
                    {m.status === "seen" && <CheckCheck className="w-3 h-3" />}
                  </>
                )}
              </div>

              {/* Actions (Edit/Delete) */}
              {isMine && !m.deleted && (
                <div className="text-[11px] mt-1 flex space-x-3">
                  <button
                    onClick={() => {
                      setEditingMessage(m);
                      setText(m.message);
                    }}
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

        {/* Typing Indicator */}
        {typingUser && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-500">{typingUser}</span>
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
              className="text-red-500 text-xs hover:underline"
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
            placeholder={
              editingMessage ? "Edit your message..." : "Type a message..."
            }
            className="flex-1 rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={sendMessage}
            className="h-12 w-12 flex items-center justify-center rounded-full bg-pink-500 text-white hover:bg-pink-600"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
