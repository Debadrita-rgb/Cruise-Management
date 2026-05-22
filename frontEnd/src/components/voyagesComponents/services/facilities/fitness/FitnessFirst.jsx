import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BASE_URL from "../../../../../../config";

export const FitnessFirst = () => {

  const [categories, setCategories] = useState([]);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
  
      fetch(`${BASE_URL}/admin/get-fitnesscategory-active`, {
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
          Welcome to <span className="text-purple-500">Aurelia </span> Fitness
          service
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="hidden sm:block text-lg text-center text-white"
          variants={fadeUp}
          custom={2}
        >
          Find all the Fitness service for your voyage with us.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
        {categories.map((cat, index) => (
          <Link
            key={`${cat._id || cat.name}-${index}`}
            to={`/services/facilities/fitness?category=${encodeURIComponent(
              cat.name
            )}`}
            className="cursor-pointer border rounded-3xl overflow-hidden shadow hover:scale-105 transition"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-2 text-center font-semibold">{cat.name}</div>
          </Link>
        ))}
      </div>
    </>
  );
};
