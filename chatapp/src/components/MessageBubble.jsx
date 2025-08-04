// 📌 MessageBubble.jsx
export default function MessageBubble({ message, isOwn, onEdit, onDelete }) {
  return (
    <div className={`p-2 rounded-xl max-w-xs ${isOwn ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-black"}`}>
      {message.message}{message.edited && " (edited)"}
      {isOwn && (
        <div className="text-xs mt-1 flex space-x-2">
          <button onClick={() => onEdit(message)} className="text-yellow-200">Edit</button>
          <button onClick={() => onDelete(message._id)} className="text-red-300">Delete</button>
        </div>
      )}
    </div>
  );
}