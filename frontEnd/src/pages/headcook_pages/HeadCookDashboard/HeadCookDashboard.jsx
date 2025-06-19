import { MdEdit } from "react-icons/md"
import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiClock, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const HeadCookDashboard = () => {

  const [dashboardData, setDashboardData] = useState({
    acceptedItems: 0,
  });


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/headcook/dashboardData",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);


  const cardsValue = [
    
    {
      title: "Accepted Catering Item",
      value: dashboardData.acceptedItems,
      color: "text-green-500",
    },
    
  ];


  return (
    <main className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardsValue.map((card, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default HeadCookDashboard;
