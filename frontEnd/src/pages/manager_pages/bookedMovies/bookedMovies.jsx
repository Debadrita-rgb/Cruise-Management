import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { FaChevronUp } from "react-icons/fa";

const BookedMovies = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/manager/get-booked-movies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not OK");
        return res.json();
      })
      .then((data) => {
        setMovies(data);
        setFilteredMovies(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);
  //   console.log(movies);

  useEffect(() => {
    if (!selectedDate) {
      setFilteredMovies(movies);
    } else {
      const selected = selectedDate.toLocaleDateString("sv-SE"); // e.g., "2025-05-31"
      const filtered = movies.filter(
        (order) => order.details.date === selected
      );
      setFilteredMovies(filtered);
    }
  }, [selectedDate, movies]);

  return (
    <div className="p-6 text-white">
      <div className="mb-4">
        <label className="text-sm text-white mr-2 font-semibold border-amber-50">
          Filter by Date:
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="px-3 py-1 rounded text-white border border-amber-50"
          isClearable
          showPopperArrow={false}
        />
      </div>
      {/* <button
        onClick={() => setSelectedDate(null)}
        className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
      >
        Clear
      </button> */}

      {filteredMovies.length === 0 ? (
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
                        Voyager: {order.voyagerId?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Email: {order.voyagerId?.email || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status:{" "}
                        <strong className="text-red-700">{order.status}</strong>
                      </p>
                      <p className="text-sm text-gray-500">
                        Created At: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="w-1/2 pl-6">
                      {" "}
                      {/* added padding-left for spacing */}
                      <p className="text-sm text-gray-500">
                        <strong>Date:</strong> {order.details.date}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Time Slot:</strong> {order.details.timeSlotId}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Seats:</strong> {order.details.seats.join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* ICON (Chevron) */}
                  <FaChevronUp
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } w-5 h-5 text-black self-center ml-4`}
                  />
                </Disclosure.Button>

                <Disclosure.Panel className="px-4 mt-2 pt-4 pb-2 text-sm text-gray-700 bg-white rounded-lg shadow">
                  <div className="border-b py-2">
                    <span className="font-medium text-gray-800">
                      Food Items:
                    </span>
                    {order.details.foodItems.length > 0 ? (
                      <ul className="list-disc list-inside mt-1 text-sm">
                        {order.details.foodItems.map((item, idx) => (
                          <li key={idx}>
                            <span>
                              {item.title} - ₹{item.foodPrice}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No food items selected.</p>
                    )}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))
      )}
    </div>
  );
};

export default BookedMovies;
