import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-neutral-600">
        © {new Date().getFullYear()} Medwell Solutions. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
