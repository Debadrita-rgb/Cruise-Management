import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";
import { GrUserManager } from "react-icons/gr";
import { GiCook } from "react-icons/gi";
import { MdSupervisedUserCircle } from "react-icons/md";
import { FaGift } from "react-icons/fa6";
import { RiGalleryView } from "react-icons/ri";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";

export default function AdminSidebar({ isOpen, toggleSidebar }) {
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
            to="/admin/dashboard"
            className="flex items-center space-x-2 p-4 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
          >
            <FiHome /> <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/view-all-category"
            className="flex items-center space-x-2 p-4 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
          >
            <BiCategory /> <span>Category</span>
          </Link>
          <Link
            to="/admin/facilities"
            className="flex items-center space-x-2 p-4 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl "
          >
            <FaGift /> <span>Facilities</span>
          </Link>
          <Link
            to="/admin/view-all-user"
            className="flex items-center space-x-2 p-4 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
          >
            <GrUserManager /> <span>View User</span>
          </Link>
          <Link
            to="/admin/view-gallery"
            className="flex items-center space-x-2 p-4 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
          >
            <RiGalleryView /> <span>View Gallery</span>
          </Link>

          <Link
            to="/admin/view-contact"
            className="flex items-center space-x-2 p-4 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
          >
            <BsFillPersonLinesFill /> <span>View Contact</span>
          </Link>
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
