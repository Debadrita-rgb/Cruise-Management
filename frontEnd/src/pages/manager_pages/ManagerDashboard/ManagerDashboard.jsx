import React, { useState, useEffect } from 'react';
import axios from "axios";
import BASE_URL from '../../../../config';

const ManagerDashboard = () => {

  const [dashboardData, setDashboardData] = useState({
    nsalonBooking: 0,
    nfitnessBooking: 0,
    npartyhallBooking: 0,
  });


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/manager/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data.success) {
          setDashboardData({
            nsalonBooking: response.data.nsalonBooking,
            npartyhallBooking: response.data.npartyhallBooking,
            nfitnessBooking: response.data.nfitnessBooking,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
console.log("dashboardData:", dashboardData);

  const cardsValue = [
    {
      title: "Accepted Salon Booking",
      value: dashboardData.nsalonBooking,
    },
    {
      title: "Accepted Fitness Booking",
      value: dashboardData.nfitnessBooking,
    },
    {
      title: "Accepted Party Hall Booking",
      value: dashboardData.npartyhallBooking,
    },
  ];

  return (
    <main className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardsValue.map((card, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold text-green-500`}>
                {card.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ManagerDashboard;
