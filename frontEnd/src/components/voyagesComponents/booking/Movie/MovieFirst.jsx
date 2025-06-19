import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Disclosure } from "@headlessui/react";
import { FaChevronUp } from "react-icons/fa";

const MovieFirst = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/voyager/get-booked-movie", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not OK");
        return res.json();
      })
      .then((data) => {
        const movieList = Array.isArray(data.orders) ? data.orders : [];
        setMovies(movieList);
        setFilteredMovies(movieList);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setFilteredMovies(movies);
    } else {
      const selected = selectedDate.toLocaleDateString("sv-SE"); 
      const filtered = movies.filter(
        (order) => order.details.date === selected
      );
      setFilteredMovies(filtered);
    }
  }, [selectedDate, movies]);

  return (
    <section className="px-6 md:px-16 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
        Movies Booking
      </h2>
      <div className="p-6 text-white rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md border border-white/20">
        <div className="mb-4">
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
        </div>

        {filteredMovies.length === 0 && selectedDate ? (
          <p className="text-gray-300">No bookings found for selected date.</p>
        ) : (
          filteredMovies.map((order) => (
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
                          Movie: {order.MovieName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          <strong className="text-red-700">
                            Booked
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
                          <strong>Date:</strong> {order.details.date}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Time Slot:</strong> {order.details.timeSlotId}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Seats:</strong>{" "}
                          {order.details.seats.join(", ")}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Total Price:</strong>{" "}
                          {order.details.totalPrice}
                        </p>
                      </div>
                    </div>
                    {order.details.foodItems &&
                      order.details.foodItems.length > 0 && (
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
                        Food Items:
                      </span>
                      {order.details.foodItems &&
                      order.details.foodItems.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-4">
                          {order.details.foodItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 border rounded-md p-2 shadow-sm bg-gray-50"
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <p className="font-semibold text-gray-700">
                                  {item.title}
                                </p>
                                <p className="text-gray-600">
                                  ₹{item.foodPrice} × {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-gray-600">
                          No food items selected.
                        </p>
                      )}
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

export default MovieFirst;
