
import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { useAuthStore } from "../../store/useAuthStore";
import { showToast } from "../../components/utils/showToast";
import { useMemo } from "react";

// Separate card component — hooks are now safe!
const VIPCard = ({ vip, county }) => {
  const cld = new Cloudinary({ cloud: { cloudName: "dcxggvejn" } });
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers?.some(u => u.userId?.toString() === vip.user?.toString());
  const isNewVIP = vip.createdAt && new Date(vip.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const summaryTemplates = [
  "Encounter elegance with <span style=\"color:pink;\">{name}</span>, a captivating {age}-year-old {orientation} from {location}.",
  "Savor sophistication with <span style=\"color:pink;\">{name}</span>—your {age}-year {orientation} allure in {location}.",
  "Delight in desire with <span style=\"color:pink;\">{name}</span>, the {age}-year essence of {orientation} charm in {location}.",
  "Ignite intrigue with <span style=\"color:pink;\">{name}</span>, a sultry {age}-year {orientation} from {location}.",
  "Embrace enchantment with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} grace in {location}.",
  "Unveil your fantasy with <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} perfection in {location}.",
  "Bask in the glow of <span style=\"color:pink;\">{name}</span>, a radiant {age}-year {orientation} star in {location}.",
  "Experience exquisite company with <span style=\"color:pink;\">{name}</span>—{age} years crafting {orientation} moments in {location}.",
  "Awaken adventure with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} companion in {location}.",
  "Lose yourself in luxury with <span style=\"color:pink;\">{name}</span>, the {age}-year pinnacle of {orientation} in {location}.",
  "Tease the night with <span style=\"color:pink;\">{name}</span>, a fiery {age}-year {orientation} spark from {location}.",
  "Discover divine delight with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} divinity in {location}.",
  "Float into fascination with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} fantasy in {location}.",
  "Fuel the fire with <span style=\"color:pink;\">{name}</span>, a bold {age}-year {orientation} beacon in {location}.",
  "Savor the seduction with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} sensuality in {location}.",
  "Mingle in mystery with <span style=\"color:pink;\">{name}</span>, the {age}-year whisper of {orientation} in {location}.",
  "Pursue passion with <span style=\"color:pink;\">{name}</span>, a vibrant {age}-year {orientation} vibe from {location}.",
  "Radiate rapture with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} radiance in {location}.",
  "Stir the senses with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} siren in {location}.",
  "Tantalize tonight with <span style=\"color:pink;\">{name}</span>, a smooth {age}-year {orientation} seduction in {location}.",
  "Unleash uniqueness with <span style=\"color:pink;\">{name}</span>—{age} years weaving {orientation} wonders in {location}.",
  "Venture vibrantly with <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} vitality in {location}.",
  "Whisper wonders with <span style=\"color:pink;\">{name}</span>, the {age}-year {orientation} whisperer in {location}.",
  "Allure awaits with <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} allure in {location}.",
  "Bliss beckons with <span style=\"color:pink;\">{name}</span>—{age} years beckoning {orientation} bliss in {location}.",
  "Charm cascades from <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} cascade in {location}.",
  "Dare to dream with <span style=\"color:pink;\">{name}</span>, {age} years dreaming {orientation} dares in {location}.",
  "Enthrall endlessly with <span style=\"color:pink;\">{name}</span>—{age} years enthralling {orientation} in {location}.",
  "Fascinate forever with <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} fascination in {location}.",
  "Glimpse glamour with <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} glamour in {location}.",
  "Hypnotize here with <span style=\"color:pink;\">{name}</span>—{age} years hypnotizing {orientation} in {location}.",
  "Intrigue ignites with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} ignition from {location}.",
  "Jewel of joy: <span style=\"color:pink;\">{name}</span>, {age} years joying {orientation} jewels in {location}.",
  "Kindle kinship with <span style=\"color:pink;\">{name}</span>—{age} years kindling {orientation} kinship in {location}.",
  "Lure luxuriously with <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} lure in {location}.",
  "Mystify moments with <span style=\"color:pink;\">{name}</span>, {age} years mystifying {orientation} in {location}.",
  "Nurture nights with <span style=\"color:pink;\">{name}</span>—{age} years nurturing {orientation} nights in {location}.",
  "Overture of obsession with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} overture from {location}.",
  "Pulse with passion at <span style=\"color:pink;\">{name}</span>, {age} years pulsing {orientation} in {location}.",
  "Quest for queenly with <span style=\"color:pink;\">{name}</span>—{age} years queening {orientation} quests in {location}.",
  "Rhythm of rapture with <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} rhythm in {location}.",
  "Symphony of seduction with <span style=\"color:pink;\">{name}</span>, {age} years symphonizing {orientation} in {location}.",
  "Tide of temptation with <span style=\"color:pink;\">{name}</span>—{age} years tiding {orientation} temptations in {location}.",
  "Unwind uniquely with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} unwind from {location}.",
  "Verve and vitality with <span style=\"color:pink;\">{name}</span>, {age} years verging {orientation} verve in {location}.",
  "Waltz with wonder with <span style=\"color:pink;\">{name}</span>—{age} years waltzing {orientation} wonders in {location}.",
  "Xenial exquisiteness with <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} xenial in {location}.",
  "Yearn for youth with <span style=\"color:pink;\">{name}</span>, {age} years yearning {orientation} youth in {location}.",
  "Pure pleasure awaits with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} ecstasy in {location}.",
  "Seductive secrets shared by <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} confidante in {location}.",
  "Velvet touch belongs to <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} luxury in {location}.",
  "Irresistible invitation from <span style=\"color:pink;\">{name}</span>, the {age}-year {orientation} dream in {location}.",
  "Heavenly company with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} paradise in {location}.",
  "Goddess energy radiates from <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} queen in {location}.",
  "Your perfect escape: <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} bliss in {location}."
];

  const newVIPTemplates = [
    "Freshly fabulous! Meet <span style=\"color:pink;\">{name}</span>, the newest {age}-year {orientation} star in {location}.",
    "Newly arrived allure: <span style=\"color:pink;\">{name}</span> brings {age} years of {orientation} magic to {location}.",
    "Just landed—<span style=\"color:pink;\">{name}</span> offers {age}-year {orientation} elegance in {location}.",
    "Hot new highlight: <span style=\"color:pink;\">{name}</span> spotlights {age} years of {orientation} in {location}.",
    "Brand new brilliance with <span style=\"color:pink;\">{name}</span>—{age} years fresh for {orientation} in {location}.",
  ];

  const templates = isNewVIP ? newVIPTemplates : summaryTemplates;

  const summaryHTML = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * templates.length);
    const template = templates[randomIndex];

    const road = vip.location?.roadStreet?.trim();
    const local = vip.location?.localArea?.trim();
    const ward = vip.location?.ward?.trim();
    const constituency = vip.location?.constituency?.trim();
    const countyName = vip.location?.county?.trim() || county;

    const locationParts = [road, local, ward, constituency].filter(Boolean);
    const finalLocation = locationParts.length > 0
      ? `${locationParts.join(", ")} in ${countyName}`
      : `in ${countyName}`;

    return template
      .replace(/{name}/g, vip.personal?.username || "VIP Star")
      .replace(/{age}/g, vip.personal?.age || "25")
      .replace(/{location}/g, finalLocation)
      .replace(/{orientation}/g, vip.personal?.orientation || "Versatile");
  }, [vip, templates, county]);

  const imageContent = vip?.photos?.[0] ? (
    <AdvancedImage
      cldImg={cld.image(vip.photos[0]).resize(auto().gravity(autoGravity()))}
      className="w-full h-64 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
      alt={vip.personal?.username}
    />
  ) : (
    <div className="w-full h-64 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl flex items-center justify-center border-2 border-dashed border-pink-200">
      <span className="text-pink-600 font-bold">VIP</span>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-100 hover:shadow-2xl hover:border-pink-300 transition-all duration-500">
      <Link to={`/profile/${vip._id}`} className="block">
        <div className="relative group">
          {imageContent}

          <div className="absolute top-3 right-3 bg-black/70 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-sm">
            <span className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
            {isOnline ? "LIVE" : "OFFLINE"}
          </div>

          <div className="absolute top-3 left-3 bg-white/95 px-4 py-2 rounded-full shadow-xl border border-gray-300">
            <span className="text-xs font-bold text-gray-700">Not Verified</span>
          </div>

          {isNewVIP && (
            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-2 rounded-full text-sm font-bold shadow-2xl border-2 border-yellow-300 animate-bounce">
              NEW VIP!
            </div>
          )}
        </div>

        <div className="p-6 text-center">
          <p
            className="text-gray-800 font-medium text-base leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: summaryHTML }}
          />

          <button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-3 rounded-full hover:from-pink-700 hover:to-rose-700 transition transform hover:scale-105 shadow-lg">
            View Profile
          </button>
        </div>
      </Link>

      {vip.personal?.phone && (
        <div className="px-6 pb-6">
          <a
            href={`tel:${vip.personal.phone}`}
            className="block w-full text-center bg-gradient-to-r from-rose-700 to-pink-700 text-white font-bold py-3 rounded-full hover:from-rose-800 hover:to-pink-800 transition transform hover:scale-105 shadow-lg"
            onClick={(e) => {
              if (!/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                e.preventDefault();
                navigator.clipboard.writeText(vip.personal.phone);
                showToast(`Copied: ${vip.personal.phone}`, false);
              }
            }}
          >
            Call Now {vip.personal.phone}
          </a>
        </div>
      )}
    </div>
  );
};

// Main component — no hooks in loops!
const VIPListByCounty = ({ vipAccountsByCounty }) => {
  if (!vipAccountsByCounty || vipAccountsByCounty.length === 0) {
    return <div className="text-center py-16 text-gray-500">No VIP accounts found.</div>;
  }

  return (
    <>
      {vipAccountsByCounty.map((countyData) => {
        if (!countyData.users || countyData.users.length === 0) {
          return (
            <section key={countyData._id} className="max-w-6xl mx-auto px-4 py-16 text-center">
              <h2 className="text-3xl font-bold text-pink-600 mb-4">
                VIP Escorts in {countyData._id}
              </h2>
              <p className="text-gray-500">No companions available in {countyData._id} right now.</p>
            </section>
          );
        }

        return (
          <section key={countyData._id} className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-pink-600">
              Elite VIP Escorts in {countyData._id}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {countyData.users.map((vip) => (
                <VIPCard key={vip._id} vip={vip} county={countyData._id} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
};

export default VIPListByCounty;