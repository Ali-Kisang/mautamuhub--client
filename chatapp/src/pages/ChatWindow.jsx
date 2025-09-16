import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { socket } from "../utils/socket";
import api from "../utils/axiosInstance";
import moment from "moment";
import { Send, Trash2, Check, CheckCheck, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function FloatingChat({ receiver, onClose }) {
  const { user } = useAuthStore();
  const receiverId = receiver?._id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [typingUser, setTypingUser] = useState(null);

  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Play notification sound
  const playNotificationSound = () => {
    const audio = new Audio("/notify.wav");
    audio.play().catch((err) => console.error("Audio play failed:", err));
  };

  // Mark message as seen
  const markAsSeen = (msg) => {
    api.put(`/chat/seen/${msg._id}`);
    socket.emit("markSeen", {
      messageId: msg._id,
      senderId: msg.senderId,
      receiverId: user._id,
    });
  };

  // Fetch initial messages
  useEffect(() => {
    if (!receiverId) return;
    (async () => {
      try {
        const res = await api.get(`/chat/${receiverId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    })();
  }, [receiverId]);

  // Socket events
  useEffect(() => {
    if (!user?._id || !receiverId) return;

    socket.emit("joinRoom", user._id);

    socket.on("receiveMessage", (msg) => {
      if (
        (msg.senderId === receiverId && msg.receiverId === user._id) ||
        (msg.receiverId === receiverId && msg.senderId === user._id)
      ) {
        setMessages((prev) => [...prev, msg]);

        if (msg.receiverId === user._id) markAsSeen(msg);

        socket.emit("markDelivered", {
          messageId: msg._id,
          receiverId: msg.senderId,
        });

        if (msg.senderId === receiverId) {
          playNotificationSound();
          toast.success(`${receiver.username}: ${msg.message}`, {
            icon: <MessageCircle size={22} />,
            duration: 4000,
            style: { background: "#fff", color: "#333", fontSize: "14px" },
          });
        }
      }
    });

    socket.on("messageEdited", (msg) => {
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
    });

    socket.on("messageDeleted", (msgId) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, deleted: true } : m))
      );
    });

    socket.on("typing", (senderId) => {
      if (senderId === receiverId) setTypingUser(receiver.username);
    });

    socket.on("stopTyping", (senderId) => {
      if (senderId === receiverId) setTypingUser(null);
    });

    socket.on("messageSeen", (msgId) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, status: "seen" } : m))
      );
    });

    socket.on("messageDelivered", (msgId) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, status: "delivered" } : m))
      );
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageEdited");
      socket.off("messageDeleted");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messageSeen");
      socket.off("messageDelivered");
    };
  }, [receiverId, user?._id, receiver?.username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send or edit message
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

  // Edit message
  const handleEdit = (msg) => {
    setEditingMessage(msg);
    setText(msg.message);
  };

  // Delete message
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
                } catch (err) {
                  console.error("Delete failed:", err);
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
      { duration: 4000, position: "left-center" }
    );
  };

  // Typing handler
  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", { senderId: user._id, receiverId });
    if (e.target.value === "") {
      socket.emit("stopTyping", { senderId: user._id, receiverId });
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 border rounded-md shadow-md">
      {/* Header */}
      <div className="p-3 bg-pink-600 text-white font-semibold flex justify-between items-center rounded-t-md">
        <span>Chat with {receiver?.username || "User"}</span>
        <button onClick={onClose} className="text-white font-bold px-2 py-1">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m) => {
          const isMine = m.senderId === user._id;
          return (
            <div
              key={m._id}
              className={`p-2 rounded-xl max-w-[70%] break-words relative ${
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
                    <span className="text-[10px] italic opacity-70">(edited)</span>
                  )}
                </>
              )}

              <p className="text-[10px] mt-1 opacity-60 flex items-center space-x-1">
                <span>{moment(m.createdAt).fromNow()}</span>
                {isMine && !m.deleted && (
                  <>
                    {m.status === "sent" && <span>✔</span>}
                    {m.status === "delivered" && (
                      <Check className="w-4 h-4" aria-label="Delivered" />
                    )}
                    {m.status === "seen" && (
                      <CheckCheck className="w-4 h-4" aria-label="Seen" />
                    )}
                  </>
                )}
              </p>

              {isMine && !m.deleted && (
                <div className="text-[11px] mt-1 flex space-x-3">
                  <button onClick={() => handleEdit(m)} className="hover:underline text-yellow-100">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(m._id)} className="hover:underline text-red-100">
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
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
      <div className="p-3 border-t bg-white rounded-b-md">
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
            placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
            className="flex-1 rounded-2xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          <button
            onClick={sendMessage}
            className="flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white rounded-full h-10 w-10 transition shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
