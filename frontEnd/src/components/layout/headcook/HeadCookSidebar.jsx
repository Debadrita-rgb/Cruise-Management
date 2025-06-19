import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaGift, FaChevronUp, FaChevronDown } from "react-icons/fa6";



export default function HeadCookSidebar({ isOpen, toggleSidebar }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const toggleDropdown = () => setOpenDropdown(!openDropdown);


  return (
    <>
      {/* Sidebar: Overlay on Mobile, Fixed on Desktop */}
      <aside
        className={`fixed top-16 left-0 h-full bg-white/10 shadow-2xl backdrop-blur-md border border-white/20 p-6 transition-transform duration-300 
        ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0 md:w-64 lg:w-64 z-50`}
      >
        <nav className="mt-5 space-y-4">
          <Link
            to="/headcook/dashboard"
            className="flex items-center space-x-2 p-4 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
          >
            <FiHome /> <span>Dashboard</span>
          </Link>
          <div>
            <button
              onClick={toggleDropdown}
              className="w-full flex items-center justify-between p-4 rounded transition duration-200 hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
            >
              <span className="flex items-center space-x-2">
                <FaGift /> <span>Manage Order</span>
              </span>
              {openDropdown ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Dropdown Children */}
            {openDropdown && (
              <div className="ml-6 mt-2 space-y-2 text-sm">
                <Link
                  to="/headcook/ordered-cateringitems"
                  className="block p-2 rounded hover:bg-gray-200 hover:text-[#1b4c6d]"
                >
                  Order Catering Items
                </Link>
                <Link
                  to="/headcook/accepted-cateringitems"
                  className="block p-2 rounded hover:bg-gray-200 hover:text-[#1b4c6d]"
                >
                  Accepted Catering Items
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
