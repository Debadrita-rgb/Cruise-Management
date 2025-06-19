import React from "react";
import { Link } from "react-router-dom";

const Booking = () => {
  const services = [
    {
      title: "Movie Tickets",
      image:
        "https://www.shutterstock.com/image-photo/stockholm-sweden-082617-main-theatre-600nw-1592236063.jpg",
      color: "from-purple-500 to-pink-600",
      path: "/booking/facilities/movies",
    },
    {
      title: "Beauty Salon",
      image:
        "https://www.msccruises.ca/-/media/canada/beauty-hair-salon.jpg?bc=transparent&as=1&mh=1080&mw=1380&hash=A1A6AAE43B7599AAE1CECB0594DC3A60",
      color: "from-red-400 to-yellow-300",
      path: "/booking/facilities/salon",
    },
    {
      title: "Fitness Centre",
      image:
        "https://thumbs.dreamstime.com/b/cruise-ship-fitness-workout-run-people-lifestyle-woman-doing-exercise-running-track-caribbean-vacation-155625775.jpg", // Gym
      color: "from-indigo-500 to-blue-300",
      path: "/booking/facilities/fitness",
    },
    {
      title: "Party Hall",
      image:
        "https://thumbs.dreamstime.com/b/cruise-ship-pool-party-spot-15887921.jpg", 
      color: "from-orange-400 to-pink-500",
      path: "/booking/facilities/partyhall",
    },
  ];
  return (
    <section className="px-6 md:px-16 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
        My Booking
      </h2>

      <div className="grid gap-10 md:grid-cols-4 rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md border border-white/20 p-6">
        {services.map((card, index) => (
          <div
            key={index}
            className={`group transform transition-transform duration-700  hover:scale-105 perspective`}
          >
            <Link
              to={card.path}
              key={index}
              className="group transform transition-transform duration-700 hover:scale-105 perspective no-underline"
            >
              <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-xl transform-style-preserve-3d hover:rotate-x-2 hover:rotate-y-1 transition-all duration-700">
                {/* 3D Dummy Image */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* desc-Reveal + Glare Background */}
                <div
                  className={`relative z-10 p-6 bg-gradient-to-br ${card.color} bg-opacity-20 rounded-b-2xl transition-all duration-500`}
                >
                  <h3 className="text-2xl font-semibold text-black mb-2 group-hover:translate-y-0 translate-y-2 transition-all duration-500">
                    {card.title}
                  </h3>
                </div>

                {/* Glare Effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute w-[200%] h-full top-0 left-[-100%] bg-white/10 blur-md rotate-45 transform group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Booking;
