/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useMemo, useEffect, useState } from "react";
import { showToast } from "../../utils/showToast";
export const validatePhotos = (photos, accountType) => {
  const errors = {};
  const limit = (() => {
    switch (accountType?.type) {
      case "Spa": return 10;
      case "VVIP": return 8;
      case "VIP": return 6;
      case "Regular": return 4;
      default: return 0;
    }
  })();

  if (!photos || photos.length === 0) {
    errors.photos = "At least one photo is required.";
  } else if (photos.length > limit) {
    errors.photos = `You can only upload up to ${limit} photos.`;
  }

  return errors;
};

const StepPhotos = ({ data, updateData, accountType }) => {
  const [isDragging, setIsDragging] = useState(false);

  // ✅ determine photo limit
  const photoLimit = (() => {
    switch (accountType?.type) {
      case "Spa": return 10;
      case "VVIP": return 8;
      case "VIP": return 6;
      case "Regular": return 4;
      default: return 0;
    }
  })();

  const galleryPhotos = data;
  const progress = photoLimit > 0 ? (galleryPhotos.length / photoLimit) * 100 : 0;

  // ✅ create previews
 const galleryPreviews = useMemo(() => {
  return galleryPhotos
    .filter(file => file instanceof File) // filter out invalid blobs
    .map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
}, [galleryPhotos]);




  useEffect(() => {
  return () => {
    galleryPreviews.forEach((p) => {
      if (p.file instanceof File) {
        URL.revokeObjectURL(p.url);
      }
    });
  };
}, [galleryPreviews]);



  // ✅ handle files
  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (galleryPhotos.length + imageFiles.length > photoLimit) {
      showToast(`You can only upload up to ${photoLimit} photos.`, true);
      return;
    }
    updateData([...galleryPhotos, ...imageFiles]);
    showToast("Photos uploaded successfully!");
  };

  const handleFileUpload = (event) => {
    handleFiles(event.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePhoto = (index) => {
    const updatedPhotos = galleryPhotos.filter((_, i) => i !== index);
    updateData(updatedPhotos);
    showToast("Photo removed successfully.");
  };

  return (
    <div>
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

      <h2 className="text-lg font-bold mb-4 text-pink-600">Uploaded Photos</h2>
      <p className="text-sm text-gray-600 mb-4">
        Max gallery photos allowed: {photoLimit}
      </p>

      {/* Gallery Previews */}
      {galleryPhotos.length === 0 ? (
        <p className="text-sm text-gray-500">No photos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryPreviews.map(({ url }, i) => (
            <div
              key={i}
              className="card bg-base-100 shadow-md border rounded-md overflow-hidden relative"
            >
              <figure className="bg-gray-100 h-40 flex items-center justify-center">
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="object-cover h-full w-full"
                />
              </figure>
              <div className="card-body p-2 flex justify-center">
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => removePhoto(i)}
                >
                  Remove
                </button>
              </div>
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
    </div>
  );
};

export default StepPhotos;
