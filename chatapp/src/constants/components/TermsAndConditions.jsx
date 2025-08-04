import {
  FaExclamationTriangle,
  FaUserShield,
  FaCommentDots,
  FaMoneyBillWave,
  FaGavel,
  FaUserSecret,
} from "react-icons/fa";
import Footer from "./Footer";
export default function TermsAndConditions() {
  return (
    <>
      <div className="max-w-5xl mx-auto p-6 space-y-6 text-base-content">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink">Terms & Conditions</h1>
          <p className="text-gray-600 mt-2">
            Please review the following terms carefully. By using Mautamuhub,
            you agree to abide by them fully.
          </p>
        </div>

        {/* Age Restriction */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaExclamationTriangle />
            <span>Strictly 18+ Only</span>
          </div>
          <p>
            This platform is strictly for users aged 18 and above. Accessing or
            using Mautamuhub as a minor is illegal and prohibited. Violators
            will be permanently banned and may be reported to authorities.
          </p>
        </div>

        {/* Account Responsibility */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaUserShield />
            <span>Account Responsibility</span>
          </div>
          <p>
            You are solely responsible for activities under your account. Do not
            share your credentials. Misuse, misrepresentation, or fraud may
            result in suspension or legal action.
          </p>
        </div>

        {/* Escort Interactions */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaCommentDots />
            <span>Chatting with Escorts</span>
          </div>
          <p>
            Escorts are independent individuals. Respectful communication is
            mandatory. Inappropriate, abusive, or manipulative behavior will not
            be tolerated and may result in permanent removal.
          </p>
        </div>

        {/* No Financial Liability */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaMoneyBillWave />
            <span>Financial Disclaimer</span>
          </div>
          <p>
            Mautamuhub does not mediate or guarantee payments made to escorts.
            Any transaction you make is at your own risk. We will not be
            responsible for refunds, scams, or loss of funds in any capacity.
          </p>
        </div>

        {/* Violent or Abusive Conduct */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaGavel />
            <span>Violent or Threatening Behavior</span>
          </div>
          <p>
            Any kind of violence, threats, or abusive conduct either online or
            in-person is strictly prohibited. Such actions will lead to an
            immediate and permanent ban and may result in legal action.
          </p>
        </div>

        {/* Impersonation */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaUserSecret />
            <span>Impersonation Warning</span>
          </div>
          <p>
            Pretending to be an escort or another user is a serious offense.
            This includes the use of fake photos or false profiles. Offenders
            will be permanently removed and may face legal consequences.
          </p>
        </div>

        {/* General Liability Notice */}
        <div className="p-6 bg-pink text-white text-center rounded-lg shadow-md">
          <p className="text-lg font-semibold">
            Disclaimer: Mautamuhub is a listing and communication platform. We
            are not liable for user behavior, loss of money, failed meetups,
            impersonations, or disputes between parties.
          </p>
          <p className="text-sm mt-2">
            By continuing to use this website, you accept full responsibility
            for your choices and interactions.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
