import React from "react";

const ContactUs = () => {
  return (
    <footer
      id="contact"
      className="bg-neutral-800 text-neutral-200 py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-2">
        
        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white">
            CONTACT US
          </h3>
          <p className="text-sm mb-4 text-neutral-300">
            Reach out to Medwell for partnerships, volunteering opportunities,
            or any questions about our health initiatives.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-400">📍</span>
              175 5th Ave, New York, NY 10010
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">📞</span>
              (+1) 928-270-1243
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">✉️</span>
              dev.medwellsolutions@gmail.com
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white">
            USEFUL LINKS
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#about" className="hover:text-blue-400 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#causes" className="hover:text-blue-400 transition">
                Campaigns
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-400 transition">
                Contact
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-blue-400 transition">
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="mt-12 border-t border-neutral-700 pt-6 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} Medwell Solutions. All rights reserved.
      </div>
    </footer>
  );
};

export default ContactUs;
