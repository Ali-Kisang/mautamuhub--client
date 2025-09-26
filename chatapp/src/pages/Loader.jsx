
import { Loader2 } from "lucide-react";

export default function Loader({ text = "Loading...", size = 32, color = "text-pink-500" }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Loader2 className={`animate-spin ${color}`} size={size} />
      {text && <p className="mt-3 text-gray-600 text-sm">{text}</p>}
    </div>
  );
}
