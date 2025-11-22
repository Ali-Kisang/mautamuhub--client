import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { useAuthStore } from "../../store/useAuthStore";
import { showToast } from "../../components/utils/showToast";
import { useMemo } from "react";

// Individual Regular Card — hooks are safe here!
const RegularCard = ({ regular, county }) => {
  const cld = new Cloudinary({ cloud: { cloudName: "dcxggvejn" } });
  const { onlineUsers = [] } = useAuthStore();

  const isOnline = onlineUsers.some(u => u.userId?.toString() === regular.user?.toString());
  const isNewRegular = regular.createdAt && new Date(regular.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const summaryTemplates = [
  "Connect with <span style=\"color:pink;\">{name}</span>, a charming {age}-year-old {orientation} ready for fun in {location}.",
  "Meet <span style=\"color:pink;\">{name}</span>—your approachable {age}-year {orientation} companion in {location}.",
  "Discover delight with <span style=\"color:pink;\">{name}</span>, the friendly {age}-year {orientation} from {location}.",
  "Enjoy easy vibes with <span style=\"color:pink;\">{name}</span>, a relatable {age}-year {orientation} in {location}.",
  "Link up with <span style=\"color:pink;\">{name}</span>—{age} years of casual {orientation} charm in {location}.",
  "Get to know <span style=\"color:pink;\">{name}</span>, your down-to-earth {age}-year {orientation} in {location}.",
  "Share smiles with <span style=\"color:pink;\">{name}</span>, a warm {age}-year {orientation} soul in {location}.",
  "Find fun with <span style=\"color:pink;\">{name}</span>—{age} years of lighthearted {orientation} in {location}.",
  "Hang out happily with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} pal in {location}.",
  "Bond beautifully with <span style=\"color:pink;\">{name}</span>, the genuine {age}-year {orientation} in {location}.",
  "Chat and chill with <span style=\"color:pink;\">{name}</span>—{age} years of easy {orientation} energy in {location}.",
  "Embrace everyday magic with <span style=\"color:pink;\">{name}</span>, a sweet {age}-year {orientation} from {location}.",
  "Laugh and linger with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} buddy in {location}.",
  "Spark simple joys with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} simplicity in {location}.",
  "Relax and relate with <span style=\"color:pink;\">{name}</span>, the approachable {age}-year {orientation} in {location}.",
  "Unwind with <span style=\"color:pink;\">{name}</span>, a cozy {age}-year {orientation} haven in {location}.",
  "Vibe vibrantly with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} vibes in {location}.",
  "Wander warmly with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} wanderer in {location}.",
  "Feel the good times with <span style=\"color:pink;\">{name}</span>, a fun {age}-year {orientation} in {location}.",
  "Stay and play with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} playfulness in {location}.",
  "Zest up your day with <span style=\"color:pink;\">{name}</span>, the {age}-year {orientation} zester from {location}.",
  "Adventurous at heart with <span style=\"color:pink;\">{name}</span>, {age} years adventuring {orientation} in {location}.",
  "Bright and breezy with <span style=\"color:pink;\">{name}</span>—{age} years breezing {orientation} in {location}.",
  "Cozy connections with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} cozy in {location}.",
  "Delightful downtime with <span style=\"color:pink;\">{name}</span>, {age} years delighting {orientation} in {location}.",
  "Effortless encounters with <span style=\"color:pink;\">{name}</span>—{age} years encountering {orientation} easily in {location}.",
  "Friendly fire with <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} friend in {location}.",
  "Gentle gatherings with <span style=\"color:pink;\">{name}</span>, {age} years gathering {orientation} gently in {location}.",
  "Happy hangs with <span style=\"color:pink;\">{name}</span>—{age} years hanging {orientation} happily in {location}.",
  "Inspiring interactions with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} inspiration in {location}.",
  "Joyful journeys with <span style=\"color:pink;\">{name}</span>, {age} years journeying {orientation} in {location}.",
  "Kindred kindness with <span style=\"color:pink;\">{name}</span>—{age} years kindling {orientation} kinship in {location}.",
  "Lighthearted links with <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} link in {location}.",
  "Merry moments with <span style=\"color:pink;\">{name}</span>, {age} years merrying {orientation} in {location}.",
  "Natural nuances with <span style=\"color:pink;\">{name}</span>—{age} years nuancing {orientation} naturally in {location}.",
  "Open and outgoing with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} openness in {location}.",
  "Playful pauses with <span style=\"color:pink;\">{name}</span>, {age} years pausing {orientation} playfully in {location}.",
  "Quaint quests with <span style=\"color:pink;\">{name}</span>—{age} years questing {orientation} quaintly in {location}.",
  "Relaxed rendezvous with <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} relax in {location}.",
  "Sunny spirits with <span style=\"color:pink;\">{name}</span>, {age} years spiriting {orientation} sunnily in {location}.",
  "Thoughtful thrills with <span style=\"color:pink;\">{name}</span>—{age} years thrilling {orientation} thoughtfully in {location}.",
  "Unpretentious unions with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} union in {location}.",
  "Vivacious visits with <span style=\"color:pink;\">{name}</span>, {age} years visiting {orientation} vivaciously in {location}.",
  "Welcoming waves with <span style=\"color:pink;\">{name}</span>—{age} years waving {orientation} welcomingly in {location}.",
  "Xuberant exchanges with <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} exchange in {location}.",
  "Youthful yarns with <span style=\"color:pink;\">{name}</span>, {age} years yarning {orientation} youthfully in {location}.",
  "Zany zingers with <span style=\"color:pink;\">{name}</span>—{age} years zinging {orientation} zany in {location}.",
  "Affable adventures with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} affable in {location}.",
  "Sweet and simple with <span style=\"color:pink;\">{name}</span>, a lovely {age}-year {orientation} in {location}.",
  "Real and ready: <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} realness in {location}.",
  "Your friendly neighborhood <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} warmth in {location}.",
  "Just a call away: <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} friend in {location}.",
  "Good vibes only with <span style=\"color:pink;\">{name}</span>, a cheerful {age}-year {orientation} in {location}.",
  "Let’s make memories with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} fun in {location}.",
  "Your next great time starts with <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} joy in {location}."
];

  const newRegularTemplates = [
    "Fresh face alert! Meet <span style=\"color:pink;\">{name}</span>, the newest {age}-year {orientation} in {location}.",
    "Newly nearby: <span style=\"color:pink;\">{name}</span> joins with {age} years of {orientation} fun in {location}.",
    "Just here—<span style=\"color:pink;\">{name}</span> brings {age}-year {orientation} vibes to {location}. Say hello!",
    "Hot new hello: <span style=\"color:pink;\">{name}</span> greets {age} years of {orientation} in {location}.",
    "Brand new buddy: <span style=\"color:pink;\">{name}</span>—{age} years fresh for {orientation} in {location}.",
  ];

  const templates = isNewRegular ? newRegularTemplates : summaryTemplates;

  const summaryHTML = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * templates.length);
    const template = templates[randomIndex];

    const road = regular.location?.roadStreet?.trim();
    const local = regular.location?.localArea?.trim();
    const ward = regular.location?.ward?.trim();
    const constituency = regular.location?.constituency?.trim();
    const countyName = regular.location?.county?.trim() || county;

    const locationParts = [road, local, ward, constituency].filter(Boolean);
    const finalLocation = locationParts.length > 0
      ? `${locationParts.join(", ")} in ${countyName}`
      : `in ${countyName}`;

    return template
      .replace(/{name}/g, regular.personal?.username || "Sweet Companion")
      .replace(/{age}/g, regular.personal?.age || "25")
      .replace(/{location}/g, finalLocation)
      .replace(/{orientation}/g, regular.personal?.orientation || "Versatile");
  }, [regular, templates, county]);

  const imageContent = regular?.photos?.[0] ? (
    <AdvancedImage
      cldImg={cld.image(regular.photos[0]).resize(auto().gravity(autoGravity()))}
      className="w-full h-64 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
      alt={regular.personal?.username}
    />
  ) : (
    <div className="w-full h-64 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl flex items-center justify-center border-2 border-dashed border-pink-200">
      <span className="text-pink-600 font-bold text-lg">Friendly Face</span>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100 hover:shadow-2xl hover:border-pink-300 transition-all duration-500">
      <Link to={`/profile/${regular._id}`} className="block">
        <div className="relative group">
          {imageContent}

          <div className="absolute top-3 right-3 bg-black/70 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-sm">
            <span className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
            {isOnline ? "LIVE" : "OFFLINE"}
          </div>

          <div className="absolute top-3 left-3 bg-white/95 px-4 py-2 rounded-full shadow-xl border border-gray-300">
            <span className="text-xs font-bold text-gray-700">Not Verified</span>
          </div>

          {isNewRegular && (
            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-2 rounded-full text-sm font-bold shadow-2xl border-2 border-yellow-300 animate-bounce">
              NEW!
            </div>
          )}
        </div>

         <div className="p-6 text-center">
                  <p
                    className="text-gray-800 font-medium text-base leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: summaryHTML }}
                  />

                  <button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-3 rounded-full hover:from-pink-700 hover:to-rose-700 transition transform hover:scale-105 shadow-lg">
                    Explore Profile
                  </button>
                </div>
      </Link>

      {regular.personal?.phone && (
        <div className="px-6 pb-6">
          <a
                    href={`tel:${regular.personal.phone}`}
                    className="block w-full text-center bg-gradient-to-r from-rose-700 to-pink-700 text-white font-bold py-3 rounded-full hover:from-rose-800 hover:to-pink-800 transition transform hover:scale-105 shadow-lg"
                    onClick={(e) => {
                      if (!/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                        e.preventDefault();
                        navigator.clipboard.writeText(regular.personal.phone);
                        showToast(`Copied: ${regular.personal.phone}`, false);
                      }
                    }}
                  >
                    Call Now {regular.personal.phone}
                  </a>
        </div>
      )}
    </div>
  );
};

// Main component — no hooks in loops!
const RegularListByCounty = ({ regularAccountsByCounty = [] }) => {
  if (!Array.isArray(regularAccountsByCounty) || regularAccountsByCounty.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-pink-600 mb-4">Regular Escorts</h2>
        <p className="text-gray-500 text-lg">No friendly companions available right now. Check back soon!</p>
      </section>
    );
  }

  return (
    <>
      {regularAccountsByCounty.map((countyData) => {
        const countyId = countyData?._id || "Unknown Area";
        const users = Array.isArray(countyData?.users) ? countyData.users : [];

        if (users.length === 0) {
          return (
            <section key={countyId} className="max-w-6xl mx-auto px-4 py-16 text-center">
              <h2 className="text-3xl font-bold text-pink-600 mb-4">
                Regular Escorts in {countyId}
              </h2>
              <p className="text-gray-500">No companions in {countyId} right now. Try another area!</p>
            </section>
          );
        }

        return (
          <section key={countyId} className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-pink-600">
              Friendly Regular Escorts in {countyId}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {users.map((regular) => (
                <RegularCard key={regular._id} regular={regular} county={countyId} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
};

export default RegularListByCounty;