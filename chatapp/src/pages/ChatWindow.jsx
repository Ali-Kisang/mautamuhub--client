import { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";
import api from "../utils/axiosInstance";
import moment from "moment";
import { Send } from "lucide-react";

export default function ChatWindow({ selectedUser, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);

  // scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // mark message as seen
  const markAsSeen = (msg) => {
    api.put(`/chat/seen/${msg._id}`);
    socket.emit("markSeen", {
      messageId: msg._id,
      senderId: msg.senderId,
      receiverId: currentUser._id,
    });
  };

  // fetch messages when selected user changes
  useEffect(() => {
    if (!selectedUser?._id) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${selectedUser._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };
    fetchMessages();
  }, [selectedUser?._id]);

  // socket events
  useEffect(() => {
    if (!currentUser?._id || !selectedUser?._id) return;

    // join room
    socket.emit("joinRoom", currentUser._id);

    // receive new message
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.senderId === selectedUser._id &&
          msg.receiverId === currentUser._id) ||
        (msg.receiverId === selectedUser._id &&
          msg.senderId === currentUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
        // mark as seen if I am receiver
        if (msg.receiverId === currentUser._id) {
          markAsSeen(msg);
        }
        socket.emit("markDelivered", {
          messageId: msg._id,
          receiverId: msg.senderId,
        });
      }
    });

    socket.on("messageEdited", (msg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? msg : m))
      );
    });

    socket.on("messageDeleted", (msgId) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, deleted: true } : m))
      );
    });

    socket.on("typing", (senderId) => {
      if (senderId === selectedUser._id) setTypingUser(selectedUser.personal?.username);
    });

    socket.on("stopTyping", (senderId) => {
      if (senderId === selectedUser._id) setTypingUser(null);
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
  }, [selectedUser?._id, currentUser?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await api.post("/chat", {
        receiverId: selectedUser._id,
        message: text,
      });
      socket.emit("sendMessage", res.data);
      setMessages((prev) => [...prev, res.data]);
      setText("");
      socket.emit("stopTyping", {
        senderId: currentUser._id,
        receiverId: selectedUser._id,
      });
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
    });
    if (e.target.value === "") {
      socket.emit("stopTyping", {
        senderId: currentUser._id,
        receiverId: selectedUser._id,
      });
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-pink-600 text-white flex items-center space-x-3">
        <img
          src={
            selectedUser.avatar ||
            "https://via.placeholder.com/40x40?text=👤"
          }
          alt="avatar"
          className="w-10 h-10 rounded-full border"
        />
        <h2 className="font-semibold text-lg">
          {selectedUser.personal?.username || "User"}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m) => {
          const isMine = m.senderId === currentUser._id;
          return (
            <div
              key={m._id}
              className={`p-3 rounded-2xl shadow-sm max-w-[70%] break-words ${
                isMine
                  ? "ml-auto bg-pink-500 text-white rounded-br-sm"
                  : "mr-auto bg-white text-gray-800 border rounded-bl-sm"
              }`}
            >
              {m.deleted ? (
                <p className="italic text-sm flex items-center space-x-1">
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
              <p className="text-[10px] mt-1 opacity-60 flex items-center space-x-1">
                <span>{moment(m.createdAt).fromNow()}</span>
                {isMine && !m.deleted && (
                  <>
                    {m.status === "sent" && <span title="Sent">✔</span>}
                    {m.status === "delivered" && <span title="Delivered">✔✔</span>}
                    {m.status === "seen" && <span title="Seen">👁️👁️</span>}
                  </>
                )}
              </p>
            </div>
          );
        })}
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
