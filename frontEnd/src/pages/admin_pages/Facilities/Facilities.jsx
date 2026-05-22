import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

const Facilities = () => {

  const cardsValue = [
    {
      title: "Catering",
      desc: "Order snacks, food, and beverages anytime during your voyage.",
      image:
        "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80",
      path: "/admin/services/catering",
    },
    {
      title: "Stationary",
      desc: "Get gift items, books, and supplies delivered directly.",
      image:
        "https://media.istockphoto.com/id/1167846999/photo/education.jpg?s=612x612&w=0&k=20&c=N1nymqiKH8GkOcIYNT4EguHtMgJLKn-bIBBfC8EV-UA=", // Stationery desk
      path: "/admin/services/stationary",
    },
    {
      title: "Movie Tickets",
      desc: "Choose films and reserve seats for a sea-view cinema.",
      image:
        "https://content.jdmagicbox.com/comp/pune/w2/020pxx20.xx20.120914114726.p6w2/catalog/pvr-cinemas-phoenix-market-city-mall-viman-nagar-pune-multiplex-cinema-halls-onecc.jpg", // Movie theater
      path: "/admin/booking/ViewMoviehallService",
    },
    {
      title: "Beauty Salon",
      desc: "Relax and rejuvenate at our premium onboard salon.",
      image:
        "https://media.istockphoto.com/id/1856117770/photo/modern-beauty-salon.jpg?s=612x612&w=0&k=20&c=dVZtsePk2pgbqDXwVkMm-yIw5imnZ2rnkAruR7zf8EA=", // Salon
      path: "/admin/booking/viewSalonService",
    },
    {
      title: "Fitness Centre",
      desc: "Train with modern equipment & reserve your time slot.",
      image:
        "https://images.squarespace-cdn.com/content/v1/58471a2329687f12c60955a3/1709159979051-8UDTOGLV884UYMV5LW1T/fitness-center-design.jpg?format=1000w", // Gym
      path: "/admin/booking/viewFitnessService",
    },
    {
      title: "Party Hall",
      desc: "Host birthdays, weddings, or get-togethers in style.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBdnVI_008yLVOl9u6rc0G4cJjmiQh7LgWXg&s", // Party event
      path: "/admin/booking/ViewpartyhallService",
    },
  ];

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };


  return (
    <main className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {cardsValue.map((card, index) => (
          <Link
            to={card.path}
            key={index}
            className={` text-white overflow-hidden shadow-lg border border-gray-300 rounded-3xl `}
          >
            <div className="border-amber-50">
              <img
                src={card.image}
                alt={card.title}
                className="h-50 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-sm opacity-90">{card.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Facilities;
