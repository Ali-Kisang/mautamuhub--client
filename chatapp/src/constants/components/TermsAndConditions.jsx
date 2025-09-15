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
  <div className="max-w-5xl mx-auto px-6 py-12 space-y-10 text-gray-800">
    {/* Header */}
    <div className="text-center space-y-3">
      <h1 className="text-4xl md:text-5xl font-extrabold text-pink-600">
        Terms & Conditions
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Welcome to <span className="font-semibold text-pink-500">Mautamuhub</span>. These Terms & Conditions outline the rules and responsibilities you must follow while using our platform. Please read them carefully.
      </p>
    </div>

    {/* Terms Grid */}
    <div className="space-y-6">
      {/* Age Restriction */}
      <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 text-pink-600 text-xl font-semibold mb-2">
          <FaExclamationTriangle />
          <span>Strictly 18+ Only</span>
        </div>
        <p>
          This platform is strictly for users aged 18 and above. Accessing or using Mautamuhub as a minor is illegal and prohibited. Violators will be banned and may be reported to authorities.
        </p>
      </div>

      {/* Account Responsibility */}
      <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-centergap-3 text-pink-600 text-xl font-semibold mb-2">
          <FaUserShield />
          <span>Account Responsibility</span>
        </div>
        <p>
          You are solely responsible for all activities under your account. Do not share your credentials. Misuse, misrepresentation, or fraud may result in suspension or legal action.
        </p>
      </div>

      {/* Escort Interactions */}
      <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 text-pink-600 text-xl font-semibold mb-2">
          <FaCommentDots />
          <span>Chatting with Escorts</span>
        </div>
        <p>
          Escorts are independent individuals. Respectful communication is mandatory. Inappropriate, abusive, or manipulative behavior will not be tolerated and may result in permanent removal.
        </p>
      </div>

      {/* Financial Disclaimer */}
      <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 text-pink-600 text-xl font-semibold mb-2">
          <FaMoneyBillWave />
          <span>Financial Disclaimer</span>
        </div>
        <p>
          Mautamuhub does not mediate or guarantee payments made to escorts. Any transaction you make is at your own risk. We will not be responsible for refunds, scams, or loss of funds in any capacity.
        </p>
      </div>

      {/* Violent or Threatening Behavior */}
      <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 text-pink-600 text-xl font-semibold mb-2">
          <FaGavel />
          <span>Violent & Threatening Behavior</span>
        </div>
        <p>
          Any kind of violence, threats, or abusive conduct either online or in person is strictly prohibited. Such actions will lead to an immediate and permanent ban and may result in legal action.
        </p>
      </div>

      {/* Impersonation Warning */}
      <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 text-pink-600 text-xl font-semibold mb-2">
          <FaUserSecret />
          <span>Impersonation Warning</span>
        </div>
        <p>
          Pretending to be an escort or another user is a serious offense. This includes the use of fake photos or false profiles. Offenders will be permanently removed and may face legal consequences.
        </p>
      </div>

      {/* Intellectual Property & Content Ownership */}
      <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 text-pink-600 text-xl font-semibold mb-2">
          {/* You can pick an icon here, e.g. FaUserSecret or another suitable one */}
          <FaUserSecret />
          <span>Intellectual Property & Content Ownership</span>
        </div>
        <p>
          All profiles, images, text, and other content posted on Mautamuhub remain the property of their respective owners. By posting content, you grant us the license to use, display, and distribute that content on the platform. Do not post content you do not own or have permission to share.
        </p>
      </div>

      {/* Prohibited Content & Activities */}
      <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 text-pink-600 text-xl font-semibold mb-2">
          {/* Another icon, e.g. FaExclamationTriangle */}
          <FaExclamationTriangle />
          <span>Prohibited Content & Activities</span>
        </div>
        <p>
          You may not engage in or post content that is illegal, harassing, defamatory, obscene, discriminative, or promotes hate speech. Solicitation of illegal services, trafficking, or non-consensual acts are strictly forbidden. Violation leads to removal of content or account, and may be reported to authorities.
        </p>
      </div>

      {/* Moderation, Reporting & Enforcement */}
      <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 text-pink-600 text-xl font-semibold mb-2">
          {/* Choose an icon, maybe FaGavel or similar */}
          <FaGavel />
          <span>Moderation, Reporting & Enforcement</span>
        </div>
        <p>
          Our team reviews content and user behavior regularly. You can report any profiles, messages, or content that violates these Terms. We reserve the right to suspend or terminate accounts for violations, as well as remove offending content without notice.
        </p>
      </div>

      {/* Changes to Terms & Updates */}
      <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 text-pink-600 text-xl font-semibold mb-2">
          {/* Icon, e.g. FaExclamationTriangle */}
          <FaExclamationTriangle />
          <span>Changes to Terms & Updates</span>
        </div>
        <p>
          We may update or modify these Terms & Conditions at any time. When we do, we will publish the updated version on this site with a “Last Updated” date. Continued use of the platform after changes indicates your acceptance of the new terms.
        </p>
      </div>
    </div>

    {/* Disclaimer Box */}
    <div className="bg-gradient-to-r from-pink-600 to-pink-400 text-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold mb-2">Important Disclaimer</h2>
      <p className="max-w-3xl mx-auto">
        Mautamuhub is a listing and communication platform. We are not responsible for user behavior, loss of money, failed meetups, impersonations, or disputes between parties.
      </p>
      <p className="mt-3 text-sm">
        By continuing to use this website, you accept full responsibility for your actions, choices, and interactions.
      </p>
    </div>

    {/* Final Agreement Section */}
    <div className="text-center mt-10 space-y-2">
      <h3 className="text-2xl font-bold text-pink-600 mb-3">
        Your Agreement
      </h3>
      <p className="text-gray-600 max-w-2xl mx-auto">
        By accessing or using Mautamuhub, you confirm that you have read, understood, and agreed to these Terms & Conditions in full.
      </p>
      <p className="text-sm text-gray-500">
        If you have any questions or concerns, please contact our support at <a href="/contact-us" className="text-pink-600 underline">support@mautamuhub.com</a>.
      </p>
    </div>
  </div>

  <Footer />
</>

  );
}
