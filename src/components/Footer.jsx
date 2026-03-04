import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Medwell Solutions. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-sm">
            <a
              href="#about"
              className="text-gray-600 hover:text-[#e13429] transition"
            >
              About
            </a>
            <a
              href="#causes"
              className="text-gray-600 hover:text-[#e13429] transition"
            >
              Campaigns
            </a>
            <a
              href="#contactUs"
              className="text-gray-600 hover:text-[#e13429] transition"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4 text-xs text-gray-500">
          Building healthier communities through awareness, action, and impact.
        </div>
      </div>
    </footer>
  );
};

export default Footer;