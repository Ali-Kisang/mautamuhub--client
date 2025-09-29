import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { MdVerified } from "react-icons/md";
import { useAuthStore } from "../../store/useAuthStore";

const VVIPList = ({ vvipAccounts }) => {
  const cld = new Cloudinary({
    cloud: { cloudName: "dcxggvejn" },
  });

  const { onlineUsers } = useAuthStore();

  // Array of at least 50 random alluring summaries for VVIP escorts. Tailored to be captivating.
  const summaryTemplates = [
    "Captivate your desires with {name}, a mesmerizing {age}-year-old {orientation} enchantress in {location}.",
    "Indulge in passion at {name}—your {age}-year {orientation} fantasy come alive in {location}.",
    "Surrender to seduction with {name}, the {age}-year siren of {orientation} allure in {location}.",
    "Unleash your wild side with {name}, a sultry {age}-year {orientation} temptress from {location}.",
    "Ignite the spark with {name}—{age} years of irresistible {orientation} charm in {location}.",
    "Embrace ecstasy at {name}, where {age} years of {orientation} passion bloom in {location}.",
    "Dive into delight with {name}, your {age}-year {orientation} muse awaiting in {location}.",
    "Experience euphoria with {name}, a captivating {age}-year {orientation} vision in {location}.",
    "Awaken your senses with {name}—{age} years of tantalizing {orientation} in {location}.",
    "Lose yourself in luxury with {name}, the {age}-year epitome of {orientation} desire in {location}.",
    "Entice your evenings with {name}, a fiery {age}-year {orientation} flame from {location}.",
    "Discover decadence at {name}—{age} years crafting {orientation} dreams in {location}.",
    "Bask in beauty with {name}, your {age}-year {orientation} goddess in {location}.",
    "Fuel your fantasies with {name}, a bold {age}-year {orientation} adventurer in {location}.",
    "Savor the thrill with {name}—{age} years of electric {orientation} energy in {location}.",
    "Melt into magic with {name}, the {age}-year whisper of {orientation} in {location}.",
    "Chase the chemistry with {name}, a vibrant {age}-year {orientation} vixen from {location}.",
    "Radiate romance at {name}—{age} years of {orientation} radiance in {location}.",
    "Tease your temptations with {name}, your {age}-year {orientation} tease in {location}.",
    "Venture into velvet with {name}, a smooth {age}-year {orientation} seduction in {location}.",
    "Whirlwind of wonder with {name}—{age} years spinning {orientation} spells in {location}.",
    "Xenial allure at {name}, {age} years of welcoming {orientation} warmth in {location}.",
    "Yield to yearning with {name}, the {age}-year {orientation} yearning in {location}.",
    "Zestful zest with {name}—{age} years zinging {orientation} in {location}.",
    "Alluring aura at {name}, a {age}-year {orientation} aura enveloping {location}.",
    "Blissful bond with {name}, {age} years binding {orientation} bliss in {location}.",
    "Charismatic charm with {name}—{age} years charming {orientation} in {location}.",
    "Dazzling desire at {name}, your {age}-year {orientation} dazzle from {location}.",
    "Erotic elegance with {name}, {age} years of {orientation} elegance in {location}.",
    "Fervent fire at {name}—{age} years fueling {orientation} fervor in {location}.",
    "Glamorous glow with {name}, a {age}-year {orientation} glamour in {location}.",
    "Hypnotic heat at {name}, {age} years hypnotizing {orientation} in {location}.",
    "Intimate intrigue with {name}—{age} years intriguing {orientation} intimacy in {location}.",
    "Jazzy joy at {name}, your {age}-year {orientation} jazz from {location}.",
    "Kinky kiss with {name}, {age} years kissing {orientation} kink in {location}.",
    "Luscious lure at {name}—{age} years luring {orientation} lusciously in {location}.",
    "Mystic moan with {name}, a {age}-year {orientation} mystic in {location}.",
    "Naughty nectar at {name}, {age} years nectaring {orientation} naughtiness in {location}.",
    "Opulent obsession with {name}—{age} years obsessing {orientation} opulence in {location}.",
    "Playful pulse at {name}, your {age}-year {orientation} pulse from {location}.",
    "Quirky queen with {name}, {age} years queening {orientation} quirk in {location}.",
    "Ravishing rhythm at {name}—{age} years rhythm-ing {orientation} ravish in {location}.",
    "Sensual symphony with {name}, a {age}-year {orientation} symphony in {location}.",
    "Tantalizing tango at {name}, {age} years tango-ing {orientation} in {location}.",
    "Utterly unforgettable with {name}—{age} years unforgettable {orientation} in {location}.",
    "Vivacious vibe at {name}, your {age}-year {orientation} vibe from {location}.",
    "Whimsical whisper with {name}, {age} years whispering {orientation} whimsy in {location}.",
    "Xenith of x-factor at {name}—{age} years x-factoring {orientation} in {location}.",
    "Yearning yonder with {name}, a {age}-year {orientation} yearning in {location}."
  ];

  // Special welcome templates for new VVIP accounts (e.g., <7 days old)
  const newVVIPTemplates = [
    "Freshly unveiled! Meet {name}, the newest {age}-year {orientation} sensation in {location}.",
    "Newly ignited passion: {name} brings {age} years of {orientation} fire to {location}. Dive in now!",
    "Just arrived—{name} in {location} unleashes {age}-year expertise in {orientation} allure. Claim your thrill!",
    "Hot new horizon: {name} debuts {age} years of {orientation} temptation in {location}.",
    "Brand new beguilement at {name}—{age} years fresh for {orientation} in {location}.",
    "Welcome the wildfire: {name} blazes into {location} with {age} years of {orientation} heat.",
    "Sparkling sensation: {name} shines with {age}-year {orientation} sparkle in {location}.",
    "Dawn of desire at {name}, a budding {age}-year {orientation} gem in {location}.",
    "New nexus: {name} connects with {age} years of {orientation} promise in {location}.",
    "Fresh fervor: {name} fuses {age} years of {orientation} anew in {location}."
  ];

  if (!Array.isArray(vvipAccounts) || vvipAccounts.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="md:text-3xl font-bold text-center mb-6 text-pink-600">
          VVIP Escort Accounts
        </h2>
        <p className="text-gray-500 text-center text-lg">
          No elite companions available right now. Indulge soon in our latest VVIP allure!
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="md:text-3xl font-bold text-center mb-6 text-pink-600">
        Exclusive VVIP Escorts
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {vvipAccounts.map((vvip) => {
          const isOnline = onlineUsers?.some(
            (u) => u.userId?.toString() === vvip.user?.toString()
          );

          // Check if VVIP is new (adjust threshold as needed; assumes createdAt is a Date string)
          const isNewVVIP = vvip.createdAt && new Date(vvip.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const templates = isNewVVIP ? newVVIPTemplates : summaryTemplates;
          const randomIndex = Math.floor(Math.random() * templates.length);
          const summary = templates[randomIndex]
            .replace("{name}", vvip.personal.username)
            .replace("{age}", vvip.personal.age)
            .replace("{location}", `${vvip.location.constituency}, ${vvip.location.ward}`)
            .replace("{orientation}", vvip.personal.orientation);

          return (
            <div
              key={vvip?._id}
              className="border rounded-xl shadow-lg p-6 bg-gradient-to-br from-white to-pink-50 transition-all duration-500 hover:border-pink-400 hover:shadow-2xl hover:scale-105 hover:bg-gradient-to-br hover:from-pink-50 hover:to-white relative overflow-hidden"
            >
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent"></div>
              
              <Link
                to={`/profile/${vvip?._id}`}
                className="block text-center relative group z-10"
              >
                {vvip?.photos?.length > 0 && (
                  <div className="w-full h-64 flex justify-center items-center relative rounded-lg overflow-hidden">
                    <AdvancedImage
                      cldImg={cld
                        .image(vvip.photos[0])
                        .resize(auto().gravity(autoGravity()))}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt="Profile Photo"
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
                    {vvip.verified && (
                      <div className="absolute top-3 left-3">
                        <MdVerified className="text-pink-500 text-xl" />
                      </div>
                    )}

                    {/* New VVIP Badge */}
                    {isNewVVIP && (
                      <div className="absolute bottom-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                        New Elite!
                      </div>
                    )}
                  </div>
                )}

                {/* Alluring Randomized Summary */}
                <p className="mt-4 text-gray-700 font-semibold text-base leading-relaxed">
                  {summary}
                </p>

                {/* View Details Button */}
                <span className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full text-sm hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 cursor-pointer transform hover:-translate-y-1">
                  Explore Profile
                </span>
              </Link>

              {/* Call Button */}
              {vvip?.personal?.phone && (
                <a
                  href={`tel:${vvip.personal.phone}`}
                  className="mt-4 inline-block w-full text-center bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-rose-500/25"
                >
                  Call Now {vvip.personal.phone}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VVIPList;