import React from "react";
import { Link } from "react-router-dom";

const VoyagerShowcaseSection = () => {
  const services = [
    {
      title: "Catering",
      desc: "Order snacks, food, and beverages anytime during your voyage.",
      image:
        "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80", // Food table
      color: "from-pink-500 to-yellow-400",
      path: "/services/catering",
    },
    {
      title: "Stationary",
      desc: "Get gift items, books, and supplies delivered directly.",
      image:
        "https://media.istockphoto.com/id/1167846999/photo/education.jpg?s=612x612&w=0&k=20&c=N1nymqiKH8GkOcIYNT4EguHtMgJLKn-bIBBfC8EV-UA=", // Stationery desk
      color: "from-green-400 to-blue-500",
      path: "/services/stationary",
    },
    {
      title: "Movie Tickets",
      desc: "Choose films and reserve seats for a sea-view cinema.",
      image:
        "https://content.jdmagicbox.com/comp/pune/w2/020pxx20.xx20.120914114726.p6w2/catalog/pvr-cinemas-phoenix-market-city-mall-viman-nagar-pune-multiplex-cinema-halls-onecc.jpg", // Movie theater
      color: "from-purple-500 to-pink-600",
      path: "/services/facilities/movies",
    },
    {
      title: "Beauty Salon",
      desc: "Relax and rejuvenate at our premium onboard salon.",
      image:
        "https://media.istockphoto.com/id/1856117770/photo/modern-beauty-salon.jpg?s=612x612&w=0&k=20&c=dVZtsePk2pgbqDXwVkMm-yIw5imnZ2rnkAruR7zf8EA=", // Salon
      color: "from-red-400 to-yellow-300",
      path: "/services/facilities/salonCategory",
    },
    {
      title: "Fitness Centre",
      desc: "Train with modern equipment & reserve your time slot.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5C0gGg0Etv38tKOQ8fKWUquaurYNYeWm_lg&s", // Gym
      color: "from-indigo-500 to-blue-300",
      path: "/services/facilities/fitness",
    },
    {
      title: "Party Hall",
      desc: "Host birthdays, weddings, or get-togethers in style.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBdnVI_008yLVOl9u6rc0G4cJjmiQh7LgWXg&s", // Party event
      color: "from-orange-400 to-pink-500",
      path: "/services/facilities/partyhall",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-16">
      <h2 className="text-4xl font-bold text-center mb-14 text-white">
        Explore Voyager Facilities
      </h2>

      <div className="grid gap-10 md:grid-cols-3">
        {services.map((card, index) => (
          <div
            key={index}
            className={`group transform transition-transform duration-700 hover:rotate-[2deg] hover:scale-105 perspective`}
          >
            <Link
              to={card.path}
              key={index}
              className="group transform transition-transform duration-700 hover:rotate-[2deg] hover:scale-105 perspective no-underline"
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
                  <p className="text-black text-sm opacity-80 leading-relaxed group-hover:opacity-100 transition-opacity duration-500">
                    {card.desc}
                  </p>
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
};

export default VoyagerShowcaseSection;
