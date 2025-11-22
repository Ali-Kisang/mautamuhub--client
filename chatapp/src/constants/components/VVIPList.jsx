import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { MdVerified } from "react-icons/md";
import { useAuthStore } from "../../store/useAuthStore";
import { showToast } from "../../components/utils/showToast";
import { useMemo } from "react";

const VVIPList = ({ vvipAccounts }) => {
  const cld = new Cloudinary({ cloud: { cloudName: "dcxggvejn" } });
  const { onlineUsers } = useAuthStore();

  const summaryTemplates = [
  "Captivate your desires with <span style=\"color:pink;\">{name}</span>, a mesmerizing {age}-year-old {orientation} enchantress from {location}.",
  "Indulge in passion with <span style=\"color:pink;\">{name}</span>—your {age}-year {orientation} fantasy alive in {location}.",
  "Surrender to seduction with <span style=\"color:pink;\">{name}</span>, the {age}-year siren of {orientation} allure in {location}.",
  "Unleash your wild side with <span style=\"color:pink;\">{name}</span>, a sultry {age}-year {orientation} temptress from {location}.",
  "Ignite the spark with <span style=\"color:pink;\">{name}</span>—{age} years of irresistible {orientation} charm in {location}.",
  "Embrace ecstasy with <span style=\"color:pink;\">{name}</span>, where {age} years of {orientation} passion bloom in {location}.",
  "Dive into delight with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} muse awaiting in {location}.",
  "Experience euphoria with <span style=\"color:pink;\">{name}</span>, a captivating {age}-year {orientation} vision in {location}.",
  "Awaken your senses with <span style=\"color:pink;\">{name}</span>—{age} years of tantalizing {orientation} in {location}.",
  "Lose yourself in luxury with <span style=\"color:pink;\">{name}</span>, the {age}-year epitome of {orientation} desire in {location}.",
  "Entice your evenings with <span style=\"color:pink;\">{name}</span>, a fiery {age}-year {orientation} flame from {location}.",
  "Discover decadence with <span style=\"color:pink;\">{name}</span>—{age} years crafting {orientation} dreams in {location}.",
  "Bask in beauty with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} goddess in {location}.",
  "Fuel your fantasies with <span style=\"color:pink;\">{name}</span>, a bold {age}-year {orientation} adventurer in {location}.",
  "Savor the thrill with <span style=\"color:pink;\">{name}</span>—{age} years of electric {orientation} energy in {location}.",
  "Melt into magic with <span style=\"color:pink;\">{name}</span>, the {age}-year whisper of {orientation} seduction in {location}.",
  "Chase the chemistry with <span style=\"color:pink;\">{name}</span>, a vibrant {age}-year {orientation} vixen from {location}.",
  "Radiate romance with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} radiance in {location}.",
  "Tease your temptations with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} tease in {location}.",
  "Venture into velvet with <span style=\"color:pink;\">{name}</span>, a smooth {age}-year {orientation} seductress in {location}.",
  "Whirlwind of wonder with <span style=\"color:pink;\">{name}</span>—{age} years spinning {orientation} spells in {location}.",
  "Alluring aura surrounds <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} aura in {location}.",
  "Blissful bond awaits with <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} bliss in {location}.",
  "Charismatic charm defines <span style=\"color:pink;\">{name}</span>—{age} years of pure {orientation} magnetism in {location}.",
  "Dazzling desire ignites with <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} dazzle from {location}.",
  "Erotic elegance personified: <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} grace in {location}.",
  "Fervent fire burns within <span style=\"color:pink;\">{name}</span>—{age} years fueling {orientation} passion in {location}.",
  "Glamorous glow radiates from <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} glamour in {location}.",
  "Hypnotic heat draws you to <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} hypnosis in {location}.",
  "Intimate intrigue awaits with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} intimacy in {location}.",
  "Playful pulse beats for <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} pulse from {location}.",
  "Ravishing rhythm moves <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} ravishment in {location}.",
  "Sensual symphony plays with <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} masterpiece in {location}.",
  "Tantalizing tango begins with <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} dance in {location}.",
  "Utterly unforgettable: <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} perfection in {location}.",
  "Vivacious vibe explodes from <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} energy in {location}.",
  "Whimsical whisper calls you to <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} whimsy in {location}.",
  "Exquisite temptation embodied by <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} treasure in {location}.",
  "Forbidden fruit tastes sweetest with <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} sin in {location}.",
  "Heavenly touch belongs to <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} divinity in {location}.",
  "Irresistible invitation from <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} dream in {location}.",
  "Jaw-dropping beauty meets <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} perfection in {location}.",
  "Kisses like fire from <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} inferno in {location}.",
  "Lust and luxury collide with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} opulence in {location}.",
  "Magnetic pull of <span style=\"color:pink;\">{name}</span>, {age} years drawing you into {orientation} bliss in {location}.",
  "Naughty by nature: <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} rebel in {location}.",
  "Orgasmic oasis found with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} paradise in {location}.",
  "Pure seduction flows from <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} river in {location}.",
  "Queen of desire reigns as <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} royalty in {location}.",
  "Red-hot rendezvous with <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} heat in {location}.",
  "Sinful secrets shared by <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} confidante in {location}.",
  "Temptation has a name: <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} allure in {location}.",
  "Unapologetically sexy: <span style=\"color:pink;\">{name}</span>, a {age}-year {orientation} bombshell in {location}.",
  "Velvet voice, lethal curves—<span style=\"color:pink;\">{name}</span>, {age} years of {orientation} danger in {location}.",
  "Wicked smile belongs to <span style=\"color:pink;\">{name}</span>—{age} years of {orientation} mischief in {location}.",
  "X-rated dreams star <span style=\"color:pink;\">{name}</span>, your {age}-year {orientation} fantasy in {location}.",
  "Your ultimate weakness: <span style=\"color:pink;\">{name}</span>, {age} years of {orientation} addiction in {location}.",
  "Zero inhibitions with <span style=\"color:pink;\">{name}</span>—pure {age}-year {orientation} freedom in {location}."
];

  const newVVIPTemplates = [
    "Freshly unveiled! Meet <span style=\"color:pink;\">{name}</span>, the newest {age}-year {orientation} sensation in {location}.",
    "Newly ignited passion: <span style=\"color:pink;\">{name}</span> brings {age} years of {orientation} fire to {location}. Dive in now!",
    "Just arrived—<span style=\"color:pink;\">{name}</span> unleashes {age}-year expertise in {orientation} allure in {location}.",
    "Hot new horizon: <span style=\"color:pink;\">{name}</span> debuts {age} years of {orientation} temptation in {location}.",
    "Brand new beguilement with <span style=\"color:pink;\">{name}</span>—{age} years fresh for {orientation} in {location}.",
  ];

  if (!Array.isArray(vvipAccounts) || vvipAccounts.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-pink-600 mb-4">Exclusive VVIP Escorts</h2>
        <p className="text-gray-500 text-lg">No elite companions available right now. Check back soon for pure indulgence.</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-pink-600">
        Exclusive VVIP Escorts
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {vvipAccounts.map((vvip) => {
          const isOnline = onlineUsers?.some(u => u.userId?.toString() === vvip.user?.toString());
          const isNewVVIP = vvip.createdAt && new Date(vvip.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const templates = isNewVVIP ? newVVIPTemplates : summaryTemplates;

          const summaryHTML = useMemo(() => {
            const randomIndex = Math.floor(Math.random() * templates.length);
            const template = templates[randomIndex];

            const road = vvip.location?.roadStreet?.trim();
            const local = vvip.location?.localArea?.trim();
            const ward = vvip.location?.ward?.trim();
            const constituency = vvip.location?.constituency?.trim();
            const county = vvip.location?.county?.trim() || "Nairobi";

            const locationParts = [road, local, ward, constituency].filter(Boolean);
            const finalLocation = locationParts.length > 0
              ? `${locationParts.join(", ")} in ${county}`
              : `in ${county}`;

            return template
              .replace(/{name}/g, vvip.personal?.username || "Goddess")
              .replace(/{age}/g, vvip.personal?.age || "25")
              .replace(/{location}/g, finalLocation)
              .replace(/{orientation}/g, vvip.personal?.orientation || "Straight");
          }, [vvip, templates]);

          const imageContent = vvip?.photos?.[0] ? (
            <AdvancedImage
              cldImg={cld.image(vvip.photos[0]).resize(auto().gravity(autoGravity()))}
              className="w-full h-64 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
              alt={vvip.personal?.username}
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center">
              <span className="text-pink-600 font-bold text-xl">Elite</span>
            </div>
          );

          return (
            <div
              key={vvip._id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-100 hover:shadow-2xl hover:border-pink-300 transition-all duration-500"
            >
              <Link to={`/profile/${vvip._id}`} className="block">
                <div className="relative group">
                  {imageContent}

                  {/* Online Status */}
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-sm">
                    <span className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
                    {isOnline ? "LIVE" : "OFFLINE"}
                  </div>

                  {/* Verified */}
                  <div className="absolute top-3 left-3 bg-white/95 px-4 py-2 rounded-full flex items-center gap-2 shadow-xl border border-pink-200">
                    <MdVerified className="text-pink-600 text-2xl" />
                    <span className="text-xs font-bold text-gray-800">Verified</span>
                  </div>

                  {/* New Badge */}
                  {isNewVVIP && (
                    <div className="absolute bottom-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-2 rounded-full text-sm font-bold shadow-2xl border-2 border-yellow-300 animate-bounce">
                      NEW ELITE!
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

              {/* CALL BUTTON — WORKS 100% ON MOBILE */}
              {vvip.personal?.phone && (
                <div className="px-6 pb-6">
                  <a
                    href={`tel:${vvip.personal.phone}`}
                    className="block w-full text-center bg-gradient-to-r from-rose-700 to-pink-700 text-white font-bold py-3 rounded-full hover:from-rose-800 hover:to-pink-800 transition transform hover:scale-105 shadow-lg"
                    onClick={(e) => {
                      if (!/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                        e.preventDefault();
                        navigator.clipboard.writeText(vvip.personal.phone);
                        showToast(`Copied: ${vvip.personal.phone}`, false);
                      }
                    }}
                  >
                    Call Now {vvip.personal.phone}
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

export default VVIPList;