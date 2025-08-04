import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { MessageCircle, ArrowLeft, X } from "lucide-react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { Image, Transformation } from "cloudinary-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 👉 Custom arrow components
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

export default function ProfileDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/profile-by-id/${id}`);
        console.log("PROFILE RESPONSE:", res.data);
        setProfile(res.data);
      } catch (err) {
        console.error("Fetch profile error:", err);
        setError("Could not load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading)
    return (
      <p className="p-6 text-center text-lg text-gray-500">
        ⏳ Loading profile...
      </p>
    );
  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!profile)
    return (
      <p className="p-6 text-center text-gray-600">Profile not found.</p>
    );

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
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
    <motion.div
      className="max-w-2xl mx-auto px-4 py-6 mt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Carousel */}
      {profile.photos && profile.photos.length > 0 && (
        <div className="mb-6 rounded-xl overflow-hidden shadow relative">
          <Slider {...carouselSettings}>
            {profile.photos.map((publicId, index) => (
              <div
                key={index}
                className="w-full h-100 bg-gray-100 flex justify-center items-center"
              >
                <div className="flex justify-center items-center bg-pink-100 hover:bg-pink-200 transition-colors rounded-lg p-2">
  <Image
  cloudName="dcxggvejn"
  publicId={publicId}
  alt={`Photo ${index + 1}`}
  className="w-full h-80 object-contain cursor-pointer bg-black"
  onClick={() => {
    setSelectedImage(publicId);
    setModalOpen(true);
  }}
>
  <Transformation width="800" height="800" crop="fit" />
  <Transformation
    overlay={`text:Arial_25_bold:${profile.personal?.username}@Mautamuhub`}
    gravity="south_east"
    x="20"
    y="20"
    opacity="60"
    color="white"
  />
</Image>

</div>

              </div>
            ))}
          </Slider>
        </div>
      )}

    {/* ✅ Modal for fullscreen image */}
{modalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
    {/* Close button */}
    <button
      onClick={() => setModalOpen(false)}
      className="absolute top-4 right-4 text-pink-500 cursor-pointer hover:text-pink-700 text-3xl font-bold z-50"
    >
      ✕
    </button>

    <div className="relative w-full max-w-6xl flex flex-col items-center justify-center px-4">
      {/* ✅ Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-pink-500 text-sm font-medium bg-pink-100 px-3 py-1 rounded-full z-50">
        {(() => {
          const idx = profile.photos.indexOf(selectedImage);
          return idx >= 0
            ? `${idx + 1}/${profile.photos.length} `
            : `1/${profile.photos.length}`;
        })()}
      </div>

      {/* ✅ Slider wrapper */}
      <div className="w-full flex items-center justify-center">
        <Slider
          dots={true}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          initialSlide={profile.photos.indexOf(selectedImage)}
          afterChange={(current) => setSelectedImage(profile.photos[current])}
          className="w-full"
        >
          {profile.photos.map((publicId, index) => (
            <div
              key={index}
              className="flex items-center justify-center"
              style={{ height: "90vh" }}
            >
              <div className="flex items-center justify-center max-h-[90vh] max-w-[90vw]">
                <Image
                  cloudName="dcxggvejn"
                  publicId={publicId}
                  alt={`Photo ${index + 1}`}
                  className="max-h-[90vh] max-w-full object-contain mx-auto"
                >
                  <Transformation crop="fit" width="1200" height="1200" />
                  <Transformation
                    overlay={`text:Arial_20_bold:${profile.personal?.username}@Mautamuhub`}
                    gravity="south_east"
                    x="20"
                    y="20"
                    opacity="60"
                    color="white"
                  />
                </Image>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  </div>
)}

 {/* Header */}
<div className="text-center mb-10">
  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
    {profile.personal?.username}
  </h1>
  <p className="mt-2 inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
    {profile.accountType?.type} Member
  </p>
</div>

{/* Info Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  {/* Personal Info */}
  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
      👤 <span>Personal Info</span>
    </h2>
    <ul className="space-y-1 text-gray-700">
      <li><span className="font-semibold">Phone:</span> {profile.personal?.phone}</li>
      <li><span className="font-semibold">Gender:</span> {profile.personal?.gender}</li>
      <li><span className="font-semibold">Age:</span> {profile.personal?.age}</li>
      {profile.personal?.ethnicity && (
        <li><span className="font-semibold">Ethnicity:</span> {profile.personal?.ethnicity}</li>
      )}
      {profile.personal?.orientation && (
        <li><span className="font-semibold">Orientation:</span> {profile.personal?.orientation}</li>
      )}
    </ul>
  </div>

  {/* Location */}
  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
      📍 <span>Location</span>
    </h2>
    <ul className="space-y-1 text-gray-700">
      <li>{profile.location?.localArea}</li>
      <li>{profile.location?.ward}</li>
      <li>{profile.location?.constituency}</li>
      <li>{profile.location?.county}</li>
    </ul>
  </div>
</div>

{/* Account Type */}
<div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl shadow-lg p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
  <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
    💎 <span>Account Type</span>
  </h2>
  <ul className="space-y-1 text-gray-700">
    <li><span className="font-semibold">Type:</span> {profile.accountType?.type}</li>
    <li><span className="font-semibold">Amount:</span> Ksh {profile.accountType?.amount}</li>
    <li><span className="font-semibold">Duration:</span> {profile.accountType?.duration} months</li>
  </ul>
</div>

{/* Rates */}
<div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl shadow-lg p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
  <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
    💲 <span>Rates</span>
  </h2>
  <ul className="space-y-1 text-gray-700">
    <li><span className="font-semibold">Incall:</span> Ksh {profile.additional?.incallRate}</li>
    <li><span className="font-semibold">Outcall:</span> Ksh {profile.additional?.outcallRate}</li>
  </ul>
</div>

{/* Description */}
{profile.additional?.description && (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
    <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
      📝 <span>About {profile.personal?.username}</span>
    </h2>
    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
      {profile.additional.description}
    </p>
  </div>
)}

{/* Services */}
{profile.services?.selected?.length > 0 && (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
    <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
      ✅ <span>Services</span>
    </h2>
    <ul className="list-disc pl-5 space-y-1 text-gray-700">
      {profile.services.selected.map((service, idx) => (
        <li key={idx}>{service}</li>
      ))}
    </ul>
  </div>
)}

{/* Action Buttons */}
<div className="flex flex-col gap-4">
  {/* Chat button */}
  <button
    onClick={() => navigate(`/chat/${profile.user._id}`)}
    className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white py-4 rounded-2xl flex justify-center items-center gap-3 text-lg font-semibold shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300"
  >
    <MessageCircle className="w-6 h-6" />
    Chat with {profile.personal?.username}
  </button>

  {/* Call button */}
  {profile.personal?.phone && (
    <a
      href={`tel:${profile.personal.phone}`}
      className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-2xl flex justify-center items-center gap-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
    >
      📞 Call Me Now
    </a>
  )}
</div>

    </motion.div>
  );
}
