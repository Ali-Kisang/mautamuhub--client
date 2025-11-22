import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { MessageCircle, ArrowLeft, X, User, MapPin, DollarSign, FileText, CheckCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { Image, Transformation } from "cloudinary-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} !flex !items-center !justify-center !bg-white/20 hover:!bg-white/30 !rounded-full backdrop-blur-sm`}
      style={{ right: "10px", zIndex: 2 }}
      onClick={onClick}
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} !flex !items-center !justify-center !bg-white/20 hover:!bg-white/30 !rounded-full backdrop-blur-sm`}
      style={{ left: "10px", zIndex: 2 }}
      onClick={onClick}
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </div>
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
      <div className="flex flex-col items-center justify-center h-64 gap-2" role="status" aria-live="polite">
          <l-dot-stream size="60" speed="2.5" color="#ec4899"></l-dot-stream>
          <p className="text-pink-500 font-medium">Loading profile...</p>
        </div>
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
      <div className="slick-dots absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {dots}
      </div>
    ),
    customPaging: (i) => (
      <div className="w-3 h-3 bg-white/50 rounded-full hover:bg-white transition-colors" />
    ),
  };

  const modalCarouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: profile.photos ? profile.photos.indexOf(selectedImage) : 0,
    afterChange: (current) => setSelectedImage(profile.photos[current]),
    className: "w-full h-full",
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const handleImageClick = (publicId) => {
    setSelectedImage(publicId);
    setModalOpen(true);
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to profiles
        </button>
      </div>

      {/* Images Section */}
      {profile.photos && profile.photos.length > 0 && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-xl relative">
          {profile.photos.length > 1 ? (
            <Slider {...carouselSettings}>
              {profile.photos.map((publicId, index) => (
                <div
                  key={index}
                  className="relative w-full h-[400px] bg-gray-100 flex justify-center items-center"
                >
                  <Image
                    cloudName="dcxggvejn"
                    publicId={publicId}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => handleImageClick(publicId)}
                  >
                    <Transformation width="800" height="400" crop="fit" />
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
              ))}
            </Slider>
          ) : (
            <div className="relative w-full h-[400px] bg-gray-100 flex justify-center items-center">
              <Image
                cloudName="dcxggvejn"
                publicId={profile.photos[0]}
                alt="Photo"
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => handleImageClick(profile.photos[0])}
              >
                <Transformation width="800" height="400" crop="fit" />
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
          )}
        </div>
      )}

      {/* Modal for fullscreen image */}
            {/* FINAL MODAL — PERFECT IMAGES, PINK ARROWS, NO DOUBLE ARROWS */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-4 md:p-8">
          {/* Top Bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
            {profile.photos && profile.photos.length > 1 && (
              <div className="bg-pink-600/90 backdrop-blur-md text-white px-6 py-3 rounded-full text-lg font-bold shadow-2xl border border-pink-400">
                {(profile.photos.indexOf(selectedImage) + 1)} / {profile.photos.length}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 md:top-6 md:right-6 bg-pink-600/90 hover:bg-pink-700 text-white p-4 rounded-full transition-all z-50 shadow-2xl hover:scale-110 border border-pink-400"
          >
            <X className="w-9 h-9" />
          </button>

          {/* Main Image — FULL BEAUTY & CONSISTENT */}
          <div className="relative w-full h-full max-w-6xl max-h-[92vh] flex items-center justify-center">
            {profile.photos && profile.photos.length > 1 ? (
              <Slider
                {...modalCarouselSettings}
                arrows={true}
                prevArrow={
                  <div className="slick-arrow !left-4 md:!left-8 !w-14 !h-14 !bg-pink-600/80 hover:!bg-pink-700 !rounded-full !flex !items-center !justify-center !shadow-2xl !border-2 !border-pink-400">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                }
                nextArrow={
                  <div className="slick-arrow !right-4 md:!right-8 !w-14 !h-14 !bg-pink-600/80 hover:!bg-pink-700 !rounded-full !flex !items-center !justify-center !shadow-2xl !border-2 !border-pink-400">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                }
              >
                {profile.photos.map((publicId, index) => (
                  <div key={index} className="flex items-center justify-center h-full px-4">
                    <Image
                      cloudName="dcxggvejn"
                      publicId={publicId}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                      alt={`Photo ${index + 1}`}
                    >
                      <Transformation
                        width="1400"
                        height="1800"
                        crop="limit"
                        quality="auto:best"
                        fetchFormat="auto"
                      />
                      <Transformation
                        overlay={{
                          fontFamily: "Arial",
                          fontSize: 32,
                          fontWeight: "bold",
                          text: `${profile.personal?.username}@Mautamuhub`
                        }}
                        gravity="south_east"
                        x="40"
                        y="40"
                        opacity="80"
                        color="white"
                      />
                    </Image>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="flex items-center justify-center h-full px-4">
                <Image
                  cloudName="dcxggvejn"
                  publicId={selectedImage}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  alt="Fullscreen"
                >
                  <Transformation
                    width="1400"
                    height="1800"
                    crop="limit"
                    quality="auto:best"
                    fetchFormat="auto"
                  />
                  <Transformation
                    overlay={{
                      fontFamily: "Arial",
                      fontSize: 32,
                      fontWeight: "bold",
                      text: `${profile.personal?.username}@Mautamuhub`
                    }}
                    gravity="south_east"
                    x="40"
                    y="40"
                    opacity="80"
                    color="white"
                  />
                </Image>
              </div>
            )}
          </div>

          {/* REMOVE ALL DEFAULT ARROWS & STYLING */}
          <style jsx global>{`
            .slick-prev:before, .slick-next:before { display: none !important; }
            .slick-prev, .slick-next { 
              z-index: 40 !important;
              width: 56px !important;
              height: 56px !important;
            }
          `}</style>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          {profile.personal?.username}
        </h1>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Personal Info */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
            <User className="w-6 h-6 text-pink-500" />
            Personal Information
          </h2>
          <dl className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <dt className="font-medium">Phone</dt>
              <dd>{profile.personal?.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Gender</dt>
              <dd>{profile.personal?.gender}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Age</dt>
              <dd>{profile.personal?.age}</dd>
            </div>
            {profile.personal?.complexity && (
              <div className="flex justify-between">
                <dt className="font-medium">Complexity</dt>
                <dd>{profile.personal?.complexity}</dd>
              </div>
            )}
            {profile.personal?.ethnicity && (
              <div className="flex justify-between">
                <dt className="font-medium">Ethnicity</dt>
                <dd>{profile.personal?.ethnicity}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="font-medium">Orientation</dt>
              <dd>{profile.personal?.orientation}</dd>
            </div>
            {profile.personal?.orientationOther && (
              <div className="flex justify-between">
                <dt className="font-medium">Orientation Other</dt>
                <dd>{profile.personal?.orientationOther}</dd>
              </div>
            )}
          </dl>
        </motion.div>

        {/* Location */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-pink-500" />
            Location
          </h2>
          <dl className="space-y-3 text-gray-700">
            {profile.location?.localArea && (
              <div className="flex justify-between">
                <dt className="font-medium">Local Area</dt>
                <dd>{profile.location?.localArea}</dd>
              </div>
            )}
            {profile.location?.roadStreet && (
              <div className="flex justify-between">
                <dt className="font-medium">Road/Street</dt>
                <dd>{profile.location?.roadStreet}</dd>
              </div>
            )}
            {profile.location?.city && (
              <div className="flex justify-between">
                <dt className="font-medium">City</dt>
                <dd>{profile.location?.city}</dd>
              </div>
            )}
            {profile.location?.ward && (
              <div className="flex justify-between">
                <dt className="font-medium">Ward</dt>
                <dd>{profile.location?.ward}</dd>
              </div>
            )}
            {profile.location?.constituency && (
              <div className="flex justify-between">
                <dt className="font-medium">Constituency</dt>
                <dd>{profile.location?.constituency}</dd>
              </div>
            )}
            {profile.location?.county && (
              <div className="flex justify-between">
                <dt className="font-medium">County</dt>
                <dd>{profile.location?.county}</dd>
              </div>
            )}
          </dl>
        </motion.div>
      </div>

      {/* Rates */}
      {(profile.additional?.incallRate || profile.additional?.outcallRate) && (
        <motion.div
          className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl shadow-lg p-6 mb-10 hover:shadow-2xl transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-pink-500" />
            Rates
          </h2>
          <dl className="space-y-3 text-gray-700">
            {profile.additional?.incallRate && (
              <div className="flex justify-between">
                <dt className="font-medium">Incall</dt>
                <dd className="text-pink-600 font-semibold">Ksh {profile.additional?.incallRate?.toLocaleString()}</dd>
              </div>
            )}
            {profile.additional?.outcallRate && (
              <div className="flex justify-between">
                <dt className="font-medium">Outcall</dt>
                <dd className="text-pink-600 font-semibold">Ksh {profile.additional?.outcallRate?.toLocaleString()}</dd>
              </div>
            )}
          </dl>
        </motion.div>
      )}

      {/* Description */}
      {profile.additional?.description && (
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-10 hover:shadow-2xl transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
            <FileText className="w-6 h-6 text-pink-500" />
            About {profile.personal?.username}
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
            {profile.additional.description}
          </p>
        </motion.div>
      )}

      {/* Services */}
            {/* Services */}
      {((profile.services?.selected && profile.services.selected.length > 0) || 
        (Array.isArray(profile.services) && profile.services.length > 0) || 
        profile.services?.custom) && (
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-10 hover:shadow-2xl transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-pink-500" />
            Services Offered
          </h2>

          {/* This part now works with BOTH old format (direct array) and new format ({selected: [...]}) */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(profile.services?.selected || 
              (Array.isArray(profile.services) ? profile.services : [])
            ).map((service, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800 border border-pink-200"
              >
                {service}
              </span>
            ))}
          </div>

          {profile.services?.custom && (
            <p className="text-gray-700 leading-relaxed text-lg">
              {profile.services.custom}
            </p>
          )}
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        {/* Chat button */}
        <motion.button
          onClick={() => navigate(`/chat/${profile.user._id}`)}
          className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white py-4 rounded-2xl flex justify-center items-center gap-3 text-lg font-semibold shadow-lg hover:cursor-pointer  hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageCircle className="w-6 h-6" />
          Start Chat
        </motion.button>

        {/* Call button */}
        {profile.personal?.phone && (
          <motion.a
            href={`tel:${profile.personal.phone}`}
            className="w-full bg-gradient-to-r  from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white py-4 rounded-2xl flex justify-center items-center gap-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Phone className="w-6 h-6" />
            Call Now
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}