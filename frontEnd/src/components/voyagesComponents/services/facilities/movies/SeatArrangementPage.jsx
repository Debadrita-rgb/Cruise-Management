// SeatArrangementPage.jsx
import React, { useState, useEffect } from "react";
import { useParams,useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../../../../../config";

const SeatArrangementPage = () => {
  const { movieId } = useParams();
  const location = useLocation();
  const { selectedDate, selectedTimeSlot, seatCount } = location.state || {};

  const [movie, setMovie] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showFoodSection, setShowFoodSection] = useState(false);
  const [foodSelection, setFoodSelection] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) {
        console.warn("movieId is missing, skipping fetch");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BASE_URL}/voyager/get-single-movie/${movieId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMovie(res.data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };

    fetchMovie();
  }, [movieId]);


  useEffect(() => {
    if (!movieId || !selectedDate || !selectedTimeSlot) return;

    const fetchBookedSeats = async () => {
      try {
        const token = localStorage.getItem("token");

        // Extract time or id depending on your slot structure
        const timeSlotId =
          selectedTimeSlot.time || selectedTimeSlot.id || selectedTimeSlot;

        const res = await axios.get(
          `${BASE_URL}/voyager/get-booked-seats/${movieId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              date: selectedDate,
              timeSlotId: timeSlotId,
            },
          }
        );
        setBookedSeats(res.data.bookedSeats || []);
        setSelectedSeats([]); // reset selected seats on new fetch
      } catch (error) {
        console.error("Failed to fetch booked seats:", error);
      }
    };

    fetchBookedSeats();
  }, [movieId, selectedDate, selectedTimeSlot]);


  const toggleSeat = (seatNum) => {
    if (selectedSeats.includes(seatNum)) {
      // Deselect if already selected
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNum));
    } else {
      if (selectedSeats.length < seatCount) {
        // Still have room, just add
        setSelectedSeats([...selectedSeats, seatNum]);
      } else {
        // Already full, replace the first one
        const newSelected = [...selectedSeats.slice(1), seatNum];
        setSelectedSeats(newSelected);
      }
    }
  };

  const toggleFood = (foodId) => {
      if (!Array.isArray(foodSelection)) {
        console.error("foodSelection is not an array:", foodSelection);
        return;
      }
  
      const exists = foodSelection.find((f) => f._id === foodId);
      const food = movie.foodItems.find((f) => f._id === foodId);
  
      if (exists) {
        setFoodSelection(foodSelection.filter((f) => f._id !== foodId));
      } else if (food) {
        setFoodSelection([...foodSelection, { ...food, quantity: 1 }]);
      }
    };
  
    const incrementQuantity = (item) => {
      setFoodSelection((prev) =>
        prev.map((f) =>
          f._id === item._id ? { ...f, quantity: (f.quantity || 1) + 1 } : f
        )
      );
    };
  
    const decrementQuantity = (itemId) => {
      setFoodSelection((prev) => {
        const updated = prev
          .map((f) =>
            f._id === itemId ? { ...f, quantity: (f.quantity || 1) - 1 } : f
          )
          .filter((f) => f.quantity > 0);
        return updated;
      });
    };
  
    useEffect(() => {
      const foodTotal = foodSelection.reduce(
        (sum, f) => sum + (f.foodPrice || 0) * (f.quantity || 1),
        0
      );
      const seatsTotal = seatCount * (movie?.moviePrice || 0);
      setTotalPrice(seatsTotal + foodTotal);
    }, [seatCount, foodSelection, movie]);
  
    const handleBooking = () => {
      const token = localStorage.getItem("token");
      const user = jwtDecode(token);
      axios
        .post(
          `${BASE_URL}/voyager/book-movie`,
          {
            movieId,
            date: selectedDate,
            timeSlotId: selectedTimeSlot,
            seats: selectedSeats,
            userId: user.id,
            foodItems: foodSelection,
            totalPrice,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          toast.success("Booking submitted successfully!");
                setTimeout(() => {
                  navigate("/booking/facilities/movies");
                }, 2000);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.error || " Booking failed. Please try again."
          );
        });
    };
  
    const seatPrice = movie?.moviePrice || 0;
    const totalSeats = movie?.totalSeats || 0;
    const seatsPerRow = 20;
    const totalRows = Math.ceil(totalSeats / seatsPerRow);

    const handleConfirmSelection = () => {
      console.log(`Seats selected: ${selectedSeats.join(", ")}`);
      setShowFoodSection(true);
    };

  return (
    <section className="px-6 md:px-16 py-16 relative">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex justify-between items-center mb-12">
        <div className="text-xl font-bold text-black bg-cyan-400 hover:bg-cyan-500 px-4 py-2 rounded-xl shadow-lg fixed right-6 top-28 z-50">
          Total Price: ₹
          {seatCount * seatPrice +
            foodSelection.reduce(
              (sum, item) => sum + item.foodPrice * item.quantity,
              0
            )}
        </div>
      </div>
      <div className="mb-6 bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-md shadow-2xl">
        {!movie ? (
          <p className="text-white text-center">Loading movie details...</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Select {seatCount} Seats
            </h2>
            <div className="space-y-4">
              {[...Array(totalRows)].map((_, rowIndex) => {
                const rowStart = rowIndex * seatsPerRow;

                return (
                  <div key={rowStart} className="grid grid-cols-22 gap-2">
                    {/* Left block (first 10 seats) */}
                    {[...Array(10)].map((_, i) => {
                      const seatNum = rowStart + i + 1;
                      if (seatNum > totalSeats) return null;
                      return renderSeatButton(seatNum);
                    })}
                    <div className="col-span-2" /> {/* aisle gap */}
                    {/* Right block (next 10 seats) */}
                    {[...Array(10)].map((_, i) => {
                      const seatNum = rowStart + 10 + i + 1;
                      if (seatNum > totalSeats) return null;
                      return renderSeatButton(seatNum);
                    })}
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex gap-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-xl"
                disabled={selectedSeats.length !== parseInt(seatCount)}
                onClick={handleConfirmSelection}
              >
                Confirm Selection
              </button>
              <a
                href={`/services/facilities/movies/book-movie/${movieId}`}
                className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-xl shadow-lg cursor-pointer"
              >
                Back
              </a>
            </div>

            {showFoodSection && (
              <div className="mt-8 p-4 bg-yellow-100 rounded-lg shadow-inner">
                <h3 className="text-xl font-bold mb-2 text-black">
                  🍿 Select Your Snacks
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {movie.foodItems.map((item) => {
                    const isSelected = foodSelection.some(
                      (f) => f._id === item._id
                    );
                    const currentItem = foodSelection.find(
                      (f) => f._id === item._id
                    );
                    return (
                      <div
                        key={item._id}
                        className="p-3 bg-white/20 rounded-lg flex items-center gap-4 mb-4"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-16 rounded-lg"
                        />
                        <div>
                          <h4 className="text-black">{item.title}</h4>
                          <p className="text-black">₹{item.foodPrice}</p>
                          <button
                            onClick={() => toggleFood(item._id)}
                            className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-1 px-4 rounded-xl shadow-lg"
                          >
                            {isSelected ? "Remove" : "Add"}
                          </button>
                        </div>
                        {isSelected && (
                          <div className="ml-auto flex items-center gap-2">
                            <button
                              onClick={() => decrementQuantity(item._id)}
                              className="bg-cyan-500 px-2 text-black"
                            >
                              -
                            </button>
                            <span className="text-black">
                              {currentItem?.quantity || 1}
                            </span>
                            <button
                              onClick={() => incrementQuantity(item)}
                              className="bg-cyan-500 px-2 text-black"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={showModal}
                    className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-xl shadow-lg cursor-pointer"
                  >
                    Proceed to Confirmation
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSeats([]);
                      setFoodSelection([]); // Clear food items
                    }}
                    className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-xl shadow-lg cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {isModalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl p-6 w-full max-w-4xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl relative">
                  <button
                    onClick={closeModal}
                    className="absolute top-3 right-5 text-gray-500 hover:text-gray-700"
                  >
                    ✖
                  </button>
                  <h3 className="text-black text-xl font-bold mb-4">
                    Booking Summary
                  </h3>
                  <p className="text-black">Movie: {movie.title}</p>
                  <p className="text-black">Date: {selectedDate}</p>
                  <p className="text-black">
                    Seats: {selectedSeats.join(", ")}
                  </p>
                  <p className="text-black">
                    Seat Price: ₹{seatCount} x ₹{seatPrice} = ₹
                    {seatCount * seatPrice}
                  </p>
                  {foodSelection.length > 0 && (
                    <>
                      <p className="text-black">
                        Food Items:{" "}
                        {foodSelection
                          .map((f) => `${f.title} x${f.quantity}`)
                          .join(", ")}
                      </p>
                      <p className="text-black">
                        Food Price: ₹
                        {foodSelection.reduce(
                          (sum, item) => sum + item.foodPrice * item.quantity,
                          0
                        )}
                      </p>
                    </>
                  )}
                  <p className="mt-4 text-black text-xl font-bold">
                    Total Price: ₹
                    {seatCount * seatPrice +
                      foodSelection.reduce(
                        (sum, item) => sum + item.foodPrice * item.quantity,
                        0
                      )}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <button
                      onClick={closeModal}
                      className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-xl shadow-lg cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleBooking}
                      className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-xl shadow-lg cursor-pointer"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
  function renderSeatButton(seatNum) {
    const isBooked = bookedSeats.includes(seatNum);
    const isSelected = selectedSeats.includes(seatNum);
    return (
      <button
        key={seatNum}
        // disabled={isBooked}
        onClick={() => !isBooked && toggleSeat(seatNum)}
        className={`w-12 h-12 rounded-full text-sm font-bold shadow-md 
          ${
            isBooked
              ? "bg-gray-500 cursor-not-allowed"
              : isSelected
              ? "bg-green-400"
              : "bg-white hover:bg-green-500 text-black cursor-pointer"
          }`}
      >
        {seatNum}
      </button>
    );
  }
};

export default SeatArrangementPage;
