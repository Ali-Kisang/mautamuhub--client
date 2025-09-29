import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { MdVerified } from "react-icons/md";
import { useAuthStore } from "../../store/useAuthStore";

const RegularListByCounty = ({ regularAccountsByCounty = [] }) => {
  const cld = new Cloudinary({
    cloud: { cloudName: "dcxggvejn" },
  });

  const { onlineUsers = [] } = useAuthStore();

  // Array of at least 50 random inviting summaries for regular escorts.
  const summaryTemplates = [
    "Connect with {name}, a charming {age}-year-old {orientation} ready for fun in {location}.",
    "Meet {name}—your approachable {age}-year {orientation} companion in {location}.",
    "Discover delight with {name}, the friendly {age}-year {orientation} from {location}.",
    "Enjoy easy vibes with {name}, a relatable {age}-year {orientation} in {location}.",
    "Link up with {name}—{age} years of casual {orientation} charm in {location}.",
    "Get to know {name}, your down-to-earth {age}-year {orientation} in {location}.",
    "Share smiles with {name}, a warm {age}-year {orientation} soul in {location}.",
    "Find fun with {name}—{age} years of lighthearted {orientation} in {location}.",
    "Hang out happily with {name}, your {age}-year {orientation} pal in {location}.",
    "Bond beautifully with {name}, the genuine {age}-year {orientation} in {location}.",
    "Chat and chill with {name}—{age} years of easy {orientation} energy in {location}.",
    "Embrace everyday magic with {name}, a sweet {age}-year {orientation} from {location}.",
    "Laugh and linger with {name}, your {age}-year {orientation} buddy in {location}.",
    "Spark simple joys with {name}—{age} years of {orientation} simplicity in {location}.",
    "Relax and relate with {name}, the approachable {age}-year {orientation} in {location}.",
    "Unwind with {name}, a cozy {age}-year {orientation} haven in {location}.",
    "Vibe vibrantly with {name}—{age} years of {orientation} vibes in {location}.",
    "Wander warmly with {name}, your {age}-year {orientation} wanderer in {location}.",
    "X marks the spot for {name}, a fun {age}-year {orientation} in {location}.",
    "Yield to good times with {name}—{age} years yielding {orientation} yields in {location}.",
    "Zest up your day with {name}, the {age}-year {orientation} zester from {location}.",
    "Adventurous at heart with {name}, {age} years adventuring {orientation} in {location}.",
    "Bright and breezy with {name}—{age} years breezing {orientation} in {location}.",
    "Cozy connections at {name}, your {age}-year {orientation} cozy in {location}.",
    "Delightful downtime with {name}, {age} years delighting {orientation} in {location}.",
    "Effortless encounters with {name}—{age} years encountering {orientation} easily in {location}.",
    "Friendly fire with {name}, a {age}-year {orientation} friend in {location}.",
    "Gentle gatherings at {name}, {age} years gathering {orientation} gently in {location}.",
    "Happy hangs with {name}—{age} years hanging {orientation} happily in {location}.",
    "Inspiring interactions with {name}, your {age}-year {orientation} inspiration from {location}.",
    "Joyful journeys with {name}, {age} years journeying {orientation} in {location}.",
    "Kindred kindness at {name}—{age} years kindling {orientation} kinship in {location}.",
    "Lighthearted links with {name}, a {age}-year {orientation} link in {location}.",
    "Merry moments with {name}, {age} years merrying {orientation} in {location}.",
    "Natural nuances at {name}—{age} years nuancing {orientation} naturally in {location}.",
    "Open and outgoing with {name}, your {age}-year {orientation} openness from {location}.",
    "Playful pauses with {name}, {age} years pausing {orientation} playfully in {location}.",
    "Quaint quests with {name}—{age} years questing {orientation} quaintly in {location}.",
    "Relaxed rendezvous at {name}, a {age}-year {orientation} relax in {location}.",
    "Sunny spirits with {name}, {age} years spiriting {orientation} sunnily in {location}.",
    "Thoughtful thrills with {name}—{age} years thrilling {orientation} thoughtfully in {location}.",
    "Unpretentious unions with {name}, your {age}-year {orientation} union from {location}.",
    "Vivacious visits at {name}, {age} years visiting {orientation} vivaciously in {location}.",
    "Welcoming waves with {name}—{age} years waving {orientation} welcomingly in {location}.",
    "Xuberant exchanges with {name}, a {age}-year {orientation} exchange in {location}.",
    "Youthful yarns with {name}, {age} years yarning {orientation} youthfully in {location}.",
    "Zany zingers at {name}—{age} years zinging {orientation} zany in {location}.",
    "Affable adventures with {name}, your {age}-year {orientation} affable in {location}."
  ];

  // Special welcome templates for new regular accounts (e.g., <7 days old)
  const newRegularTemplates = [
    "Fresh face alert! Meet {name}, the newest {age}-year {orientation} in {location}.",
    "Newly nearby: {name} joins with {age} years of {orientation} fun in {location}. Jump in!",
    "Just here—{name} in {location} brings {age}-year {orientation} vibes. Say hello!",
    "Hot new hello: {name} greets {age} years of {orientation} in {location}.",
    "Brand new buddy at {name}—{age} years fresh for {orientation} in {location}.",
    "Welcome the warmth: {name} warms up {location} with {age} years of {orientation}.",
    "Sparkling starter: {name} starts with {age}-year {orientation} sparkle in {location}.",
    "Dawn of delight at {name}, a budding {age}-year {orientation} in {location}.",
    "New neighbor: {name} neighbors {age} years of {orientation} in {location}.",
    "Fresh friend: {name} friends {age} years of {orientation} anew in {location}."
  ];

  if (
    !Array.isArray(regularAccountsByCounty) ||
    regularAccountsByCounty.length === 0
  ) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="md:text-3xl font-bold text-center mb-6 text-pink-600">
          Regular Escort Accounts
        </h2>
        <p className="text-gray-500 text-center text-lg">
          No approachable companions available right now. Check back for new connections!
        </p>
      </section>
    );
  }

  return (
    <>
      {regularAccountsByCounty.map((countyData) => {
        const countyId = countyData?._id || "Unknown County";
        const users = Array.isArray(countyData?.users) ? countyData.users : [];

        if (users.length === 0) {
          return (
            <section key={countyId} className="max-w-6xl mx-auto px-4 py-8">
              <h2 className="md:text-3xl font-bold text-center mb-6 text-pink-600">
                Regular Escorts in {countyId}
              </h2>
              <p className="text-gray-500 text-center text-lg">
                No friendly faces available in {countyId} yet. Explore other areas!
              </p>
            </section>
          );
        }

        return (
          <section key={countyId} className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="md:text-3xl font-bold text-center mb-6 text-pink-600">
              Approachable Regular Escorts in {countyId}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {users.map((regular) => {
                const userId = regular?.user?.toString() || "";
                const isOnline = onlineUsers?.some(
                  (u) => u.userId?.toString() === userId
                );

                // Check if regular is new (adjust threshold as needed; assumes createdAt is a Date string)
                const isNewRegular = regular.createdAt && new Date(regular.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                const templates = isNewRegular ? newRegularTemplates : summaryTemplates;
                const randomIndex = Math.floor(Math.random() * templates.length);
                const summary = templates[randomIndex]
                  .replace("{name}", regular?.personal?.username || "Companion")
                  .replace("{age}", regular?.personal?.age || "vibrant")
                  .replace("{location}", `${regular?.location?.constituency || "-"}, ${regular?.location?.ward || ""}`)
                  .replace("{orientation}", regular?.personal?.orientation || "versatile");

                return (
                  <div
                    key={regular?._id}
                    className="border rounded-xl shadow-lg p-6 bg-gradient-to-br from-white to-pink-50 transition-all duration-500 hover:border-pink-400 hover:shadow-2xl hover:scale-105 hover:bg-gradient-to-br hover:from-pink-50 hover:to-white relative overflow-hidden"
                  >
                    {/* Subtle overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent"></div>
                    
                    <Link
                      to={`/profile/${regular?._id || ""}`}
                      className="block text-center relative group z-10"
                    >
                      {regular?.photos?.length > 0 && (
                        <div className="w-full h-64 flex justify-center items-center relative rounded-lg overflow-hidden">
                          <AdvancedImage
                            cldImg={cld
                              .image(regular.photos[0])
                              .resize(auto().gravity(autoGravity()))}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            alt="Profile Photo"
                          />

                          {/* ✅ Online/Offline Status */}
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
                          {regular.verified && (
                            <div className="absolute top-3 left-3">
                              <MdVerified className="text-pink-500 text-xl" />
                            </div>
                          )}

                          {/* New Regular Badge */}
                          {isNewRegular && (
                            <div className="absolute bottom-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                              New!
                            </div>
                          )}
                        </div>
                      )}

                      {/* Inviting Randomized Summary */}
                      <p className="mt-4 text-gray-700 font-semibold text-base leading-relaxed">
                        {summary}
                      </p>

                      {/* View Profile Button */}
                      <span className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full text-sm hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 cursor-pointer transform hover:-translate-y-1">
                        View Profile
                      </span>
                    </Link>

                    {/* ✅ Call Button */}
                    {regular?.personal?.phone && (
                      <a
                        href={`tel:${regular.personal.phone}`}
                        className="mt-4 inline-block w-full text-center bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-rose-500/25"
                      >
                        Call Now {regular.personal.phone}
                      </a>
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

export default RegularListByCounty;