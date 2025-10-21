import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { MdVerified } from "react-icons/md";
import { useAuthStore } from "../../store/useAuthStore";
import { showToast } from "../../components/utils/showToast";

const VIPListByCounty = ({ vipAccountsByCounty }) => {
  const cld = new Cloudinary({
    cloud: { cloudName: "dcxggvejn" },
  });

  // ✅ get online users from store
  const { onlineUsers } = useAuthStore();

  // Array of at least 50 random captivating summaries for VIP escorts.
  const summaryTemplates = [
    "Encounter elegance with {name}, a captivating {age}-year-old {orientation} in {location}.",
    "Savor sophistication at {name}—your {age}-year {orientation} allure in {location}.",
    "Delight in desire with {name}, the {age}-year essence of {orientation} in {location}.",
    "Ignite intrigue with {name}, a sultry {age}-year {orientation} from {location}.",
    "Embrace enchantment at {name}—{age} years of {orientation} grace in {location}.",
    "Unveil your ultimate fantasy with {name}, {age} years of {orientation} perfection in {location}.",
    "Bask in the glow of {name}, a radiant {age}-year {orientation} star in {location}.",
    "Experience exquisite company with {name}—{age} years crafting {orientation} moments in {location}.",
    "Awaken adventure with {name}, your {age}-year {orientation} companion in {location}.",
    "Lose yourself in luxury with {name}, the {age}-year pinnacle of {orientation} in {location}.",
    "Tease the night with {name}, a fiery {age}-year {orientation} spark from {location}.",
    "Discover divine delight at {name}—{age} years of {orientation} divinity in {location}.",
    "Float into fascination with {name}, your {age}-year {orientation} fantasy in {location}.",
    "Fuel the fire with {name}, a bold {age}-year {orientation} beacon in {location}.",
    "Savor the seduction with {name}—{age} years of {orientation} sensuality in {location}.",
    "Mingle in mystery with {name}, the {age}-year whisper of {orientation} in {location}.",
    "Pursue passion with {name}, a vibrant {age}-year {orientation} vibe from {location}.",
    "Radiate rapture at {name}—{age} years of {orientation} radiance in {location}.",
    "Stir the senses with {name}, your {age}-year {orientation} siren in {location}.",
    "Tantalize tonight with {name}, a smooth {age}-year {orientation} seduction in {location}.",
    "Unleash uniqueness with {name}—{age} years weaving {orientation} wonders in {location}.",
    "Venture vibrantly with {name}, {age} years of {orientation} vitality in {location}.",
    "Whisper wonders with {name}, the {age}-year {orientation} whisperer in {location}.",
    "Yield to yearning at {name}—{age} years yielding {orientation} yields in {location}.",
    "Zest for zest with {name}, a {age}-year {orientation} zinger from {location}.",
    "Allure awaits at {name}, {age} years of {orientation} allure in {location}.",
    "Bliss beckons with {name}—{age} years beckoning {orientation} bliss in {location}.",
    "Charm cascades at {name}, your {age}-year {orientation} cascade in {location}.",
    "Dare to dream with {name}, {age} years dreaming {orientation} dares in {location}.",
    "Enthrall endlessly with {name}—{age} years enthralling {orientation} in {location}.",
    "Fascinate forever at {name}, a {age}-year {orientation} fascination in {location}.",
    "Glimpse glamour with {name}, {age} years of {orientation} glamour in {location}.",
    "Hypnotize here with {name}—{age} years hypnotizing {orientation} in {location}.",
    "Intrigue ignites at {name}, your {age}-year {orientation} ignition from {location}.",
    "Jewel of joy with {name}, {age} years joying {orientation} jewels in {location}.",
    "Kindle kinship at {name}—{age} years kindling {orientation} kinship in {location}.",
    "Lure luxuriously with {name}, a {age}-year {orientation} lure in {location}.",
    "Mystify moments with {name}, {age} years mystifying {orientation} in {location}.",
    "Nurture nights at {name}—{age} years nurturing {orientation} nights in {location}.",
    "Overture of obsession with {name}, your {age}-year {orientation} overture from {location}.",
    "Pulse with passion at {name}, {age} years pulsing {orientation} in {location}.",
    "Quest for queenly with {name}—{age} years queening {orientation} quests in {location}.",
    "Rhythm of rapture with {name}, a {age}-year {orientation} rhythm in {location}.",
    "Symphony of seduction at {name}, {age} years symphonizing {orientation} in {location}.",
    "Tide of temptation with {name}—{age} years tiding {orientation} temptations in {location}.",
    "Unwind uniquely with {name}, your {age}-year {orientation} unwind from {location}.",
    "Verve and vitality at {name}, {age} years verging {orientation} verve in {location}.",
    "Waltz with wonder with {name}—{age} years waltzing {orientation} wonders in {location}.",
    "Xenial xquisiteness with {name}, a {age}-year {orientation} xenial in {location}.",
    "Yearn for youth at {name}, {age} years yearning {orientation} youth in {location}."
  ];

  // Special welcome templates for new VIP accounts (e.g., <7 days old)
  const newVIPTemplates = [
    "Freshly fabulous! Meet {name}, the newest {age}-year {orientation} star in {location}.",
    "Newly nestled allure: {name} brings {age} years of {orientation} to {location}. Indulge immediately!",
    "Just joined—{name} in {location} offers {age}-year {orientation} magic. Seize the moment!",
    "Hot new highlight: {name} spotlights {age} years of {orientation} in {location}.",
    "Brand new brilliance at {name}—{age} years fresh for {orientation} in {location}.",
    "Welcome the wave of wonder: {name} waves into {location} with {age} years of {orientation}.",
    "Sparkling newcomer: {name} sparkles with {age}-year {orientation} in {location}.",
    "Dawn of dazzle at {name}, a budding {age}-year {orientation} in {location}.",
    "New nexus of nights: {name} connects {age} years of {orientation} in {location}.",
    "Fresh flair: {name} flares {age} years of {orientation} anew in {location}."
  ];

  return (
    <>
      {vipAccountsByCounty.map((countyData) => {
        if (!countyData.users || countyData.users.length === 0) {
          return (
            <section key={countyData._id} className="max-w-6xl mx-auto px-4 py-8">
              <h2 className="md:text-3xl font-bold text-center mb-6 text-pink-600">
                VIP Accounts in {countyData._id}
              </h2>
              <p className="text-gray-500 text-center text-lg">
                No premium companions available in {countyData._id} right now. Explore more counties for elite encounters!
              </p>
            </section>
          );
        }

        return (
          <section key={countyData._id} className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="md:text-3xl font-bold text-center mb-6 text-pink-600">
              Elite VIP Escorts in {countyData._id}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {countyData.users.map((vip) => {
                // ✅ Check online status
                const isOnline = onlineUsers?.some(
                  (u) => u.userId?.toString() === vip.user?.toString()
                );

                // Force verified to true by default (frontend override)
                const isVerified = false;

                // Check if VIP is new (adjust threshold as needed; assumes createdAt is a Date string)
                const isNewVIP = vip.createdAt && new Date(vip.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                const templates = isNewVIP ? newVIPTemplates : summaryTemplates;
                const randomIndex = Math.floor(Math.random() * templates.length);
                const summary = templates[randomIndex]
                  .replace("{name}", vip.personal?.username || "VIP")
                  .replace("{age}", vip.personal?.age || "timeless")
                  .replace("{location}", `${vip.location?.constituency}, ${vip.location?.ward}`)
                  .replace("{orientation}", vip.personal?.orientation || "versatile");

                // Placeholder for no photo
                const placeholderImage = (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg relative">
                    <span className="text-gray-500 text-sm font-medium z-10">No Image Available</span>
                  </div>
                );

                const imageContent = vip?.photos?.length > 0 ? (
                  <AdvancedImage
                    cldImg={cld
                      .image(vip.photos[0])
                      .resize(auto().gravity(autoGravity()))}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt="Profile Photo"
                  />
                ) : (
                  placeholderImage
                );

                return (
                  <div
                    key={vip._id}
                    className="border rounded-xl shadow-lg p-6 bg-gradient-to-br from-white to-pink-50 transition-all duration-500 hover:border-pink-400 hover:shadow-2xl hover:scale-105 hover:bg-gradient-to-br hover:from-pink-50 hover:to-white relative overflow-hidden"
                  >
                    {/* Subtle overlay for depth - lower z-index */}
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent z-0"></div>
                    
                    <Link
                      to={`/profile/${vip._id}`}
                      className="block text-center relative group z-10"
                    >
                      <div className="w-full h-64 flex justify-center items-center relative rounded-lg overflow-visible">
                        {imageContent}

                        {/* ✅ Online/Offline Indicator - Enhanced visibility */}
                        <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/50 backdrop-blur-md px-3 py-2 rounded-full z-30 border-2 border-white/50 shadow-xl">
                          <span
                            className={`w-4 h-4 rounded-full border-2 border-white shadow-lg flex-shrink-0 ${
                              isOnline ? "bg-green-400 animate-pulse" : "bg-gray-500"
                            }`}
                          ></span>
                          <span className="text-xs text-white font-bold whitespace-nowrap">
                            {isOnline ? "LIVE" : "OFFLINE"}
                          </span>
                        </div>

                        {/* Verification Badge - Forced to Not Verified */}
                        <div className="absolute top-3 left-3 z-30 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-2xl border border-pink-200">
                         
                          <span className="text-xs font-bold text-gray-800 hidden sm:inline">Not Verified</span>
                        </div>

                        {/* New VIP Badge - Enhanced visibility */}
                        {isNewVIP && (
                          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold z-30 shadow-2xl border-2 border-yellow-300 animate-bounce">
                            NEW VIP!
                          </div>
                        )}
                      </div>

                      {/* Captivating Randomized Summary */}
                      <p className="mt-4 text-gray-700 font-semibold text-base leading-relaxed">
                        {summary}
                      </p>

                      {/* View Profile Button */}
                      <span className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full text-sm hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 cursor-pointer transform hover:-translate-y-1">
                        View Profile
                      </span>
                    </Link>

                    {/* ✅ Call Button */}
                    {vip?.personal?.phone && (
                      <button
                        onClick={() => {
                          if (navigator.userAgent.match(/Mobi|Android/i)) {
                            window.location.href = `tel:${vip.personal.phone}`;
                          } else {
                            navigator.clipboard.writeText(vip.personal.phone).then(() => {
                              showToast(`Phone number copied: ${vip.personal.phone}\nPaste into your dialer!`, false);
                            }).catch(() => {
                              prompt('Copy this phone number:', vip.personal.phone);
                            });
                          }
                        }}
                        className="mt-4 inline-block w-full text-center bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-rose-500/25 cursor-pointer"
                      >
                        Call Now {vip.personal.phone}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
};

export default VIPListByCounty;