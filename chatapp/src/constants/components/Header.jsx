
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 👉 Custom Arrow Components
const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} !flex !items-center !justify-center !bg-pink-500 hover:!bg-pink-600 !rounded-full`}
      style={{ right: "10px", zIndex: 2 }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} !flex !items-center !justify-center !bg-pink-500 hover:!bg-pink-600 !rounded-full`}
      style={{ left: "10px", zIndex: 2 }}
      onClick={onClick}
    />
  );
};

export default function Header() {
  const { onlineUsers } = useAuthStore();
  const [titleIndex, setTitleIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const slides = [
    { image: "/slides/alone.jpg", message: "💋 I'm alone in my room, talk to me now!" },
    { image: "/slides/naked.jpg", message: "🔥 I'm naked and waiting… come see!" },
    { image: "/slides/call.jpg", message: "💞 Just one minute away — call now!" },
    { image: "/slides/dripping.jpg", message: "👅 I'm dripping with desire right now!" },
    { image: "/slides/bed.jpg", message: "🛏️ My bed is cold, warm it up?" },
    { image: "/slides/dressed.jpg", message: "👠 Dressed for you only, ready anytime!" },
    { image: "/slides/hot.jpg", message: "🥵 Too hot to handle, dare you try?" },
    { image: "/slides/gallery.jpg", message: "📸 Peek my private gallery 👀" },
    { image: "/slides/date.jpg", message: "💌 I want your attention… now!" },
    { image: "/slides/touch.jpg", message: "😈 Touch me with your words!" },
    { image: "/slides/wet.jpg", message: "💦 I'm wet… and waiting!" },
    { image: "/slides/naughty.jpg", message: "🎀 Let’s get naughty tonight!" },
    { image: "/slides/chat.jpg", message: "🔥 Lonely nights need hot chats!" },
    { image: "/slides/sweet.jpg", message: "🧁 Sweet, naughty & available now!" },
    { image: "/slides/pleasure.jpg", message: "📞 1 call away from pleasure!" },
  ];

  const rotatingTitles = [
    "🔥 Kenyan Girls Are Waiting in Your Area!",
    "💋 Chat with Nairobi Babes — Live Now!",
    "🧡 Kisumu Queens Are Online & Hot!",
    "🥵 Mombasa Beauties Want to Play!",
    "💞 Eldoret & Nakuru Girls Are Available Now!",
    "🔥 Busia Beauties Are Hot & Ready Tonight!",
    "💋 Bungoma Babes Want It Now — Don’t Miss Out!",
    "🥵 Kakamega Cuties Are Waiting Just for You!",
    "🍑 Kisii Queens Are Wet, Wild & Online Now!",
    "🌶️ Garissa Goddesses Are Craving Real Fun Tonight!",
    "🔥 Isiolo Angels Are Online & Super Naughty!",
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

  // 👉 react-slick settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div>
        <ul className="m-0"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-pink-400 rounded-full hover:bg-pink-600" />
    ),
  };

  return (
    <div className="w-full  min-h-screen  flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-rose-100 to-pink-50 px-4 py-12">
      {/* Title Section */}
      <div className="text-center mb-6 min-h-[120px] space-y-2">
        <h1
          className={`text-3xl md:text-5xl font-extrabold text-rose-700 transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {rotatingTitles[titleIndex]}
        </h1>

        <p className="text-md md:text-lg text-gray-700 font-medium px-4">
          👑{" "}
          <span className="font-bold text-rose-600 animate-bounce">Utamuhub</span>{" "}
          brings you all kinds of Kenyan girls & men — Black, White, Slim,
          Chubby, Petite — they're all here and ready.
        </p>

        <p className="text-lg md:text-xl text-rose-800 font-semibold animate-pulse">
          💦 If you're horny, this is the #1 hub for real Kenyan pleasure. No
          filters. No limits.
        </p>

        <div className="flex items-center justify-center mt-3 gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-green-700 font-semibold">
            {onlineCount} Online Now
          </span>
        </div>
      </div>

      {/* Carousel */}
      <div className="w-full h-full max-w-5xl mx-auto rounded-lg shadow-2xl overflow-hidden bg-pink-150">
  <Slider {...carouselSettings}>
    {slides.map((slide, index) => (
      <div
        key={index}
        className="relative flex justify-center items-center h-[400px] md:h-[500px] bg-pink-150"
      >
        <img
          src={slide.image}
          alt={`Slide ${index + 1}`}
          className="block max-h-full max-w-full object-contain mx-auto"
        />
        <div className="absolute bottom-6 left-6 right-6 bg-rose-900 bg-opacity-70 text-white text-center p-4 rounded-lg shadow-md">
          <h2 className="text-lg md:text-2xl font-semibold">
            {slide.message}
          </h2>
        </div>
      </div>
    ))}
  </Slider>
</div>



      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10 text-center">
        <a href="/chat-escort" className="btn btn-primary animate-pulse text-lg px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold">
          💌 Chat with Me Now
        </a>
        <button className="btn btn-secondary animate-pulse text-lg px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold">
          📸 View My Gallery
        </button>
        <button className="btn btn-secondary text-lg px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white rounded-lg font-semibold">
          📞 Call Me Now
        </button>
      </div>
    </div>
  );
}
