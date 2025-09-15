import {
  FaLock,
  FaMoneyCheckAlt,
  FaSyncAlt,
  FaClock,
  FaMobileAlt,
  FaRegClock,
} from "react-icons/fa";
import Footer from "./Footer";

export default function PaymentMethods() {
  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-6 text-base-content">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink-600">
            Payment Methods & Subscriptions
          </h1>
          <p className="text-gray-600 mt-2">
            We currently support <strong>Mpesa STK Push only</strong>. Other
            payment methods may be added in the future to give you more
            flexibility.
          </p>
        </div>

        {/* Payment Security */}
        <div className="card bg-pink-50-100 shadow-md p-6 border-l-4 border-pink-500">
          <div className="flex items-center gap-3 text-pink text-2xl font-semibold mb-2">
            <FaLock className="text-pink-600" />
            <span className="text-pink-600">Secure Transactions</span>
          </div>
          <p>
            All transactions through Mpesa STK Push are secure and verified.
            Your details are never stored on our servers, ensuring safety and
            peace of mind.
          </p>
        </div>

        {/* Supported Payment Methods */}
        <div className="card bg-pink-50-100 shadow-md p-6 border-l-4 border-pink-500">
          <div className="flex items-center gap-3 text-pink text-2xl font-semibold mb-2">
            <FaMobileAlt className="text-pink-600" />
            <span className="text-pink-600">Currently Supported Method</span>
          </div>
          <p>
            At the moment, we only accept{" "}
            <strong>Mpesa STK Push payments</strong>. When you initiate a
            payment, a prompt will appear on your registered Mpesa number for
            confirmation.
          </p>
          <p className="mt-2 text-sm text-gray-700">
            <em>
              In the future, we may include other payment options like cards
              (Visa/MasterCard) or additional mobile money services.
            </em>
          </p>
        </div>

        {/* Subscription Model */}
        <div className="card bg-pink-50-100 shadow-md p-6 border-l-4 border-pink-500">
          <div className="flex items-center gap-3 text-pink text-2xl font-semibold mb-2">
            <FaClock className="text-pink-600" />
            <span className="text-pink-600">Flexible Subscription Plans</span>
          </div>
          <p>
            Choose from our affordable subscription options:
            <ul className="list-disc list-inside mt-2">
              <li>3 Days Access</li>
              <li>1 Week Access</li>
              <li>2 Weeks Access</li>
              <li>1 Month Access</li>
            </ul>
            Each plan unlocks full features and premium visibility.
          </p>
        </div>

        {/* Auto-Renewal Policy */}
        <div className="card bg-pink-50-100 shadow-md p-6 border-l-4 border-pink-500">
          <div className="flex items-center gap-3 text-pink text-2xl font-semibold mb-2">
            <FaSyncAlt  className="text-pink-600"/>
            <span className="text-pink-600">Auto-Renewal</span>
          </div>
          <p>
            Subscriptions are set to renew automatically to prevent
            interruptions. You may cancel auto-renewal anytime through your
            account settings.
          </p>
        </div>

        {/* Easy Process */}
        <div className="card bg-pink-50-100 shadow-md p-6 border-l-4 border-pink-500">
          <div className="flex items-center gap-3 text-pink text-2xl font-semibold mb-2">
            <FaMoneyCheckAlt className="text-pink-600" />
            <span className="text-pink-600">Simple Checkout</span>
          </div>
          <p>
            Payments via Mpesa STK Push are fast and straightforward. Once
            confirmed, your subscription activates instantly—no delays.
          </p>
        </div>

        {/* Summary */}
        <div className="p-6 bg-pink-300 text-white text-center rounded-lg shadow-md">
          <p className="text-lg font-semibold underline text-pink-700">
            For now, Mautamuhub accepts only Mpesa STK Push payments.
          </p>
          <p className="text-sm mt-2">
            Stay tuned—more payment options will be introduced soon to enhance
            flexibility and convenience.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
