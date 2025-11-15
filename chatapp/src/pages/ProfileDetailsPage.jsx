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
      {modalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-pink-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-6xl h-[90vh] flex flex-col items-center justify-center">
            {/* Counter - only show if more than one image */}
            {profile.photos && profile.photos.length > 1 && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium z-10">
                {(() => {
                  const idx = profile.photos.indexOf(selectedImage);
                  return idx >= 0
                    ? `${idx + 1}/${profile.photos.length}`
                    : `1/${profile.photos.length}`;
                })()}
              </div>
            )}

            {/* Image Display */}
            <div className="w-full h-full flex items-center justify-center">
              {profile.photos && profile.photos.length > 1 ? (
                <Slider {...modalCarouselSettings}>
                  {profile.photos.map((publicId, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center h-full"
                    >
                      <Image
                        cloudName="dcxggvejn"
                        publicId={publicId}
                        alt={`Photo ${index + 1}`}
                        className="max-h-full max-w-full object-contain mx-auto"
                      >
                        <Transformation width="1200" height="800" crop="fit" />
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
                  ))}
                </Slider>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Image
                    cloudName="dcxggvejn"
                    publicId={selectedImage}
                    alt="Photo"
                    className="max-h-full max-w-full object-contain mx-auto"
                  >
                    <Transformation width="1200" height="800" crop="fit" />
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
              )}
            </div>
          </div>
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
      {profile.services?.selected?.length > 0 || profile.services?.custom && (
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-10 hover:shadow-2xl transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-pink-500" />
            Services Offered
          </h2>
          {profile.services?.selected?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.services.selected.map((service, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800 border border-pink-200"
                >
                  {service}
                </span>
              ))}
            </div>
          )}
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