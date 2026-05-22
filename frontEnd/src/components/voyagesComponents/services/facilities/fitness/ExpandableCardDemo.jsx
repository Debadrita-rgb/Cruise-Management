"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../../../../../lib/use-outside-click";
import "./ExpandableCardDemo.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import BASE_URL from "../../../../../../config";

export default function ExpandableCardDemo({ item }) {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const navigate = useNavigate();

  const handleBooking = async (fitnessId, price) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const user = jwtDecode(token);

      // Optionally fetch user details if needed, or just use token info
      const res = await axios.get(
        `${BASE_URL}/voyager/get-user-details/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { name, email } = res.data;
      navigate(`/services/facilities/fitness/book-fitness/${fitnessId}`, {
        state: {
          userId: user.id,
          name,
          email,
          price,
        },
      });
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
            <motion.div
              ref={ref}
              layoutId={`card-${active.servicename}`}
              className="relative w-full max-w-7xl max-h-[95vh] bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-md z-10"
              >
                <CloseIcon />
              </button>

              {/* Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto">
                <img
                  src={active.serviceimage}
                  alt={active.servicename}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 p-6 overflow-y-auto space-y-4">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                  {active.servicename}
                </h2>

                <p
                  className="text-neutral-600 dark:text-neutral-400"
                  dangerouslySetInnerHTML={{
                    __html: active.servicedescription,
                  }}
                />

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Price:</strong> ₹{active.price}
                </p>
                {active.trainer && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Trainer:</strong> {active.trainer}
                  </p>
                )}

                {/* Time Slots */}
                {active.serviceslot?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-700">
                      Available Time Slots
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {active.serviceslot.map((slot, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-cyan-100 text-cyan-800 rounded-full"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment Items */}
                {active.equipmentItems?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mt-4 mb-2">Equipment</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {active.equipmentItems.map((equipment) => (
                        <div
                          key={equipment._id}
                          className="flex items-center gap-3 bg-gray-100 dark:bg-neutral-800 p-2 rounded-lg"
                        >
                          <img
                            src={equipment.imageUrl}
                            alt={equipment.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span className="text-sm text-gray-800 dark:text-white font-medium">
                            {equipment.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg cursor-pointer"
                  onClick={() => handleBooking(active._id)}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* List Item */}
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {item && (
          <motion.div
            layoutId={`card-${item.servicename}`}
            key={`card-${item.servicename}`}
            onClick={() => setActive(item)}
            className="p-4 flex flex-col md:flex-row justify-between items-center bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer group"
          >
            <div className="flex gap-4 flex-col md:flex-row items-center">
              <motion.div layoutId={`image-${item.servicename}`}>
                <img
                  width={100}
                  height={100}
                  src={item.serviceimage}
                  alt={item.servicename}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="text-center md:text-left">
                <motion.h3
                  layoutId={`title-${item.servicename}`}
                  className="font-medium text-white group-hover:text-black dark:text-neutral-200"
                >
                  {item.servicename}
                </motion.h3>
                <motion.p
                  layoutId={`price-${item.price}`}
                  className="text-white group-hover:text-black dark:text-neutral-200"
                >
                  Price: {item.price}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${item.servicename}`}
              className="cursor-pointer bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-xl shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleBooking(item._id, item.price); // pass price here
              }}
            >
              Book Now
            </motion.button>
          </motion.div>
        )}
      </ul>
    </>
  );
}

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
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
