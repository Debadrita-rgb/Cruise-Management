import { useLocation, useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../../../../../config";

const BookPartyhallForm = () => {
  const { state } = useLocation();
  const { hallId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: state?.userId || "",
    name: state?.name || "",
    email: state?.email || "",
    requirements: "",
    status: "booking",
    hallId: hallId,
    startTime: null,
    endTime: null,
    bookingdate: "",
    price: state?.price || "",
  });
  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formattedData = {
      ...formData,
      startTime: formData.startTime
        ? dayjs(formData.startTime).format("HH:mm")
        : null,
      endTime: formData.endTime
        ? dayjs(formData.endTime).format("HH:mm")
        : null,
    };
    // console.log("Data to be saved: ", formattedData);
    try {
      await axios.post(
        `${BASE_URL}/voyager/bookings-partyhall`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Booking submitted successfully!");
      setTimeout(() => {
        navigate("/booking/facilities/partyhall");
      }, 2000);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book hall.");
    }
  };

  return (
    <section className="px-6 md:px-16 py-16">
      <div className="flex items-center justify-center min-h-screen text-white">
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md border border-white/20 p-10 w-full max-w-3xl bg-gradient-to-br from-[#356381] to-[#8f8ec0]">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Hall Booking Form
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
                placeholder="Loading..."
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
                placeholder="Loading..."
              />
            </div>

            {/* date to held  */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Booking Date
              </label>
              <input
                id="bookingdate"
                type="date"
                placeholder="Enter your Booking Date"
                value={formData.bookingdate}
                onChange={(e) =>
                  setFormData({ ...formData, bookingdate: e.target.value })
                }
                required
                className="mt-2 block w-full rounded-md bg-white/20 px-3 py-2 text-white placeholder:text-white/70 focus:outline-none"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium">Start Time</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  value={formData.startTime}
                  onChange={(value) =>
                    setFormData({ ...formData, startTime: value })
                  }
                  className="mt-2 block w-full rounded-md bg-white/20 px-3 py-2 text-white focus:outline-none"
                />
              </LocalizationProvider>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium">End Time</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  value={formData.endTime}
                  onChange={(value) =>
                    setFormData({ ...formData, endTime: value })
                  }
                  className="mt-2 block w-full rounded-md bg-white/20 px-3 py-2 text-white focus:outline-none"
                />
              </LocalizationProvider>
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
                placeholder="Enter your requirements"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                required
                className="mt-2 block w-full rounded-md bg-white/20 px-3 py-2 text-white placeholder:text-white/70 focus:outline-none h-32"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="cursor-pointer w-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-2 font-semibold text-white hover:from-indigo-600 hover:to-purple-600"
              >
                Book Hall
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookPartyhallForm;
