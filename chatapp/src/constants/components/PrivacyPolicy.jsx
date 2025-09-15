import {
  FaUserLock,
  FaShieldAlt,
  FaDatabase,
  FaHandshake,
  FaUserSecret,
  FaBan,
  FaClock,
  FaCookieBite,
  FaSyncAlt,
} from "react-icons/fa";
import Footer from "./Footer";


export default function PrivacyPolicy() {
  return (
    <>
    <div className="max-w-5xl mx-auto p-6 space-y-6 text-base-content">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-pink">Privacy Policy</h1>
        <p className="text-gray-600 mt-2">
          Your privacy is extremely important to us. This policy explains how
          Mautamuhub collects, uses, and protects your personal information.
        </p>
      </div>

      {/* No Sharing with Third Parties */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink-700">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaUserLock />
          <span>No Sharing with Third Parties</span>
        </div>
        <p>
          Mautamuhub will never sell, rent, or disclose personal information to
          advertisers or marketers. Data is only shared when required by law or
          to maintain platform security.
        </p>
      </div>

      {/* Data Security */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink-700">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaShieldAlt />
          <span>Data Protection and Security</span>
        </div>
        <p>
          Passwords are encrypted and sensitive information is stored securely.
          While we take industry-standard precautions, no system is completely
          immune to threats.
        </p>
      </div>

      {/* What We Collect */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink-700">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaDatabase />
          <span>What We Collect</span>
        </div>
        <p>
          We collect basic profile details (name, email, phone number) and any
          content uploaded (such as images). Payment details are processed by
          third-party gateways and never stored directly on our servers.
        </p>
      </div>

      {/* Cookies & Tracking */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink-700">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaCookieBite />
          <span>Cookies & Tracking</span>
        </div>
        <p>
          We use cookies and analytics tools to enhance user experience, monitor
          performance, and improve security. You may disable cookies in your
          browser, though some features may not work properly.
        </p>
      </div>

      {/* Data Retention */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink-700">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaClock />
          <span>Data Retention</span>
        </div>
        <p>
          We retain personal data only as long as necessary to deliver services
          and comply with legal obligations. Users can request deletion of their
          data at any time.
        </p>
      </div>

      {/* User Rights */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink-700">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaUserLock />
          <span>Your Rights</span>
        </div>
        <p>
          You may request access, correction, or deletion of your personal
          information. We will respond to such requests in compliance with
          applicable privacy laws.
        </p>
      </div>

      {/* Consent-Based Sharing */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink-700">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaHandshake />
          <span>Consent-Based Sharing</span>
        </div>
        <p>
          If your information must be shared for legal or safety purposes (such
          as a law enforcement request), you will be notified unless prohibited
          by law.
        </p>
      </div>

      {/* Escort Anonymity */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink-700">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaUserSecret />
          <span>Escort Anonymity</span>
        </div>
        <p>
          Escorts can control what personal information is visible on their
          profile. Mautamuhub will never reveal legal names or IDs without
          explicit consent.
        </p>
      </div>

      {/* Prohibited Use of Data */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink-700">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaBan />
          <span>Prohibited Use of Data</span>
        </div>
        <p>
          Scraping, harvesting, or misusing platform data is strictly forbidden.
          Offenders will be banned permanently and may face legal action.
        </p>
      </div>

      {/* Policy Updates */}
      <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink-700">
        <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
          <FaSyncAlt />
          <span>Policy Updates</span>
        </div>
        <p>
          This policy may be revised periodically. Continued use of the platform
          after updates indicates your acceptance of the changes.
        </p>
      </div>

      {/* Final Notice */}
      <div className="p-6 bg-pink-300 tex text-center rounded-lg shadow-md shadow-pink-700">
        <p className="text-lg font-semibold text-pink-500">
          Mautamuhub is committed to protecting your privacy and securing your
          data.
        </p>
        <p className="text-sm mt-2">
          By using this platform, you agree to this Privacy Policy and any
          future updates that may be made.
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
}
