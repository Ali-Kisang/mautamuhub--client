import {
  FaLock,
  FaMoneyCheckAlt,
  FaSyncAlt,
  FaClock,
  FaMobileAlt,
} from "react-icons/fa";
import Footer from "./Footer";
export default function PaymentMethods() {
  return (
    <>
      <div className=" mx-auto p-6 space-y-6 text-base-content">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink">
            Payment Methods & Subscriptions
          </h1>
          <p className="text-gray-600 mt-2">
            Simple, secure, and flexible payment options tailored for your
            experience on Mautamuhub.
          </p>
        </div>

        {/* Payment Security */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink text-2xl font-semibold mb-2">
            <FaLock />
            <span>Secure Payments</span>
          </div>
          <p>
            All transactions are protected using industry-standard encryption
            and security protocols. Your card details and mobile payment data
            are never stored on our servers.
          </p>
        </div>

        {/* Supported Payment Methods */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink text-2xl font-semibold mb-2">
            <FaMobileAlt />
            <span>Available Payment Options</span>
          </div>
          <p>
            We support <strong>Mpesa</strong>, <strong>Visa</strong>,{" "}
            <strong>MasterCard</strong>, and other major card processors. You
            can choose what works best for you—whether it’s mobile money or card
            payments.
          </p>
        </div>

        {/* Subscription Model */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink text-2xl font-semibold mb-2">
            <FaClock />
            <span>Flexible Subscription Options</span>
          </div>
          <p>
            We offer affordable and flexible subscription plans to suit your
            needs:
            <ul className="list-disc list-inside mt-2">
              <li>3 Days</li>
              <li>1 Week</li>
              <li>2 Weeks</li>
              <li>1 Month</li>
            </ul>
            Access full features and premium services based on your chosen plan.
          </p>
        </div>

        {/* Auto-Renewal Policy */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink text-2xl font-semibold mb-2">
            <FaSyncAlt />
            <span>Auto-Renewal & Cancellation</span>
          </div>
          <p>
            Subscriptions are set to <strong>auto-renew</strong> by default to
            avoid service interruptions. You will be charged automatically at
            the end of each billing cycle. You may cancel at any time from your
            account settings to stop the next renewal.
          </p>
        </div>

        {/* Easy Process */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink text-2xl font-semibold mb-2">
            <FaMoneyCheckAlt />
            <span>Simple & Convenient</span>
          </div>
          <p>
            Our checkout process is easy to navigate, and subscription
            activation is instant. Enjoy uninterrupted service with a few taps.
          </p>
        </div>

        {/* Summary */}
        <div className="p-6 bg-pink text-white text-center rounded-lg shadow-md">
          <p className="text-lg font-semibold">
            Mautamuhub gives you full control—pay securely, choose your plan,
            and manage renewals anytime.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
