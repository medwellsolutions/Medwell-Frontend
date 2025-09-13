import React from "react";

const ContactDetails = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white">CONTACT US</h3>
          <p className="text-sm mb-4">
            Dolor sit amet consectetur adipiscing elit ut. Iaculis nunc sed augue lacus viverra.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-500">📍</span>
              175 5th Ave, New York, NY 10010
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">📞</span>
              (+88) 12 345 6789
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">✉️</span>
              Info@Charihope.com
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white">USEFUL LINKS</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#about" className="hover:text-orange-500">About Us</a></li>
            <li><a href="#how" className="hover:text-orange-500">How It Works</a></li>
            <li><a href="#team" className="hover:text-orange-500">Team</a></li>
            <li><a href="#courses" className="hover:text-orange-500">Charity Courses</a></li>
            <li><a href="#security" className="hover:text-orange-500">Security</a></li>
          </ul>
        </div>

        {/* Recent News */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white">RECENT NEWS</h3>
          <ul className="space-y-4 text-sm">
            <li>
              <a href="#" className="hover:text-orange-500 block">
                <p className="font-medium">Eget nunc lobortis matt aliquam</p>
                <p className="text-xs text-neutral-400">May 3, 2019</p>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500 block">
                <p className="font-medium">Fames ac turpis eges maecenas</p>
                <p className="text-xs text-neutral-400">May 3, 2019</p>
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500 block">
                <p className="font-medium">Eget fringilla phas faucibus scelerisque</p>
                <p className="text-xs text-neutral-400">May 3, 2019</p>
              </a>
            </li>
          </ul>
        </div>

        {/* Gallery */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white">GALLERY</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=400",
              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400",
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
              "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400",
              "https://images.unsplash.com/photo-1503457574462-bd27054394c1?q=80&w=400",
              "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?q=80&w=400",
            ].map((src, i) => (
              <img key={i} src={src} alt="gallery" className="h-20 w-full object-cover" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="mt-12 border-t border-neutral-700 pt-6 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} Medwell Solutions. All rights reserved.
      </div>
    </footer>
  );
};

export default ContactDetails;
