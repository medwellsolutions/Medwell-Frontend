import React from "react";
import TopInfoBar from "./TopInfobar";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-40">
      <TopInfoBar />
      <Navbar />
    </header>
  );
};

export default Header;
