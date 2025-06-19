import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Disclosure } from "@headlessui/react";
import { FaChevronUp } from "react-icons/fa";

const FitnessFirst = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/voyager/get-fitness-bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not OK");
        return res.json();
      })
      .then((data) => {
        const servicesList = Array.isArray(data.orders) ? data.orders : [];
        setServices(servicesList);
        setFilteredServices(servicesList);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setFilteredServices(services);
    } else {
      const selected = selectedDate.toLocaleDateString("sv-SE");
      const filtered = services.filter(
        (order) => order.details.date === selected
      );
      setFilteredServices(filtered);
    }
  }, [selectedDate, services]);

  return (
    <section className="px-6 md:px-16 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
        Fitness Services Booking
      </h2>
      <div className="p-6 text-white rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md border border-white/20">
        {/* <div className="mb-4">
          <label className="text-sm text-white mr-2 font-semibold">
            Filter by Date:
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a Date"
            className="px-3 py-1 rounded text-black bg-white border border-white"
            isClearable
            showPopperArrow={false}
          />
        </div> */}

        {filteredServices.length === 0 ? (
          <p className="text-gray-300">No bookings found</p>
        ) : (
          filteredServices.map((order) => (
            <Disclosure key={order._id}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="mt-3 flex justify-between w-full bg-gray-100 px-4 py-2 text-left text-lg font-medium text-black rounded-lg hover:bg-gray-200">
                    <div className="flex w-full justify-between">
                      {/* LEFT SECTION */}
                      <div className="w-1/2">
                        <p className="text-sm text-gray-500">
                          Booking ID: {order._id}
                        </p>

                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          <strong className="text-red-700">
                            {order.status}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-500">
                          Created At:{" "}
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* RIGHT SECTION */}
                      <div className="w-1/2 pl-6">
                        <p className="text-sm text-gray-500">
                          <strong>Date:</strong> {order.details.bookingdate}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Time Slot:</strong>{" "}
                          {order.details.bookingTime}
                        </p>
                        <div className="">
                          <p className="text-sm text-gray-500 font-semibold">
                            Equipments:{" "}
                            {order.details.selectedEquipments?.length > 0
                              ? order.details.selectedEquipments
                                  .map((eq) => eq.name)
                                  .join(", ")
                              : "All"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {order.details.requirements &&
                      order.details.requirements.length > 0 && (
                        <FaChevronUp
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } w-5 h-5 text-black self-center ml-4`}
                        />
                      )}
                  </Disclosure.Button>

                  <Disclosure.Panel className="px-4 mt-2 pt-4 pb-2 text-sm text-gray-700 bg-white rounded-lg shadow">
                    <div className="border-b py-2">
                      <span className="font-medium text-gray-800">
                        Requirements
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

export default FitnessFirst;
