import React from "react";

const TopInfoBar = () => {
  return (
    <div className=" hidden lg:block w-full bg-neutral-900 text-neutral-200 text-sm p-1">
      <div className="mx-auto max-w-7xl h-auto sm:h-10 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-wrap items-center gap-6 gap-y-1">
          <a href="dev.medwellsolutions@gmail.com">
            <span className=" hover:text-orange-500 inline-flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current">
                <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.3-.5 7.2 5.1L18.7 6H4.3Zm15.2 2.1-7.4 5.2a1 1 0 0 1-1.15 0L3.5 8.1V17.5c0 .55.45 1 1 1h15c.55 0 1-.45 1-1V8.1Z"/>
              </svg>
              dev.medwellsolutions@gmail.com
            </span>
          </a>
          <a href="tel:+19282701243">
            <span className="inline-flex items-center gap-2 hover:text-orange-500">
              <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.1.36 2.29.55 3.58.55a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11.4 21 3 12.6 3 2a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.29.19 2.48.55 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2Z"/>
              </svg>
              +1 9282701243
            </span>
          </a>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-orange-500">FAQs</a>
          <a href="#" className="hover:text-orange-500">Networks</a>
          <a href="#donate" className=" bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 sm:py-5">
            Donate Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopInfoBar;
