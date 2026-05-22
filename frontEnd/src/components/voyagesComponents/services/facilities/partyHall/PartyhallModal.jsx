import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { motion } from "framer-motion";
import BASE_URL from "../../../../../../config";

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black dark:text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export const PartyHallModal = ({ item, onClose }) => {
  if (!item) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  const navigate = useNavigate();

  const handleBookNow = async (hallId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const user = jwtDecode(token);
    try {
      const res = await axios.get(
        `${BASE_URL}/voyager/get-user-details/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { name, email } = res.data;

      navigate(`/services/facilities/partyhall/book-hall/${hallId}`, {
        state: {
          userId: user.id,
          name,
          email,
          price: item.price,
        },
      });
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-6xl max-h-[95vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white dark:bg-neutral-900 px-4 py-3 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {item.hallName}
            </h2>
            <p className="text-green-600 font-semibold text-base sm:text-lg">
              ₹ {item.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Capacity: {item.capacity}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleBookNow(item._id)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md"
            >
              Book Now
            </button>

            <button
              onClick={onClose}
              className="bg-white dark:bg-neutral-800 p-2 rounded-full shadow-md"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="px-4 py-3">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Slider {...settings}>
              {item.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Slide ${index}`}
                  className="w-full h-64 sm:h-72 md:h-96 object-cover"
                />
              ))}
            </Slider>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 py-3 overflow-y-auto flex-1 text-justify text-gray-700 dark:text-gray-300">
          <p className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: item.description }} />
        </div>
      </div>
    </div>
  );
};