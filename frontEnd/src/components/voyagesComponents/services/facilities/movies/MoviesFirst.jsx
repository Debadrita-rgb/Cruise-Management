"use client";
import React, { useEffect, useState } from "react";
import { Carousel, Card } from "../../../../../lib/apple-cards-carousel";
import { motion } from "framer-motion";
import BASE_URL from "../../../../../../config";

export function MovieFirst() {

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

  const [MovieItems, setMovieItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/voyager/get-movie`)
      .then((res) => res.json())
      .then((data) => {
        setMovieItems(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const cards = MovieItems.map((card, index) => (
    // <Card key={card.src} card={card} index={index} />
    <Card key={card.id || index} card={card} index={index} />
  ));

  return (
    <section className="px-6 md:px-16 py-16">
      <div className="w-full h-full rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md border border-white/20">
          <motion.h1
            className="text-4xl font-bold text-center poppins text-white mt-10"
            variants={fadeUp}
            custom={1}
          >
            Welcome to <span className="text-purple-500">Aurelia </span> Movies
            service
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="hidden sm:block text-lg text-center text-white"
            variants={fadeUp}
            custom={2}
          >
            Find all the Movies service for your voyage with us.
          </motion.p>
        <Carousel items={cards} />
      </div>
    </section>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <img
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};
