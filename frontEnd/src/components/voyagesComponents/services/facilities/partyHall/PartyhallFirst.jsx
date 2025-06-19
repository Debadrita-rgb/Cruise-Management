
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PartyHallModal } from "./PartyhallModal"
import DOMPurify from "dompurify";

export const PartyhallFirst = () => {
  const [stationaryItems, setStationaryItems] = useState([]);  
  const [selectedItem, setSelectedItem] = useState(null);

  function stripHtml(htmlString) {
    const clean = DOMPurify.sanitize(htmlString, { ALLOWED_TAGS: [] });
    return clean;
  }
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
    
  //show all data
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/voyager/get-partyHall", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStationaryItems(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <section className="py-16 px-4 md:px-16">
      <motion.div
        className="rounded-3xl space-y-10  bg-white/10 shadow-2xl backdrop-blur-md border border-white/20 p-6"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        {/* Header */}
        <motion.h1
          className="text-4xl font-bold text-center poppins text-white"
          variants={fadeUp}
          custom={1}
        >
          Welcome to <span className="text-purple-500">Aurelia </span> Party
          Hall
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="hidden sm:block text-lg text-center text-white"
          variants={fadeUp}
          custom={2}
        >
          Find all the Party hall for your voyage with us.
        </motion.p>

        {/* Static Stationery Items Grid */}
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={fadeUp}
          custom={3}
        >
          {stationaryItems.map((item, i) => (
            <motion.div
              key={item._id}
              onClick={() => setSelectedItem(item)}
              className="flex cursor-pointer flex-col justify-between items-center bg-white rounded-lg shadow-lg p-6 space-y-4 transform transition hover:scale-105 hover:shadow-xl"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4 + i}
            >
              <img
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-86 lg:h-86 object-cover rounded-lg"
                // className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-cover rounded-lg"
                src={item.images[0]}
                alt={item.hallName}
              />
              <h2 className="text-lg font-semibold text-gray-800 text-center mt-5">
                {item.hallName}
              </h2>
              <p className="text-sm text-gray-600 text-center">
                {stripHtml(item.description).slice(0, 150)}...
              </p>

              <p className="text-lg font-medium text-green-500 text-center">
                Price - {item.price}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      {selectedItem && (
        <PartyHallModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
};
