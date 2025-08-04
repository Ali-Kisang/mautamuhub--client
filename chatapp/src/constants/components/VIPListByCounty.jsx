import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { useAuthStore } from "../../store/useAuthStore";

const VIPListByCounty = ({ vipAccountsByCounty }) => {
  const cld = new Cloudinary({
    cloud: { cloudName: "dcxggvejn" },
  });

  // ✅ get online users from store
  const { onlineUsers } = useAuthStore();

  return (
    <>
      {vipAccountsByCounty.map((countyData) => (
        <section key={countyData._id} className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-pink text-center">
            VIP Accounts in {countyData._id}
          </h2>

          {countyData.users && countyData.users.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {countyData.users.map((vip) => {
                // ✅ Check online status
                const isOnline = onlineUsers?.some(
                  (u) => u.userId?.toString() === vip.user?.toString()
                );

                return (
                  <div
                    key={vip._id}
                    className="border rounded-lg shadow-lg p-6 bg-white transition-all duration-300 hover:border-pink hover:shadow-xl hover:scale-105"
                  >
                    <Link
                      to={`/profile/${vip._id}`}
                      className="block text-center relative"
                    >
                      {vip.photos && vip.photos.length > 0 && (
                        <div className="w-full h-64 flex justify-center items-center relative">
                          <AdvancedImage
                            cldImg={cld
                              .image(vip.photos[0])
                              .resize(auto().gravity(autoGravity()))}
                            className="w-full h-full object-cover rounded-md"
                            alt="Profile Photo"
                          />

                          {/* ✅ Online/Offline Indicator */}
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
                        Meet {vip.personal?.username} escort
                      </h3>
                      <p className="text-gray-600">
                        {vip.personal?.gender} | {vip.personal?.orientation}{" "}
                        {vip.personal?.age}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        {vip.location?.constituency}, {vip.location?.ward}
                      </p>
                    </Link>

                    {/* ✅ Call Button */}
                    {vip?.personal?.phone && (
                      <a
                        href={`tel:${vip.personal.phone}`}
                        className="mt-4 inline-block w-full text-center bg-pink text-white py-2 rounded hover:bg-pink/90 transition"
                      >
                        Call Now {vip.personal.phone}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-red-500 text-center text-lg">
              No VIP Accounts available in this county.
            </p>
          )}
        </section>
      ))}
    </>
  );
};

export default VIPListByCounty;
