import React, { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { FaChevronUp } from "react-icons/fa";

const SalonFirst = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/voyager/get-salon-bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.orders || []);
      })
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);
console.log("Booking Details",bookings);
  return (
    <section className="px-6 md:px-16 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
        My Beauty Salon Bookings
      </h2>

      <div className="p-6 text-white rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md border border-white/20">
        {bookings.length === 0 ? (
          <p className="text-gray-300">No bookings found.</p>
        ) : (
          bookings.map((order) => (
            <Disclosure key={order._id}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="mt-3 flex justify-between w-full bg-gray-100 px-4 py-2 text-left text-lg font-medium text-black rounded-lg hover:bg-gray-200">
                    <div className="flex w-full justify-between">
                      <div className="w-1/2">
                        <p className="text-sm text-gray-500">
                          Booking ID: {order._id}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          <strong
                            className={
                              order.status === "Booking"
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {order.status}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-500">
                          Created At:{" "}
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Booking Date:</strong>{" "}
                          {order.details.bookingdate}
                        </p>
                      </div>
                      <div className="w-1/2 pl-6">
                        <p className="text-sm text-gray-500">
                          <strong>Booking Price:</strong> {order.details.price}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Start Time:</strong>{" "}
                          {order.details.bookingTime}
                        </p>

                        <p className="text-sm text-gray-500">
                          <strong>Service Name:</strong> {order.details.salonName}
                        </p>
                      </div>
                    </div>
                    <FaChevronUp
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } w-5 h-5 text-black self-center ml-4`}
                    />
                  </Disclosure.Button>

                  <Disclosure.Panel className="px-4 mt-2 pt-4 pb-2 text-sm text-gray-700 bg-white rounded-lg shadow">
                    <div className="border-b py-2">
                      <span className="font-medium text-gray-800">
                        Requirements:
                      </span>
                      <p>
                        {order.details.requirements ||
                          "No requirements provided"}
                      </p>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))
        )}
      </div>
    </section>
  );
};

export default SalonFirst;
