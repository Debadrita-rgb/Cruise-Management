import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Sidebar toggle icons
import { MdArrowDropDown } from "react-icons/md"; // Dropdown Arrow Icon
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import logo from "../../../assets/logo.png";

const AdminNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [admin, setAdmin] = useState({
    name: "Admin",
    role: "Admin",
    profilePic: "",
  });
  const location = useLocation();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchAdminDetails = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get("http://localhost:5000/admin/showname_navbar", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setAdmin(response.data.admin);
  //     } catch (error) {
  //       console.error("Error fetching admin details:", error);
  //     }
  //   };

  //   fetchAdminDetails();
  // }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (event) => {
      if (!event.target.closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const getPageTitle = () => {
    if (
      location.pathname.startsWith("/admin/services/catering/editCatering/")
    ) {
      return "Edit Catering";
    }
    if (location.pathname.startsWith("/admin/edit-banner/")) {
      return "Edit banner";
    }
    if (location.pathname.startsWith("/admin/booking/editMoviehallService/")) {
      return "Edit Moviehall Service";
    }
    if (location.pathname.startsWith("/admin/booking/editpartyhallService/")) {
      return "Edit Partyhall Service";
    }
    if (location.pathname.startsWith("/admin/booking/editSalonService/")) {
      return "Edit Salon Service";
    }
    if (location.pathname.startsWith("/admin/booking/editFitnessService/")) {
      return "Edit Fitness Service";
    }
    if (
      location.pathname.startsWith("/admin/services/stationary/editStationary/")
    ) {
      return "Edit Stationary";
    }
    if (location.pathname.startsWith("/admin/edit-user/")) {
      return "Edit User";
    }
    if (location.pathname.startsWith("/admin/edit-gallery/")) {
      return "Edit Gallery";
    }
    if (location.pathname.startsWith("/admin/edit-category/")) {
      return "Edit Category";
    }
    if (location.pathname.startsWith("/admin/view-contact-details/")) {
      return "View Contact Details";
    }
    if (location.pathname.startsWith("/admin/view-testimonial/")) {
      return "View Testimonial Details";
    }
    if (location.pathname.startsWith("/admin/view-feedback-details/")) {
      return "View Feedback Details";
    }
    switch (location.pathname) {
      case "/admin/facilities":
        return "Facilities";
      case "/admin/view-all-user":
        return "View User";
      case "/admin/add-user":
        return "Add User";
      case "/admin/view-all-banner":
        return "View Banner";
      case "/admin/add-banner":
        return "Add Banner";
      case "/admin/view-all-category":
        return "View Category";
      case "/admin/add-category":
        return "Add Category";
      case "/admin/view-contact":
        return "View Contact";
      case "/admin/view-feedback":
        return "View Feedback";
      case "/admin/view-testimonial":
        return "View Testimonial";

      case "/admin/view-gallery":
        return "View Gallery";
      case "/admin/add-gallery":
        return "Add Gallery";

      case "/admin/services/catering":
        return "View Catering";
      case "/admin/services/catering/addCatering":
        return "Add Catering";

      case "/admin/services/stationary":
        return "View Stationary";
      case "/admin/services/stationary/addStationary":
        return "Add Stationary";

      case "/admin/booking/viewSalonService":
        return "View Salon Service";
      case "/admin/booking/addSalonService":
        return "Add Salon Service";

      case "/admin/booking/viewFitnessService":
        return "View Fitness Service";
      case "/admin/booking/addFitnessService":
        return "Add Fitness Service";

      case "/admin/booking/ViewMoviehallService":
        return "View Movie Hall Service";
      case "/admin/booking/addMoviehallService":
        return "Add Movie Hall Service";

      case "/admin/booking/ViewpartyhallService":
        return "View Partyhall Service";
      case "/admin/booking/addpartyhallService":
        return "Add Partyhall Service";

      default:
        return "Admin Dashboard";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("showWelcomeToast"); // Clear the toast flag
    toast.success("Logged out successfully!");
    navigate("/backend/login");
  };
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 shadow-md flex items-center justify-between z-50">
      {/* Left Section: Hamburger & Logo */}
      <div className="flex items-center space-x-4">
        <button className="lg:hidden text-white" onClick={toggleSidebar}>
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <img
          src={logo}
          alt="Logo"
          className="h-15 w-auto sm:inline hidden rounded-4xl ms-5"
        />
      </div>

      {/* Center Section: Dynamic Page Title (Visible on all screens) */}
      <h4 className="text-lg font-semibold text-center md:text-left text-white justify-between items-center">
        {getPageTitle()}
      </h4>

      {/* Right Section: Profile Dropdown */}
      <div className="relative dropdown">
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            src={
              admin.profilePic ||
              "https://cdn.pixabay.com/photo/2015/04/13/12/07/business-720429_1280.jpg"
            }
            className="rounded-full w-10 h-10 border-2 border-white object-cover"
            alt="admin"
          />
          {/* <img
            src="https://cdn.pixabay.com/photo/2015/04/13/12/07/business-720429_1280.jpg"
            className="rounded-full w-10 h-10 border-2 border-white"
            alt="User"
          /> */}
          <div className="flex flex-col text-left">
            <p className="font-semibold text-white">{admin.name}</p>
            <p className="text-sm text-white">Admin</p>
          </div>
          <MdArrowDropDown size={24} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-4 w-56 bg-gray-200 text-black shadow-xl rounded-md py-2 top-16 p-4 z-50">
            {/* <Link
              to="/admin/profile"
              className="block px-4 py-2 hover:bg-gray-300 mt-2 text-sm p-2 rounded-lg cursor-pointer"
            >
              My Profile
            </Link> */}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-300 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
