import React from "react";
import { Link } from "react-router-dom";

const ContactUs = () => {
  return (
    <footer
      id="contactUs"
      className="bg-[#f8fafc] text-gray-800 border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-12 sm:grid-cols-2">
        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-bold tracking-wide text-gray-900">
            CONTACT US
          </h3>

          <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-md">
            Reach out to Medwell for partnerships, volunteering opportunities,
            or any questions about our health initiatives.
          </p>

          <ul className="mt-6 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="select-none">📞</span>
              <span className="text-gray-700">(+1) 928-270-1243</span>
            </li>

            <li className="flex items-start gap-3">
              <span className="select-none">✉️</span>
              <a
                href="mailto:dev.medwellsolutions@gmail.com"
                className="text-gray-700 hover:text-[#e13429] transition"
              >
                dev.medwellsolutions@gmail.com
              </a>
            </li>
          </ul>

          {/* Subtle CTA */}
          <div className="mt-7">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white bg-[#e13429] hover:bg-[#c62d23] transition shadow-sm"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Useful Links */}
        <div className="sm:pl-6">
          <h3 className="text-lg font-bold tracking-wide text-gray-900">
            USEFUL LINKS
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href="#about"
                className="text-gray-700 hover:text-[#e13429] transition"
              >
                About Us
              </a>
            </li>

            <li>
              <a
                href="#causes"
                className="text-gray-700 hover:text-[#e13429] transition"
              >
                Campaigns
              </a>
            </li>

            <li>
              <a
                href="#contactUs"
                className="text-gray-700 hover:text-[#e13429] transition"
              >
                Contact
              </a>
            </li>

            <li>
              <Link
                to="/login"
                className="text-gray-700 hover:text-[#e13429] transition"
              >
                Login
              </Link>
            </li>
          </ul>

          {/* light divider + tiny note */}
          <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-600 leading-relaxed">
              We typically respond within 24–48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Medwell Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default ContactUs;