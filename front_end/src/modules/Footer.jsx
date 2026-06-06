import React from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0B1F3A] text-white pt-14 pb-6 px-6 md:px-16">

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/20 pb-10">

        {/* Logo / About */}
       <div>
  <h3 className="text-lg font-semibold mb-5">
    Important Links
  </h3>

  <ul className="space-y-3 text-sm text-gray-300">

    <li>
      <Link to="/" className="hover:text-blue-400 transition">
        Home
      </Link>
    </li>
    <li>
      <Link to="/bursary/application" className="hover:text-blue-400 transition">
        Apply Now
      </Link>
    </li>

    <li>
      <Link to="" className="hover:text-blue-400 transition">
        Get Guide
      </Link>
    </li>

    <li>
      <Link to="" className="hover:text-blue-400 transition">
        Chech Status
      </Link>
    </li>
    <li>
      <Link to="" className="hover:text-blue-400 transition">
        Overview
      </Link>
    </li>

    <li>
      <Link to="/contact" className="hover:text-blue-400 transition">
        Help & Support
      </Link>
    </li>

  </ul>
</div>
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-5">
            Contact Us
          </h3>

          <ul className="space-y-4 text-sm text-gray-300">

            <li className="flex items-center gap-3">
              <Phone size={18} className="text-blue-400" />
              <span>0757 111 111</span>
            </li>

            <li className="flex items-center gap-3">
              <Mail size={18} className="text-blue-400" />
              <span>muhoroningcdf@gmail.com</span>
            </li>

            <li className="flex items-center gap-3">
              <Globe size={18} className="text-blue-400" />
              <span>www.muhoroni-ngcdf.go.ke</span>
            </li>

            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-blue-400" />
              <span>P.O Box 40100 - Chemelil</span>
            </li>

          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-5">
            Our Location
          </h3>

          <div className="space-y-3 text-sm text-gray-300">
            <p className="flex items-start gap-2">
              <MapPin size={18} className="text-blue-400 mt-1" />
              Muhoroni Constituency Office, Chemelil Town
            </p>

            <p>
              We are located in the heart of Muhoroni Constituency, easily accessible for all residents seeking NG-CDF services and support.
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-5">
            Follow Us
          </h3>

          <div className="flex gap-4">

            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-blue-500 transition">
              <FaFacebook />
            </a>

            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-pink-500 transition">
              <FaInstagram />
            </a>

            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-blue-700 transition">
              <FaLinkedin />
            </a>

            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-sky-500 transition">
              <Send size={18} />
            </a>

          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="pt-6 flex justify-center">
        <p className="text-sm text-gray-400">
          © 2026 @ Engineer Mlaguzi Softwares.
        </p>
      </div>

    </footer>
  );
};

export default Footer;