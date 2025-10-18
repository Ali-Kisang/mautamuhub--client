import { FaXTwitter, FaTiktok } from "react-icons/fa6";
import { FaTelegram, FaFacebookF } from "react-icons/fa";
import qr from "../../assets/mautamu-telegram-qr.jpeg";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-gray-700 py-10 px-6 mt-10 relative">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-pink-300 to-transparent"></div>

      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3 text-center md:text-left relative">
        
        {/* Links Section */}
        <nav className="flex flex-col gap-2 text-sm font-medium">
          <a href="/terms-and-conditions" className="hover:text-pink-600 transition">
            Terms and Conditions
          </a>
          <a href="/privacy-policy"  className="hover:text-pink-600 transition">
            Privacy Policy
          </a>
          <a href="/refund-policy" className="hover:text-pink-600 transition">
            Refund Policy
          </a>
          <a href="/payment-methods" className="hover:text-pink-600 transition">
            Payment Methods
          </a>
        </nav>

        {/* Socials + QR */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4 text-xl">
            <a
              href="https://x.com/mautamuhub"
              aria-label="X (Twitter)"
              className="p-2 rounded-full bg-white shadow hover:bg-pink-100 transition"
            >
              <FaXTwitter className="text-black" />
            </a>
            <a
              href="https://t.me/mautamuhub_kenya"
              aria-label="Telegram"
              className="p-2 rounded-full bg-white shadow hover:bg-pink-100 transition"
            >
              <FaTelegram className="text-[#0088cc]" />
            </a>
            <a
              href="https://www.facebook.com/groups/1236627844509614"
              aria-label="Facebook"
              className="p-2 rounded-full bg-white shadow hover:bg-pink-100 transition"
            >
              <FaFacebookF className="text-[#1877f2]" />
            </a>
            <a
              href="https://www.tiktok.com/@mautamuhub.com"
              aria-label="TikTok"
              className="p-2 rounded-full bg-white shadow hover:bg-pink-100 transition"
            >
              <FaTiktok className="text-black" />
            </a>
          </div>

          <img
            src={qr}
            alt="Telegram QR Code"
            className="w-48 h-48 md:w-56 md:h-56 object-contain rounded-lg shadow"
          />
          <p className="mt-2 text-sm font-semibold text-gray-800">
            Scan to join our Telegram Channel
          </p>
        </div>

        {/* Copyright */}
        <aside className="flex items-center justify-center md:justify-end">
          <p className="text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="text-pink-600 font-semibold">Mautamuhub</span> — All rights reserved
          </p>
        </aside>
      </div>
    </footer>
  );
}