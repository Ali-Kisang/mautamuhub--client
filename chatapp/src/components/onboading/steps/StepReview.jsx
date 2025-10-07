import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const CLOUD_NAME = "dcxggvejn"; 

const optimizeImage = (publicId) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_300,h_300,c_fill/${publicId}`;

export function StepReview({ formData }) {
  const { personal, location, additional, services, accountType, photos = [] } = formData;

  const photoPreviews = useMemo(() => {
    return photos
      .map((item) => {
        let url = null;
        let isFile = false;
        let file = null;

        if (item instanceof File || item instanceof Blob) {
          try {
            url = URL.createObjectURL(item);
            isFile = true;
            file = item;
          } catch (err) {
            console.warn("Failed to create object URL for file:", err);
          }
        } else if (typeof item === "string") {
          url = optimizeImage(item);
          isFile = false;
        }

        return url ? { url, isFile, file } : null;
      })
      .filter(Boolean);
  }, [photos]);

  useEffect(() => {
    return () => {
      photoPreviews.forEach((p) => {
        if (p.isFile && p.file instanceof File) {
          URL.revokeObjectURL(p.url);
        }
      });
    };
  }, [photoPreviews]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-pink-600 mb-2">Review & Submit</h2>
      <p className="text-gray-600">Please review your details below before submitting.</p>

      {/* Personal Information */}
      <ReviewSection title="Personal Information">
        <ReviewItem label="Username" value={personal?.username} />
        <ReviewItem label="Phone" value={personal?.phone} />
        <ReviewItem label="Gender" value={personal?.gender} />
        <ReviewItem label="Age" value={personal?.age} />
        <ReviewItem label="Complexity" value={personal?.complexity} />
        <ReviewItem label="Ethnicity" value={personal?.ethnicity} />
      </ReviewSection>

      {/* Location */}
      <ReviewSection title="Location">
        {location?.county || location?.city || location?.roadStreet ? (
          <div className="grid md:grid-cols-2 gap-x-4">
            <ReviewItem label="County" value={location?.county} />
            <ReviewItem label="Constituency" value={location?.constituency} />
            <ReviewItem label="Ward" value={location?.ward} />
            <ReviewItem label="Local Area" value={location?.localArea} />
            <ReviewItem label="Street" value={location?.roadStreet} />
          </div>
        ) : (
          <p className="text-gray-500">No location selected.</p>
        )}
      </ReviewSection>

      {/* Additional Info */}
      <ReviewSection title="Additional Info">
        {Object.keys(additional || {}).length > 0 ? (
          Object.entries(additional).map(([key, value]) => (
            <ReviewItem key={key} label={key} value={value} />
          ))
        ) : (
          <p className="text-gray-500">No additional info provided.</p>
        )}
      </ReviewSection>

      {/* Services */}
      <ReviewSection title="Services">
        {Array.isArray(services?.selected) && services.selected.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {services.selected.map((s, i) => (
              <span
                key={i}
                className="inline-block bg-pink-100 text-pink-700 text-sm font-medium px-3 py-1 rounded-full border border-pink-300 shadow-sm hover:bg-pink-200 transition"
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No services selected.</p>
        )}
        {services?.custom && (
          <div className="mt-2">
            <span className="inline-block bg-pink-100 text-pink-700 text-sm font-medium px-3 py-1 rounded-full border border-pink-300 shadow-sm">
              {services.custom}
            </span>
          </div>
        )}
      </ReviewSection>

      {/* Account Type */}
      <ReviewSection title="Account Type">
        <ReviewItem label="Type" value={accountType?.type} />
        <ReviewItem label="Amount" value={accountType?.amount} />
        <ReviewItem
          label="Duration"
          value={accountType?.duration ? `${accountType.duration} days` : ""}
        />
      </ReviewSection>

      {/* Uploaded Photos */}
      <ReviewSection title="Uploaded Photos">
        {photoPreviews.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photoPreviews.map(({ url, isFile }, i) => (
              <div key={i} className="relative">
                <img
                  src={url}
                  loading="lazy"
                  alt={`Preview ${i + 1}`}
                  className="rounded-lg object-cover w-full h-32 border border-pink-200 shadow-sm"
                  onError={(e) => {
                    if (isFile) {
                      // Fallback for local file preview error
                      e.target.style.display = 'none';
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = 'flex items-center justify-center h-32 bg-gray-100 text-gray-500 text-sm';
                      fallbackDiv.textContent = `Preview ${i + 1}`;
                      e.target.parentNode.appendChild(fallbackDiv);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No photos uploaded.</p>
        )}
      </ReviewSection>

      <p className="text-gray-500">
        Click <span className="text-pink-600 font-medium">Submit</span> to complete onboarding.
      </p>
    </motion.div>
  );
}

const ReviewSection = ({ title, children }) => (
  <motion.div
    className="bg-pink-50 border border-pink-200 rounded-xl p-4 space-y-2 shadow-sm"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h3 className="text-lg font-semibold text-pink-600">{title}</h3>
    {children}
  </motion.div>
);

const ReviewItem = ({ label, value }) => (
  <p>
    <span className="font-medium capitalize">{label}:</span> {value || "—"}
  </p>
);