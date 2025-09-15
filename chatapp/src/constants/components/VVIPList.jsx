import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { MdVerified } from "react-icons/md";
import { useAuthStore } from "../../store/useAuthStore";

const VVIPList = ({ vvipAccounts }) => {
  const cld = new Cloudinary({
    cloud: { cloudName: "dcxggvejn" },
  });

  const { onlineUsers } = useAuthStore();

  if (!Array.isArray(vvipAccounts) || vvipAccounts.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-6">VVIP Accounts</h2>
        <p className="text-red-500 text-center text-lg">
          No VVIP Accounts available at the moment.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">VVIP Escort Accounts</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {vvipAccounts.map((vvip) => {
          const isOnline = onlineUsers?.some(
            (u) => u.userId?.toString() === vvip.user?.toString()
          );

          return (
            <div
              key={vvip?._id}
              className="border rounded-lg shadow-lg p-6 bg-white transition-all duration-300 hover:border-pink-500 hover:shadow-xl hover:scale-105"
            >
              <Link
                to={`/profile/${vvip?._id}`}
                className="block text-center relative"
              >
                {vvip?.photos?.length > 0 && (
                  <div className="w-full h-64 flex justify-center items-center relative">
                    <AdvancedImage
                      cldImg={cld
                        .image(vvip.photos[0])
                        .resize(auto().gravity(autoGravity()))}
                      className="w-full h-full object-cover rounded-md"
                      alt="Profile Photo"
                    />

                    {/* ✅ Online/Offline Dot */}
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
                  Meet {vvip?.personal?.username}
                  <MdVerified className="text-pink-500 ml-1 text-xl" />
                </h3>
                <p className="text-gray-600">
                  {vvip?.personal?.gender} | {vvip?.personal?.orientation} | {vvip?.personal?.age}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {vvip?.location?.constituency}, {vvip?.location?.ward}
                </p>
              </Link>

              {/* ✅ Call Button */}
              {vvip?.personal?.phone && (
                <a
                  href={`tel:${vvip.personal.phone}`}
                  className="mt-4 inline-block w-full text-center bg-pink-500 text-white py-2 rounded hover:bg-pink-300 transition"
                >
                  Call Now {vvip.personal.phone}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VVIPList;
