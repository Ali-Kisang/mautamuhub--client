import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

export default function Header() {
  const { onlineUsers } = useAuthStore();
  const [titleIndex, setTitleIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const rotatingTitles = [
    "🔥 Discover Connections in Your City Tonight!",
    "💋 Real Vibes with Nairobi's Finest — Swipe Live!",
    "🧡 Kisumu Sparks: Matches Waiting Just for You!",
    "🥵 Mombasa Magic: Heat Up Your Night!",
    "💞 Eldoret Escapes: Authentic Chats Start Here!",
    "🔥 Busia Bonds: Genuine Flirts Online Now!",
    "💋 Bungoma Bliss: Don't Wait, Dive In!",
    "🥵 Kakamega Kindred: Your Next Adventure Awaits!",
    "🍑 Kisii Kisses: Playful & Ready to Connect!",
    "🌶️ Garissa Glow: Ignite the Night Together!",
    "🔥 Isiolo Intrigue: Naughty & Nice, All Here!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % rotatingTitles.length);
        setFade(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = onlineUsers?.length || 0;

  // Inline online count (cleaner)
  const displayCount = onlineCount === 0 
    ? Math.floor(Math.random() * (80 - 40 + 1)) + 40  
    : onlineCount;

  return (
    <div 
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/alone.jpg)" }} // Assuming alone.jpg in public folder; adjust extension if needed (e.g., .png)
    >
      {/* Overlay Gradient for Readability (Optional: Adjust opacity for better contrast with image) */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/80 via-rose-100/70 to-pink-50/60"></div>

      {/* Animated Background Elements for Modern Flair */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Hearts for Dating Vibe */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          >
            💖
          </div>
        ))}
      </div>

      {/* Hero Text Section: Enhanced with Glassmorphism */}
      <div className="relative z-10 text-center mb-12 space-y-6 max-w-3xl mx-auto backdrop-blur-sm bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
        <div className="relative">
          {/* Dynamic Heart Icon with Pulse */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-8xl opacity-30 animate-pulse-infinite">
            💖
          </div>
          <h1
            className={`text-4xl md:text-6xl font-black text-rose-700 leading-tight transition-all duration-700 ease-out ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {rotatingTitles[titleIndex]}
          </h1>
        </div>

        <div className="space-y-4 px-2">
          <p className="text-lg md:text-xl text-gray-600 font-light italic">
            👑 <span className="font-bold text-rose-600 not-italic animate-pulse">Utamuhub</span>: Where Kenyan hearts meet—diverse, real, and unfiltered. From city lights to cozy corners, find your spark.
          </p>

          <p className="text-xl md:text-2xl text-rose-800 font-semibold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            💕 Swipe, chat, connect with horny souls. No games, just genuine moments. Ready to feel the rush?
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-white/50">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
          <span className="text-green-700 font-bold text-lg">
            {displayCount} hearts beating online—join the vibe!
          </span>
        </div>
      </div>

      {/* CTA Buttons: Modern Glassmorphism with Hover Glow */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4 text-center">
        <button className="group relative text-lg px-10 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative">💌 Start Swiping Now</span>
        </button>
        <button className="group text-lg px-10 py-4 bg-white/20 hover:bg-white/40 text-rose-700 border-2 border-rose-300/50 rounded-2xl font-bold shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:scale-105">
          👤 Explore Matches
        </button>
        <button className="group relative text-lg px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative">💬 Jump into Chat</span>
        </button>
      </div>

      {/* Enhanced Footer Tagline with Subtle Glow */}
      <p className="relative z-10 mt-8 text-sm text-rose-500 font-medium opacity-80 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full inline-block shadow-lg">
        Your next connection is one tap away. Let's make magic happen. ✨
      </p>
    </div>
  );
}