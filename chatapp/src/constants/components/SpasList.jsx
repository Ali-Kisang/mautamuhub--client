import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { MdVerified } from "react-icons/md";
import { useAuthStore } from "../../store/useAuthStore";

const SpasList = ({ spas }) => {
  const cld = new Cloudinary({
    cloud: { cloudName: "dcxggvejn" },
  });

  const { onlineUsers } = useAuthStore();

  // Array of at least 50 random inviting summaries. Customize these to fit your brand.
  const summaryTemplates = [
    "Rejuvenate at {name}, a tranquil {age}-year haven in {location}, offering {orientation} therapies.",
    "Discover bliss with {name} in {location}—your {age}-year-old sanctuary for {orientation} wellness wonders.",
    "Unwind in luxury at {name}, the {age}-year gem of {location} specializing in {orientation} relaxation.",
    "Elevate your senses at {name}, a serene {age}-year escape in {location} with expert {orientation} care.",
    "Find your zen at {name}—{age} years of pure {orientation} harmony awaiting in {location}.",
    "Surrender to serenity at {name}, {age} years of {orientation} mastery in the heart of {location}.",
    "Pamper yourself at {name}, where {age} years of {orientation} expertise meet {location}'s charm.",
    "Experience pure relaxation at {name}, a {age}-year oasis in {location} dedicated to {orientation} bliss.",
    "Let go and heal at {name}—{age} years crafting {orientation} journeys in {location}.",
    "Indulge in tranquility at {name}, your {age}-year {orientation} retreat nestled in {location}.",
    "Awaken your inner peace at {name}, boasting {age} years of {orientation} excellence in {location}.",
    "Melt away stress at {name}, the {age}-year haven for {orientation} therapies in {location}.",
    "Journey to calm at {name}, where {age} years of {orientation} wisdom flourish in {location}.",
    "Breathe easy at {name}—{age} years of soothing {orientation} sessions in {location}.",
    "Revitalize your spirit at {name}, a timeless {age}-year {orientation} sanctuary in {location}.",
    "Embrace wellness at {name}, {age} years strong in {orientation} artistry within {location}.",
    "Soothe your soul at {name}, the premier {age}-year spot for {orientation} in {location}.",
    "Unlock relaxation at {name}—{age} years of {orientation} magic in vibrant {location}.",
    "Nurture your body at {name}, celebrating {age} years of {orientation} care in {location}.",
    "Float into peace at {name}, a {age}-year beacon of {orientation} in {location}.",
    "Harmonize mind and body at {name}, with {age} years of {orientation} prowess in {location}.",
    "Delight in downtime at {name}—{age} years perfecting {orientation} in {location}.",
    "Restore balance at {name}, your go-to {age}-year {orientation} haven in {location}.",
    "Savor the calm at {name}, where {age} years of {orientation} await in {location}.",
    "Ignite renewal at {name}, a vibrant {age}-year center for {orientation} in {location}.",
    "Drift into delight at {name}—{age} years of exquisite {orientation} in {location}.",
    "Cultivate calm at {name}, honoring {age} years of {orientation} tradition in {location}.",
    "Recharge at {name}, the {age}-year essence of {orientation} wellness in {location}.",
    "Whisper of wellness at {name}, with {age} years of {orientation} finesse in {location}.",
    "Bloom in bliss at {name}—a {age}-year {orientation} paradise in {location}.",
    "Tender touch therapy at {name}, {age} years in the making in {location}.",
    "Velvet vibes at {name}, your {age}-year {orientation} escape in {location}.",
    "Echoes of ease at {name}, crafted over {age} years in {location}.",
    "Gentle glow at {name}—{age} years illuminating {orientation} in {location}.",
    "Silken serenity at {name}, a {age}-year symphony of {orientation} in {location}.",
    "Whispers of warmth at {name}, {age} years of {orientation} embrace in {location}.",
    "Radiant repose at {name}, blooming {age} years strong in {location}.",
    "Lush lullaby at {name}—{age} years of {orientation} song in {location}.",
    "Petal-soft peace at {name}, rooted in {age} years of {location} luxury.",
    "Dewdrop delight at {name}, fresh {age} years of {orientation} in {location}.",
    "Sun-kissed soothe at {name}, {age} years basking in {location}'s glow.",
    "Moonlit massage at {name}—{age} years under {location}'s spell with {orientation}.",
    "Starlit sanctuary at {name}, a {age}-year {orientation} constellation in {location}.",
    "Breeze-born bliss at {name}, {age} years dancing with {location} winds.",
    "River-run relaxation at {name}—flowing {age} years of {orientation} in {location}.",
    "Forest-fresh feel at {name}, {age} years deep in {location}'s embrace.",
    "Ocean-opened oasis at {name}, waves of {age} years {orientation} in {location}.",
    "Mountain-melt magic at {name}, {age} years peaking {orientation} in {location}.",
    "Desert-dream drift at {name}—{age} years of sandy {orientation} serenity in {location}.",
    "City-sigh spa at {name}, {age} years easing {location}'s hustle with {orientation}."
  ];

  // Special welcome templates for new spas (e.g., <7 days old)
  const newSpaTemplates = [
    "Freshly blooming! Welcome to {name}, the newest {age}-year haven in {location} for {orientation} therapies.",
    "Newly arrived serenity: {name} brings {age} years of {orientation} magic to {location}. Book your first escape!",
    "Just opened—{name} in {location} offers {age}-year expertise in {orientation} bliss. Don't miss out!",
    "Hot off the press: {name} debuts {age} years of {orientation} excellence in {location}. Dive in!",
    "Brand new bliss awaits at {name}—{age} years fresh for {orientation} in {location}.",
    "Welcome the wave: {name} surges into {location} with {age} years of {orientation} wonders.",
    "Sparkling new: {name} shines with {age}-year {orientation} sparkle in {location}.",
    "Dawn of delight at {name}, a budding {age}-year {orientation} gem in {location}.",
    "New horizon: {name} rises with {age} years of {orientation} promise in {location}.",
    "Fresh fusion: {name} blends {age} years of {orientation} anew in {location}."
  ];

  if (!Array.isArray(spas) || spas.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="md:text-3xl font-bold text-center mb-6 text-md text-pink-600">
          Massage Spas & Parlours
        </h2>
        <p className="text-gray-500 text-center text-lg">
          No serene escapes available right now. Refresh your senses soon with our latest wellness havens!
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="md:text-3xl font-bold text-center mb-6 text-md text-pink-600">
        Unwind at Premier Massage Spas
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {spas.map((spa) => {
          const isOnline = onlineUsers?.some(
            (u) => u.userId?.toString() === spa.user?.toString()
          );

          // Check if spa is new (adjust threshold as needed; assumes createdAt is a Date string)
          const isNewSpa = spa.createdAt && new Date(spa.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const templates = isNewSpa ? newSpaTemplates : summaryTemplates;
          const randomIndex = Math.floor(Math.random() * templates.length);
          const summary = templates[randomIndex]
            .replace("{name}", spa.personal.username)
            .replace("{age}", spa.personal.age)
            .replace("{location}", spa.location.constituency)
            .replace("{orientation}", spa.personal.orientation);

          return (
            <div
              key={spa._id}
              className="border rounded-xl shadow-lg p-6 bg-gradient-to-br from-white to-pink-50 transition-all duration-500 hover:border-pink-400 hover:shadow-2xl hover:scale-105 hover:bg-gradient-to-br hover:from-pink-50 hover:to-white relative overflow-hidden"
            >
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent"></div>
              
              <Link
                to={`/profile/${spa._id}`}
                className="block text-center relative group z-10"
              >
                {spa.photos && spa.photos.length > 0 && (
                  <div className="w-full h-64 flex justify-center items-center relative rounded-lg overflow-hidden">
                    <AdvancedImage
                      cldImg={cld
                        .image(spa.photos[0])
                        .resize(auto().gravity(autoGravity()))}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt="Spa Photo"
                    />

                    {/* Online/Offline Indicator */}
                    <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span
                        className={`w-3 h-3 rounded-full border-2 border-white shadow-md ${
                          isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                      <span className="text-xs text-white font-semibold">
                        {isOnline ? "Online" : "Offline"}
                      </span>
                    </div>

                    {/* Verification Badge */}
                    {spa.verified && (
                      <div className="absolute top-3 left-3">
                        <MdVerified className="text-pink-500 text-xl" />
                      </div>
                    )}

                    {/* New Spa Badge */}
                    {isNewSpa && (
                      <div className="absolute bottom-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                        New!
                      </div>
                    )}
                  </div>
                )}

                {/* Inviting Summary - Now Randomized */}
                <p className="mt-4 text-gray-700 font-semibold text-base leading-relaxed">
                  {summary}
                </p>

                {/* View Details Button */}
                <span className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full text-sm hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 cursor-pointer transform hover:-translate-y-1">
                  View Profile
                </span>
              </Link>

              {/* Call Button */}
              {spa?.personal?.phone && (
                <a
                  href={`tel:${spa.personal.phone}`}
                  className="mt-4 inline-block w-full text-center bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-rose-500/25"
                >
                  Call Now {spa.personal.phone}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SpasList;