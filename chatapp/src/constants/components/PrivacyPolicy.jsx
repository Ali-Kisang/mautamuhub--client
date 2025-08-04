import {
  FaUserLock,
  FaShieldAlt,
  FaDatabase,
  FaHandshake,
  FaUserSecret,
  FaBan,
} from "react-icons/fa";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 text-base-content">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-pink">Privacy Policy</h1>
        <p className="text-gray-600 mt-2">
          Your privacy is extremely important to us. This policy outlines how we
          collect, use, and protect your data at Mautamuhub.
        </p>
      </div>

      {/* No Sharing with Third Parties */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaUserLock />
          <span>No Sharing with Third Parties</span>
        </div>
        <p>
          Mautamuhub will never share, sell, rent, or disclose any personal
          information—whether you are a client or an escort—to third parties,
          marketers, or other organizations.
        </p>
      </div>

      {/* Data Security */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaShieldAlt />
          <span>Data Protection and Security</span>
        </div>
        <p>
          We take all reasonable precautions to safeguard your data. Passwords
          are encrypted, and sensitive information is stored securely. However,
          no system is completely foolproof.
        </p>
      </div>

      {/* Information We Collect */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaDatabase />
          <span>What We Collect</span>
        </div>
        <p>
          We collect basic profile information (such as name, email, phone
          number), and any content you provide including uploaded images.
          Payment info is processed through trusted third-party gateways and not
          stored on our servers.
        </p>
      </div>

      {/* Consent-Based Sharing */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaHandshake />
          <span>Consent-Based Sharing</span>
        </div>
        <p>
          If we ever need to share your data for legal or security reasons
          (e.g., under a court order or law enforcement request), you will be
          notified unless legally prohibited.
        </p>
      </div>

      {/* Escort Anonymity */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaUserSecret />
          <span>Escort Anonymity</span>
        </div>
        <p>
          Escorts may choose how much personal info is visible on their profile.
          Mautamuhub will never reveal legal names or identity documents to
          clients or anyone else without express consent.
        </p>
      </div>

      {/* Prohibited Behavior */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaBan />
          <span>Prohibited Use of Data</span>
        </div>
        <p>
          Users are strictly forbidden from scraping, harvesting, or reusing any
          data from this platform. Violators will be banned and reported.
        </p>
      </div>

      {/* Summary Notice */}
      <div className="p-6 bg-pink text-white text-center rounded-lg shadow-md">
        <p className="text-lg font-semibold">
          Mautamuhub respects your privacy and is committed to protecting your
          personal data.
        </p>
        <p className="text-sm mt-2">
          By using our platform, you consent to this privacy policy and
          acknowledge that it may be updated at any time with notice.
        </p>
      </div>
    </div>
  );
}
