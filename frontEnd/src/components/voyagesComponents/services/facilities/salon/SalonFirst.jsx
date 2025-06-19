import React, { useState, useEffect } from "react";
import "./SalonFirst.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function SalonFirst() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/admin/get-saloncategory-active", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };
  return (
    <>
      <div className="mb-15">
        <motion.h1
          className="text-4xl font-bold text-center poppins text-white mt-10"
          variants={fadeUp}
          custom={1}
        >
          Welcome to <span className="text-purple-500">Aurelia </span> Salon
          service
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="hidden sm:block text-lg text-center text-white"
          variants={fadeUp}
          custom={2}
        >
          Find all the Salon service for your voyage with us.
        </motion.p>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((item, index) => (
          <div key={index} className="mx-auto w-full max-w-xs">
            <Link
              to={`/services/facilities/salon?category=${encodeURIComponent(
                item.name
              )}`}
              className="group transform transition-transform duration-700 hover:rotate-[2deg] hover:scale-105 perspective no-underline"
            >
              <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-xl transform-style-preserve-3d hover:rotate-x-2 hover:rotate-y-1 transition-all duration-700">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 sm:h-48 md:h-40 lg:h-48 object-cover"
                />

                <div
                  className={`relative z-10 p-4 bg-gradient-to-br ${item.color} bg-opacity-20 rounded-b-2xl`}
                >
                  <h3 className="text-lg font-semibold text-black mb-2 group-hover:translate-y-0 translate-y-2 transition-all duration-500 text-center">
                    {item.name}
                  </h3>
                </div>

                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute w-[200%] h-full top-0 left-[-100%] bg-white/10 blur-md rotate-45 transform group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
