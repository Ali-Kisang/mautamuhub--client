import { useMemo, useEffect, useState } from "react";
import { X } from "lucide-react";
import { showToast } from "../../utils/showToast";
import api from "../../../utils/axiosInstance";

const CLOUD_NAME = "dcxggvejn"; 

const optimizeImage = (publicId) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_300,h_300,c_fill/${publicId}`;

// ✅ Validation function - moved outside and exported
export const validatePhotos = (photos = [], accountType = {}) => {
  const errors = {};

  let photoLimit = 0;
  switch (accountType?.type) {
    case "Spa": photoLimit = 10; break;
    case "VVIP": photoLimit = 8; break;
    case "VIP": photoLimit = 6; break;
    case "Regular": photoLimit = 4; break;
    default: photoLimit = 0;
  }

  // ✅ Check for actual Files or strings (publicIds)
  const validPhotos = photos.filter(photo => photo instanceof File || typeof photo === 'string');
  if (validPhotos.length === 0) {
    errors.photos = "Please upload at least one photo.";
  } else if (validPhotos.length > photoLimit) {
    errors.photos = `You can only upload up to ${photoLimit} photos.`;
  }

  return errors;
};

const StepPhotos = ({ data, updateData, accountType }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);  // ✅ loading state

  // ✅ Compute photo limit
  const getPhotoLimit = (accType) => {
    switch (accType?.type) {
      case "Spa": return 10;
      case "VVIP": return 8;
      case "VIP": return 6;
      case "Regular": return 4;
      default: return 0;
    }
  };

  const photoLimit = getPhotoLimit(accountType);

  const galleryPhotos = data || [];
  const progress = photoLimit > 0 ? (galleryPhotos.length / photoLimit) * 100 : 0;

  const galleryPreviews = useMemo(() => {
    return galleryPhotos
      .map((item, index) => {
        if (item instanceof File) {
          return { url: URL.createObjectURL(item), isFile: true, file: item, index };
        }
        if (typeof item === "string") {
          return { url: optimizeImage(item), isFile: false, index };
        }
        return null;
      })
      .filter(Boolean);
  }, [galleryPhotos]);

  useEffect(() => {
    return () => {
      galleryPreviews.forEach((p) => {
        if (p.isFile && p.file instanceof File) {
          URL.revokeObjectURL(p.url);
        }
      });
    };
  }, [galleryPreviews]);

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      showToast("Please select image files only.", true);
      return;
    }

    const currentValidPhotos = galleryPhotos.filter(photo => photo instanceof File || typeof photo === 'string');
    if (currentValidPhotos.length + imageFiles.length > photoLimit) {
      showToast(`You can only upload up to ${photoLimit} photos.`, true);
      return;
    }

    // ✅ Update with new Files (preserve existing)
    const updatedPhotos = [...currentValidPhotos, ...imageFiles];
    updateData(updatedPhotos);
    showToast(`${imageFiles.length} photo(s) added successfully!`, false);
  };

  const handleFileUpload = (event) => {
    handleFiles(event.target.files);
    event.target.value = '';  // Reset input for re-select
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePhoto = async (index) => {
    const photoToRemove = galleryPhotos[index];

    let updatedPhotos;
    if (typeof photoToRemove === "string") {
      try {
        setLoading(true); 

        await api.delete(`/users/profile/photos/${encodeURIComponent(photoToRemove)}`);
      } catch (error) {
        console.error("Failed to delete photo:", error);
        showToast("Failed to remove photo. Please try again.", true);
        return;
      } finally {
        setLoading(false); 
      }

      // If successful, update
      updatedPhotos = galleryPhotos.filter((_, i) => i !== index);
      updateData(updatedPhotos);
      showToast("Photo removed successfully.");
    } else {
      // Local file removal
      updatedPhotos = galleryPhotos.filter((_, i) => i !== index);
      const preview = galleryPreviews.find(p => p.index === index);
      if (preview?.isFile) {
        URL.revokeObjectURL(preview.url);
      }
      updateData(updatedPhotos);
      showToast("Photo removed successfully.", false);
    }
  };

  return (
    <div>
      {loading && (
        <div
          className="flex flex-col items-center justify-center h-64 gap-2"
          role="status"
          aria-live="polite"
        >
          <l-dot-stream size="60" speed="2.5" color="#ec4899"></l-dot-stream>
          <p className="text-pink-500 font-medium">Loading Photos...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 mb-4 flex flex-col items-center justify-center transition-all duration-300 ${
              isDragging ? "border-pink-600 bg-pink-50" : "border-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
          >
            <p className="text-lg font-semibold text-pink-600 mb-3">
              Drag & drop your images here
            </p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <label className="cursor-pointer">
              <span className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-pink-700 transition-colors">
                📤 Choose Files
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <h2 className="text-lg font-bold mb-4 text-pink-600">Uploaded Photos (Chagua Picha zako, usipitishe kiwango inayotakikana)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Max gallery photos allowed: {photoLimit}
          </p>

          {/* Gallery Previews */}
          {galleryPreviews.length === 0 ? (
            <p className="text-sm text-gray-500">No photos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryPreviews.map(({ url, index }) => (
                <div
                  key={index}
                  className="relative group rounded-md overflow-hidden shadow-md border"
                >
                  <img
                    src={url}
                    alt={`Photo ${index + 1}`}
                    className="object-contain h-40 w-full"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-1 transition opacity-0 group-hover:opacity-100"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress */}
          {photoLimit > 0 && (
            <div className="my-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="md:text-lg text-sm text-pink-600 mt-2">
                {Math.round(progress)}% completed
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StepPhotos;