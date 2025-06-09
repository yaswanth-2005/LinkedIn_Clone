import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-full lg:max-w-7xl lg:text-sm mx-auto py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
