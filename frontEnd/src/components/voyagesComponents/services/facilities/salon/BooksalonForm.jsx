import React, { useState, useEffect, useLayoutEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../../../../../config";

const BooksalonForm = () => {
  const { state } = useLocation();
  const { salonId } = useParams();
  const navigate = useNavigate();

  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    userId: state?.userId || "",
    name: state?.name || "",
    email: state?.email || "",
    requirements: "",
    status: "booking",
    salonId: salonId,
    bookingTime: "",
    bookingdate: "",
    price: state?.price || "",
  });

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BASE_URL}/voyager/get-single-salon/${salonId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSalon(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch salon:", error);
        setLoading(false);
      }
    };

    fetchSalon();
  }, [salonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      bookingTime: formData.bookingTime,
    };

    try {
      await axios.post(
        `${BASE_URL}/voyager/bookings-salon`,
        formattedData
      );
        toast.success("Booking submitted successfully!");
        setTimeout(() => {
          navigate("/booking/facilities/salon");
        }, 2000);
      
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.error || "Failed to book salon. Try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white py-20">Loading Salon Info...</div>
    );
  }

  return (
    <section className="px-6 md:px-16 py-16 page-content">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md border border-white/20 p-10 w-full max-w-3xl bg-gradient-to-br from-[#356381] to-[#8f8ec0]">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Salon Booking Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                readOnly
                className="mt-2 block w-full rounded-md bg-white/20 px-3 py-2 text-white placeholder:text-white/70 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                readOnly
                className="mt-2 block w-full rounded-md bg-white/20 px-3 py-2 text-white placeholder:text-white/70 focus:outline-none"
              />
            </div>

            {/* Booking Date */}
            <div>
              <label
                htmlFor="bookingdate"
                className="block text-sm font-medium"
              >
                Booking Date
              </label>
              <input
                id="bookingdate"
                type="date"
                value={formData.bookingdate}
                onChange={(e) =>
                  setFormData({ ...formData, bookingdate: e.target.value })
                }
                required
                className="mt-2 block w-full rounded-md bg-white/20 px-3 py-2 text-white focus:outline-none"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label
                htmlFor="bookingTime"
                className="block text-sm font-medium"
              >
                Select Time Slot
              </label>
              <select
                id="bookingTime"
                value={formData.bookingTime}
                onChange={(e) =>
                  setFormData({ ...formData, bookingTime: e.target.value })
                }
                required
                className="mt-2 block w-full rounded-md bg-white/20 px-3 py-2 text-white focus:outline-none"
              >
                <option value="" className="text-black">
                  -- Select Slot --
                </option>
                {salon?.service?.map((slot) => (
                  <option
                    key={slot._id}
                    value={slot.serviceslot}
                    className="text-black"
                  >
                    {slot.serviceslot}
                  </option>
                ))}
              </select>
            </div>

            {/* Requirements */}
            <div>
              <label
                htmlFor="requirements"
                className="block text-sm font-medium"
              >
                Requirements
              </label>
              <textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                required
                className="mt-2 block w-full rounded-md bg-white/20 px-3 py-2 text-white h-32 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-2 font-semibold text-white hover:from-indigo-600 hover:to-purple-600 cursor-pointer"
              >
                Book Salon
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BooksalonForm;
