import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";
import { GrUserManager } from "react-icons/gr";
import { FaGift } from "react-icons/fa6";
import { BiCategory } from "react-icons/bi";
import { BsChevronDown, BsChevronUp } from "react-icons/bs"; // Dropdown icons
import { RiGalleryView } from "react-icons/ri";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { MdFeedback } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const [miscOpen, setMiscOpen] = useState(false);

  return (
    <>
      <aside
        className={`fixed top-16 left-0 h-full bg-white/10 shadow-2xl backdrop-blur-md border border-white/20 p-6 transition-transform duration-300 
        ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0 md:w-64 lg:w-64 z-50`}
      >
        <nav className="mt-5 space-y-4">
          {/* Regular Links */}
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
            className="flex items-center space-x-2 p-4 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
          >
            <FaGift /> <span>Facilities</span>
          </Link>

          <Link
            to="/admin/view-all-user"
            className="flex items-center space-x-2 p-4 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
          >
            <GrUserManager /> <span>View User</span>
          </Link>

          {/* Dropdown for Miscellaneous */}
          <div>
            <button
              onClick={() => setMiscOpen(!miscOpen)}
              className="flex items-center justify-between w-full p-4 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
            >
              <div className="flex items-center space-x-2">
                <BiCategory />
                <span>Miscellaneous</span>
              </div>
              {miscOpen ? <BsChevronUp /> : <BsChevronDown />}
            </button>

            {miscOpen && (
              <div className="ml-6 space-y-2 mt-2">
                <Link
                  to="/admin/view-gallery"
                  className="block items-center p-2 ps-3 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
                >
                  <RiGalleryView className="inline-block mr-2" />
                  View Gallery
                </Link>
                <Link
                  to="/admin/view-contact"
                  className="block items-center p-2 ps-3 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
                >
                  <BsFillPersonLinesFill className="inline-block mr-2" />
                  View Contact
                </Link>
                <Link
                  to="/admin/view-feedback"
                  className="block items-center p-2 ps-3 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
                >
                  <MdFeedback className="inline-block mr-2" />
                  View Feedback
                </Link>
                <Link
                  to="/admin/view-testimonial"
                  className="block items-center p-2 ps-3 rounded transition duration-200 text-white hover:text-[#1b4c6d] hover:bg-gray-100 hover:rounded-2xl"
                >
                  <BiCommentDetail className="inline-block mr-2" />
                  View Testimonial
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
