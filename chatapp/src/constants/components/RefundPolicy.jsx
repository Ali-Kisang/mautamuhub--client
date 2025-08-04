import {
  FaMoneyBillAlt,
  FaExclamationTriangle,
  FaUndoAlt,
  FaUserCheck,
} from "react-icons/fa";
import Footer from "./Footer";
export default function RefundPolicy() {
  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-6 text-base-content">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink">Refund Policy</h1>
          <p className="text-gray-600 mt-2">
            Please read our refund policy carefully before proceeding with any
            payment on Mautamuhub.
          </p>
        </div>

        {/* No Refunds Under Any Circumstances */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaMoneyBillAlt />
            <span>No Refunds</span>
          </div>
          <p>
            Once an account is created and payment is made,{" "}
            <strong>no refunds will be issued</strong>. This policy applies
            whether you signed up intentionally or by mistake.
          </p>
        </div>

        {/* User Responsibility */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaUserCheck />
            <span>User Responsibility</span>
          </div>
          <p>
            It is your responsibility to review all service terms before
            completing your registration. Mautamuhub does not offer trial
            accounts or test periods.
          </p>
        </div>

        {/* Mistaken Payments */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaUndoAlt />
            <span>No Refund for Mistaken Payments</span>
          </div>
          <p>
            If you make a payment by mistake, we will{" "}
            <strong>not reverse or refund</strong> the transaction. All payments
            are considered final once processed.
          </p>
        </div>

        {/* Final Disclaimer */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaExclamationTriangle />
            <span>Final Disclaimer</span>
          </div>
          <p>
            Mautamuhub is not liable for any dissatisfaction with services
            offered by individual escorts. Refunds cannot be requested on the
            basis of unmet expectations or disagreements with any service
            provider on the platform.
          </p>
        </div>

        {/* Footer Summary */}
        <div className="p-6 bg-pink text-white text-center rounded-lg shadow-md">
          <p className="text-lg font-semibold">
            All purchases on Mautamuhub are final and non-refundable.
          </p>
          <p className="text-sm mt-2">
            By proceeding, you agree to these terms and understand that no
            exceptions will be made.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
