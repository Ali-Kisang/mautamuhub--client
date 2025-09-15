import {
  FaMoneyBillAlt,
  FaExclamationTriangle,
  FaUndoAlt,
  FaUserCheck,
  FaShieldAlt,
  FaGavel,
} from "react-icons/fa";
import Footer from "./Footer";

export default function RefundPolicy() {
  return (
    <>
      <div className="max-w-5xl mx-auto p-6 space-y-6 text-base-content">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink">Refund Policy</h1>
          <p className="text-gray-600 mt-2">
            Please review this refund policy carefully before making any
            payments on Mautamuhub. By completing a transaction, you agree to
            the following conditions.
          </p>
        </div>

        {/* No Refunds */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaMoneyBillAlt />
            <span>No Refunds</span>
          </div>
          <p>
            Once a payment is processed,{" "}
            <strong className="text-pink-700">all sales are final and non-refundable</strong>. This
            applies whether payment was made intentionally, mistakenly, or under
            any other circumstance.
          </p>
        </div>

        {/* User Responsibility */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaUserCheck />
            <span>User Responsibility</span>
          </div>
          <p>
            It is your responsibility to review all service details before
            completing registration or payment. Mautamuhub does not provide free
            trials, demo accounts, or partial refunds.
          </p>
        </div>

        {/* Mistaken Payments */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaUndoAlt />
            <span className="text-pink-700">No Refund for Mistaken Payments</span>
          </div>
          <p>
            Payments made in error, including duplicate transactions or use of
            the wrong account, cannot be reversed or refunded. Please verify all
            details before confirming your payment.
          </p>
        </div>

        {/* Service Satisfaction */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaShieldAlt />
            <span className="text-pink-700">Service Satisfaction</span>
          </div>
          <p>
            Mautamuhub only provides a listing and communication platform. We
            are <strong className="text-pink-700">NOT RESPONSIBLE</strong> for service quality, personal
            experiences, or dissatisfaction with individual escorts. Refunds
            cannot be issued based on expectations not being met.
          </p>
        </div>

        {/* Fraud & Abuse */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaGavel />
            <span>Fraud or Abuse</span>
          </div>
          <p>
            Attempting chargebacks, payment disputes, or fraudulent claims may
            result in account suspension and reporting to relevant authorities.
          </p>
        </div>

        {/* Final Disclaimer */}
        <div className="card bg-pink-100 shadow-md p-6 border-l-4 border-pink">
          <div className="flex items-center gap-3 text-pink-700 text-2xl font-semibold mb-2">
            <FaExclamationTriangle />
            <span>Final Disclaimer</span>
          </div>
          <p>
            Mautamuhub holds no financial liability for transactions between
            users and service providers. By making a payment, you acknowledge
            and accept this policy without exceptions.
          </p>
        </div>

        {/* Summary Block */}
        <div className="p-6 bg-pink-300  text-white text-center rounded-lg shadow-md">
          <p className="text-lg font-semibold">
            All purchases on Mautamuhub are{" "}
            <span className="underline text-pink-700">FINAL AND NON-REFUNDABLE</span>.
          </p>
          <p className="text-sm mt-2">
            By proceeding, you accept this refund policy in full and waive the
            right to dispute payments after they have been processed.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
