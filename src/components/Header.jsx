import React from "react";
import TopInfoBar from "./TopInfobar";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="w-full">
      <TopInfoBar />
      <Navbar />
    </header>
  );
};

export default Header;
