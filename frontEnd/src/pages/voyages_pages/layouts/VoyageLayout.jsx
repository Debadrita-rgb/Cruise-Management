import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../../components/voyagesComponents/Navbar/Navbar"; // update path as needed
import Footer from "../../../components/voyagesComponents/Footer/Footer"; // make sure you create this component

const VoyageLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-[#003860] to-[#1b4c6d] text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default VoyageLayout;
