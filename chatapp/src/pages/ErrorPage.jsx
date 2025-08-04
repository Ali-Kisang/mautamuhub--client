import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center px-4">
      <h1 className="text-6xl md:text-8xl font-bold text-pink-500 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
        Oops! Page Not Found
      </h2>
      <p className="text-base md:text-lg text-gray-500 mb-6 max-w-md">
        The page you're looking for doesn't exist or has been moved. But don't worry, we've got you.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full text-sm md:text-base hover:bg-pink-600 transition"
      >
        <FaArrowLeft /> Back to Home
      </Link>
    </div>
  );
}
