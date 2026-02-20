import { Link } from "react-router-dom";
import logo from "../../assets/Logo-white 2.png";

// You can replace these with real SVG icons or react-icons
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-green-dark text-white-intense">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 xl:px-24 2xl:px-40 py-6 flex flex-col lg:flex-row items-center justify-between gap-4">

        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="GreenCycle" className="w-[150px] h-auto" />
        </div>

        {/* Center: Policy + Email */}
        <div className="flex flex-col font-nexa lg:flex-row items-center gap-2 lg:gap-10 text-sm lg:text-base opacity-90">
          <Link to="/privacy" className="hover:opacity-100 transition">
            Privacy & Policy
          </Link>

          <span>Email : info@gmail.com</span>
        </div>

        {/* Right: Social icons */}
        <div className="flex items-center gap-3">
          <a href="facebook.com" className="w-9 h-9 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-green-dark transition">
            <FaFacebookF size={16} />
          </a>

          <a href="intagram.com" className="w-9 h-9 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-green-dark transition">
            <FaInstagram size={16} />
          </a>

          <a href="twitter.com" className="w-9 h-9 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-green-dark transition">
            <FaXTwitter size={16} />
          </a>

          <a href="linkedin.com" className="w-9 h-9 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-green-dark transition">
            <FaLinkedinIn size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
