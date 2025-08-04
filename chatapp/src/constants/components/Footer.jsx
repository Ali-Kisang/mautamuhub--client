import { FaXTwitter } from "react-icons/fa6";
import { FaTelegram, FaFacebookF } from "react-icons/fa";
import qr from "../../assets/mautamu-telegram-qr.jpeg";

export default function Component() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
      <nav className="grid grid-flow-col gap-4">
        <a href="/terms-and-conditions" className="link link-hover">
          Terms and Conditions
        </a>
        <a href="/privacy-policy" className="link link-hover">
          Privacy Policy
        </a>
        <a href="/refund-policy" className="link link-hover">
          Refund Policy
        </a>
        <a href="/payment-methods" className="link link-hover">
          Payment Methods
        </a>
      </nav>

      <nav className="flex flex-col items-center gap-4">
        <div className="grid grid-flow-col gap-4 text-xl">
          <a
            href="https://x.com/mautamuhub"
            aria-label="X (Twitter)"
            className="text-black hover:bg-pink rounded-full p-2 transition"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://t.me/mautamuhub_kenya"
            aria-label="Telegram"
            className="text-[#0088cc] hover:bg-pink rounded-full p-2 transition"
          >
            <FaTelegram />
          </a>
          <a
            href="https://www.facebook.com/groups/1236627844509614"
            aria-label="Facebook"
            className="text-[#1877f2] hover:bg-pink rounded-full p-2 transition"
          >
            <FaFacebookF />
          </a>
        </div>

        <img
  src={qr}
  alt="Telegram QR Code"
  className="w-80 h-80 object-contain rounded "
/>
<p className="mt-2 font-medium text-base">SCAN TO JOIN OUR TELEGRAM CHANNEL</p>

      </nav>

      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All rights reserved by
          <span className="text-pink"> Mautamuhub</span>
        </p>
      </aside>
    </footer>
  );
}
