import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { MdVerified } from "react-icons/md";
import { useAuthStore } from "../../store/useAuthStore";
import { showToast } from "../../components/utils/showToast";
import { useMemo } from "react";

const SpasList = ({ spas }) => {
  const cld = new Cloudinary({ cloud: { cloudName: "dcxggvejn" } });
  const { onlineUsers } = useAuthStore();

  const summaryTemplates = [
    "Feel the calm with <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Expert {orientation} care just for you.",
    "Feel brand new at <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Gentle {orientation} magic every visit.",
    "Restore your energy with <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Warm {orientation} welcome every time.",
    "Relax deeply with <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Soft and caring {orientation} touch.",
    "Let go of stress at <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Pure {orientation} bliss is here.",
    "Melt into comfort with <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Your peaceful {orientation} escape.",
    "Breathe easy at <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Loving {orientation} hands await.",
    "Glow from within with <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. True {orientation} relaxation.",
    "Step into serenity at <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Your happy {orientation} place.",
    "Unwind completely with <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Soothing {orientation} vibes all day.",
  ];

  const newSpaTemplates = [
    "Meet <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Fresh serenity has just arrived for {orientation} lovers!",
    "Meet <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Your new favorite {orientation} escape is now open!",
    "Meet <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Pure {orientation} bliss is waiting for you—book today!",
    "Meet <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. The hottest new spot for {orientation} therapy just opened!",
    "Meet <span style=\"color:pink;\">{name}</span>, a {age} years old from {location}. Fresh vibes and {orientation} magic are ready!",
  ];

  if (!Array.isArray(spas) || spas.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-pink-600 mb-4">Massage Spas & Parlours</h2>
        <p className="text-gray-500 text-lg">No serene escapes available right now. Check back soon!</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-pink-600">
        Unwind at Premier Massage Spas
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {spas.map((spa) => {
          const isOnline = onlineUsers?.some(u => u.userId?.toString() === spa.user?.toString());
          const isVerified = true;
          const isNewSpa = spa.createdAt && new Date(spa.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

          const templates = isNewSpa ? newSpaTemplates : summaryTemplates;

          // Memoize random summary so it doesn't change on re-render
          const summaryHTML = useMemo(() => {
  const randomIndex = Math.floor(Math.random() * templates.length);
  const template = templates[randomIndex];

  const road = spa.location?.roadStreet?.trim();
  const local = spa.location?.localArea?.trim();
  const ward = spa.location?.ward?.trim();
  const constituency = spa.location?.constituency?.trim();
  const county = spa.location?.county?.trim() || "Nairobi";

  // Build location from most specific → general
  const locationParts = [road, local, ward, constituency].filter(Boolean);
  const finalLocation = locationParts.length > 0
  ? `${locationParts.join(", ")} in ${county}`
  : `in ${county}`;

  return template
    .replace(/{name}/g, spa.personal?.username || "Beautiful Soul")
    .replace(/{age}/g, spa.personal?.age || "25")
    .replace(/{location}/g, finalLocation)
    .replace(/{orientation}/g, spa.personal?.orientation || "Straight");
}, [spa, templates]);

          const imageContent = spa?.photos?.[0] ? (
            <AdvancedImage
              cldImg={cld.image(spa.photos[0]).resize(auto().gravity(autoGravity()))}
              className="w-full h-64 object-cover rounded-lg"
              alt={spa.personal?.username}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No Photo</span>
            </div>
          );

          return (
            <div
              key={spa._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-pink-100"
            >
              <Link to={`/profile/${spa._id}`} className="block">
                <div className="relative group">
                  {imageContent}

                  {/* Online Status */}
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
                    {isOnline ? "LIVE" : "OFFLINE"}
                  </div>

                  {/* Verified Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                    <MdVerified className="text-pink-600 text-xl" />
                    <span className="text-xs font-bold text-gray-800">Verified</span>
                  </div>

                  {/* New Spa Badge */}
                  {isNewSpa && (
                    <div className="absolute bottom-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold animate-bounce">
                      NEW!
                    </div>
                  )}
                </div>

                {/* Summary with Pink Name */}
                <div className="p-5 text-center">
                  <p
                    className="text-gray-700 font-medium text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: summaryHTML }}
                  />
                </div>

                <div className="px-5 pb-5">
                  <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 rounded-full hover:from-pink-600 hover:to-rose-600 transition">
                    View Profile
                  </button>
                </div>
              </Link>

              {/* Call Button */}
              
{spa.personal?.phone && (
  <div className="px-5 pb-5">
    {/* We use a real <a> tag with tel: — browsers LOVE this */}
    <a
      href={`tel:${spa.personal.phone}`}
      className="block w-full text-center bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-3 rounded-full hover:from-rose-700 hover:to-pink-700 transition transform hover:scale-105 shadow-lg"
      onClick={(e) => {
        // Only block navigation on desktop
        if (!/Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)) {
          e.preventDefault(); // Stop navigation on desktop
          navigator.clipboard.writeText(spa.personal.phone);
          showToast(`Copied: ${spa.personal.phone}`, false);
        }
        // On mobile → let the <a href="tel:"> do its magic → opens dialer instantly
      }}
    >
      Call Now {spa.personal.phone}
    </a>
  </div>
)}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SpasList;