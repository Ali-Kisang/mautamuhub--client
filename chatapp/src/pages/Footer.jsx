import { FaXTwitter } from "react-icons/fa6";
import { FaTelegram, FaFacebookF, FaTiktok } from "react-icons/fa";

import qr from "../assets/mautamu-telegram-qr.jpeg"
export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content py-10 px-6 md:px-16">
      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-6 mb-8 text-sm md:text-base font-medium">
        {[
          { label: "Terms and Conditions", href: "/terms-and-conditions" },
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Refund Policy", href: "/refund-policy" },
          { label: "Payment Methods", href: "/payment-methods" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:text-pink-500 transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Social Icons + QR Code Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
        {/* Social Icons */}
        <div className="flex gap-5 text-xl">
          <a
            href="https://x.com/mautamuhub"
            aria-label="X (Twitter)"
            className="text-black hover:text-pink-500 transition-colors duration-200 p-2 rounded-full"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://t.me/mautamuhub_kenya"
            aria-label="Telegram"
            className="text-[#0088cc] hover:text-pink-500 transition-colors duration-200 p-2 rounded-full"
          >
            <FaTelegram />
          </a>
          <a
            href="https://www.facebook.com/groups/1236627844509614"
            aria-label="Facebook"
            className="text-[#1877f2] hover:text-pink-500 transition-colors duration-200 p-2 rounded-full"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.tiktok.com/@mautamuhub.com"
            aria-label="TikTok"
            className="hover:text-pink-500 transition-colors duration-200 p-2 rounded-full"
          >
            <FaTiktok />
          </a>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center">
          <img
            src={qr}
            alt="Telegram QR Code"
            className="w-64 h-64 object-contain rounded-lg shadow-md"
          />
          <p className="text-sm font-semibold text-center mt-2">
            SCAN TO JOIN OUR TELEGRAM CHANNEL
          </p>
        </div>
      </div>

      {/* Footer Text */}
      <div className="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} - All rights reserved by
        <span className="text-pink-500 font-semibold"> Mautamuhub</span>
      </div>
    </footer>
  );
}