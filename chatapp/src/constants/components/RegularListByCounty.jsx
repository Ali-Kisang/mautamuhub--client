import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { useAuthStore } from "../../store/useAuthStore";

const RegularListByCounty = ({ regularAccountsByCounty = [] }) => {
  const cld = new Cloudinary({
    cloud: { cloudName: "dcxggvejn" },
  });

  const { onlineUsers = [] } = useAuthStore();

  if (
    !Array.isArray(regularAccountsByCounty) ||
    regularAccountsByCounty.length === 0
  ) {
    return (
      <p className="text-red-500 text-center text-lg mt-8">
        No Regular Accounts available at the moment.
      </p>
    );
  }

  return (
    <>
      {regularAccountsByCounty.map((countyData) => {
        const countyId = countyData?._id || "Unknown County";
        const users = Array.isArray(countyData?.users) ? countyData.users : [];

        return (
          <section key={countyId} className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mt-8 mb-4 text-pink-500 text-center">
              Meet Escorts from {countyId}
            </h2>

            {users.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {users.map((regular) => {
                  const userId = regular?.user?.toString() || "";
                  const isOnline = onlineUsers?.some(
                    (u) => u.userId?.toString() === userId
                  );

                  return (
                    <div
                      key={regular?._id}
                      className="border rounded-lg shadow-lg p-6 bg-white transition-all duration-300 hover:border-pink hover:shadow-xl hover:scale-105"
                    >
                      <Link
                        to={`/profile/${regular?._id || ""}`}
                        className="block text-center relative"
                      >
                        {regular?.photos?.length > 0 && (
                          <div className="w-full h-64 flex justify-center items-center relative">
                            <AdvancedImage
                              cldImg={cld
                                .image(regular.photos[0])
                                .resize(auto().gravity(autoGravity()))}
                              className="w-full h-full object-cover rounded-md"
                              alt="Profile Photo"
                            />

                            {/* ✅ Online/Offline Status */}
                            <div className="absolute top-2 right-2 flex items-center space-x-1">
                              <span
                                className={`w-3 h-3 rounded-full border-2 border-white shadow-md ${
                                  isOnline ? "bg-green-500" : "bg-gray-400"
                                }`}
                              ></span>
                              <span className="text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
                                {isOnline ? "Online" : "Offline"}
                              </span>
                            </div>
                          </div>
                        )}

                        <h3 className="mt-4 text-lg font-semibold text-gray-800 flex items-center justify-center">
                          {regular?.personal?.username || "Unknown"}
                        </h3>
                        <p className="text-gray-600">
                          {regular?.personal?.gender || "-"} |{" "}
                          {regular?.personal?.orientation || "-"}{" "}
                          {regular?.personal?.age || ""}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          {regular?.location?.constituency || "-"},{" "}
                          {regular?.location?.ward || ""}
                        </p>
                      </Link>

                      {/* ✅ Call Button */}
                      {regular?.personal?.phone && (
                        <a
                          href={`tel:${regular.personal.phone}`}
                          className="mt-4 inline-block w-full text-center bg-pink-500 text-white py-2 rounded hover:bg-pink/90 transition"
                        >
                          Call Now {regular.personal.phone}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-red-500 text-center text-lg">
                No Regular Accounts available in this county.
              </p>
            )}
          </section>
        );
      })}
    </>
  );
};

export default RegularListByCounty;
