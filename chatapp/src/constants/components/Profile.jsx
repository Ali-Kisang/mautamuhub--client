import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import Slider from "react-slick";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { MessageCircle } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedUser } = useChatStore();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "dcxggvejn",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${server}/escorts/profile/${id}`);
        setUser(response.data);
      } catch (err) {
        setError("Error fetching user data.");
      }
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-primary text-lg mt-20">
        Loading user profile...
      </div>
    );
  }

  if (error) {
    return <div className="text-error text-center mt-20">{error}</div>;
  }

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-4 mt-16"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button */}
      <div className="relative">
        <div className="absolute top-0 left-0 z-10">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-coralPink hover:text-pink bg-base-100 p-2 rounded-full shadow"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </motion.button>
        </div>
      </div>

      {user && (
        <div className="card bg-base-200 shadow-xl p-6 mt-4">
          {/* Carousel Section */}
          <div className="mt-6 relative">
            <h2 className="text-lg font-semibold text-primary mb-4">
              More about {user.fullName}
            </h2>
            <Slider {...carouselSettings}>
              {user.photos?.map((photo, index) => {
                const cloudinaryImage = cld.image(photo);
                cloudinaryImage.resize(auto().gravity(autoGravity()));

                return (
                  <div
                    key={index}
                    className="flex justify-center items-center w-full h-full relative"
                  >
                    <div
                      className="w-full h-96 flex justify-center items-center cursor-pointer"
                      onClick={() => {
                        setSelectedImage(photo);
                        setModalOpen(true);
                      }}
                    >
                      <AdvancedImage
                        cldImg={cloudinaryImage}
                        className="object-contain w-full h-full rounded-lg"
                        alt={`User Photo ${index + 1}`}
                      />
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>

          {/* Modal for Fullscreen Image */}
          {modalOpen && (
            <dialog open className="modal">
              <div className="modal-box">
                <button
                  className="btn btn-sm btn-circle absolute right-2 top-2"
                  onClick={() => setModalOpen(false)}
                >
                  ✕
                </button>
                <img
                  src={selectedImage}
                  alt="Full View"
                  className="max-w-full max-h-screen object-contain"
                />
              </div>
            </dialog>
          )}

          {/* Header Section */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <span className="text-4xl font-bold text-gray-300 flex justify-center items-center h-full">
                  {user.personalInfo?.username.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {user.personalInfo?.username}
              </h1>
              <p className="badge badge-primary text-white">
                {user.accountType?.type} Member
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-base-100 p-4 shadow-md">
              <h3 className="text-lg font-semibold text-primary">
                Personal Info
              </h3>
              <p>
                <strong>Phone:</strong> {user.personalInfo?.phoneNumber}
              </p>
              <p>
                <strong>Gender:</strong> {user.personalInfo?.gender}
              </p>
              <p>
                <strong>Age:</strong> {user.personalInfo?.age}
              </p>
              <p>
                <strong>Complexion:</strong> {user.personalInfo?.complexion}
              </p>
            </div>
            <div className="card bg-base-100 p-4 shadow-md">
              <h3 className="text-lg font-semibold text-primary">Location</h3>
              <p>
                <strong>County:</strong> {user.breadcrumbLocation?.county}
              </p>
              <p>
                <strong>Road/Street:</strong>{" "}
                {user.breadcrumbLocation?.roadStreet}
              </p>
              <p>
                <strong>Ethnicity:</strong> {user.personalInfo?.ethnicity}
              </p>
              <p>
                <strong>Sexual Orientation:</strong>{" "}
                {user.personalInfo?.sexualOrientation}
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Services
            </h2>
            <ul className="list-disc pl-6 text-gray-600">
              {user.services?.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>

          {/* Additional Information */}
<div className="mt-6">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Information</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Incall Rate */}
    <div className="card bg-base-100 p-4 shadow-sm border border-base-300 rounded-lg">
      <h3 className="text-lg font-semibold text-primary mb-1">Incall Rate/hr</h3>
      <p className="text-gray-700">KES {user.additionalInfo?.incallRate || "N/A"}</p>
    </div>

    {/* Outcall Rate */}
    <div className="card bg-base-100 p-4 shadow-sm border border-base-300 rounded-lg">
      <h3 className="text-lg font-semibold text-primary mb-1">Outcall Rate/hr</h3>
      <p className="text-gray-700">KES {user.additionalInfo?.outcallRate || "N/A"}</p>
    </div>
  </div>

  {/* Description */}
  <div className="card bg-base-100 p-4 shadow-sm border border-base-300 rounded-lg mt-4">
    <h3 className="text-lg font-semibold text-primary mb-2">
      About {user.personalInfo?.username}
    </h3>
    <p className="text-gray-700 whitespace-pre-line">
      {user.additionalInfo?.description || "No description provided."}
    </p>
  </div>
</div>



          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
  <button
  className="btn btn-primary flex items-center gap-2"
  onClick={() => {
    // This sets the whole profile object to Zustand so you can use extra info if needed
    setSelectedUser(user);

    // Open the chat in a new window/tab with the linked User ID
    window.open(`/chat/${user.user}`, "_blank");
  }}
>
  <MessageCircle className="w-5 h-5" />
  Chat Now
</button>


  <button className="btn btn-secondary">Contact</button>
  <button className="btn btn-outline">Report Profile</button>
</div>

        </div>
      )}
    </motion.div>
  );
};

export default Profile;
