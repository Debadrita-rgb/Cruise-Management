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

  const handleBooking = async (salonId, price) => {
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
      navigate(`/services/facilities/salon/book-salon/${salonId}`, {
        state: {
          userId: user.id,
          name,
          email,
          price,
        },
      });
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
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
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="z-[200] absolute top-4 right-4 lg:hidden bg-white rounded-full p-2 shadow-md"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.title}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              {/* Sticky Header Section */}
              <div className="sticky top-0 z-20 bg-white dark:bg-neutral-900">
                <motion.div layoutId={`image-${active.title}`}>
                  <img
                    width={200}
                    height={200}
                    src={active.serviceimage}
                    alt={active.title}
                    className="w-full h-80 object-cover object-top"
                  />
                </motion.div>
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.serviceName}`}
                      className="font-bold text-neutral-700 dark:text-neutral-100"
                    >
                      {active.serviceName}
                    </motion.h3>
                    <motion.p
                      layoutId={`Price-${active.price}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      Price - {active.price}
                    </motion.p>
                    <motion.p
                      layoutId={`servicetime-${active.servicetime}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      Service Time - {active.servicetime}
                    </motion.p>
                    <motion.p
                      layoutId={`description-${active.description}`}
                      className="text-neutral-600 dark:text-neutral-400"
                      dangerouslySetInnerHTML={{ __html: active.description }}
                    />
                  </div>

                  <motion.button
                    layoutId={`button-${item.serviceName}`}
                    className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-xl shadow-lg cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBooking(item._id, active.price);
                    }}
                  >
                    Book Nows
                  </motion.button>
                </div>
              </div>

              {/* Scrollable Description */}
              <div className="flex-1 overflow-y-auto px-4 pb-10">
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-neutral-600 text-sm lg:text-base flex flex-col items-start gap-4 dark:text-neutral-400"
                >
                  {typeof active.content === "function" ? (
                    active.content()
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: active.servicedescription,
                      }}
                    />
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* List Item */}
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {item && (
          <motion.div
            layoutId={`card-${item.serviceName}`}
            key={`card-${item.serviceName}`}
            onClick={() => setActive(item)}
            className="p-4 flex flex-col md:flex-row justify-between items-center bg-transparent hover:bg-neutral-50 dark:hover:bg-[#1b4c6d] rounded-xl cursor-pointer group"
          >
            <div className="flex gap-4 flex-col md:flex-row items-center">
              <motion.div layoutId={`image-${item.serviceName}`}>
                <img
                  width={100}
                  height={100}
                  src={item.serviceimage}
                  alt={item.serviceName}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="text-center md:text-left">
                <motion.h3
                  layoutId={`title-${item.serviceName}`}
                  className="font-medium text-white group-hover:text-black dark:text-neutral-200"
                >
                  {item.serviceName}
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
              layoutId={`button-${item.serviceName}`}
              className="cursor-pointer bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-xl shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleBooking(item._id, item.price);
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
