import { useLocation, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../../../../../config";

const BookFitnessForm = () => {
  const { state } = useLocation();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [serviceDetails, setServiceDetails] = useState(null);

  const [formData, setFormData] = useState({
    userId: state?.userId || "",
    name: state?.name || "",
    email: state?.email || "",
    requirements: "",
    status: "booking",
    serviceId: serviceId,
    bookingTime: null,
    bookingdate: "",
    selectedEquipments: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchServiceDetails = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/voyager/get-single-fitness/${serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setServiceDetails(res.data);
      } catch (error) {
        console.error("Failed to fetch service details:", error);
        toast.error("Failed to load service details.");
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  const handleEquipmentChange = (e, equipment) => {
    const { checked } = e.target;

    setFormData((prevData) => {
      const updatedEquipments = checked
        ? [
            ...prevData.selectedEquipments,
            { id: equipment._id, name: equipment.title },
          ]
        : prevData.selectedEquipments.filter(
            (item) => item.id !== equipment._id
          );

      return { ...prevData, selectedEquipments: updatedEquipments };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formattedData = {
      ...formData,
      bookingTime: formData.bookingTime
        ? dayjs()
            .hour(parseInt(formData.bookingTime.split(":")[0]))
            .minute(parseInt(formData.bookingTime.split(":")[1]))
            .format("HH:mm")
        : null,
    };
    // console.log("Get Service details: ", formattedData);
    try {
      await axios.post(
        `${BASE_URL}/voyager/bookings-fitnessservice`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Booking submitted successfully!");
      setTimeout(() => {
        navigate("/booking/facilities/fitness");
      }, 2000);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book service.");
    }
  };

  if (!serviceDetails) {
    return <div>Loading...</div>;
  }

  return (
    <section className="px-6 md:px-16 py-16">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md border border-white/20 p-10 w-full max-w-3xl bg-gradient-to-br from-[#356381] to-[#8f8ec0]">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Fitness Service Booking Form
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

            {/* Booking Date */}
            <div>
              <label
                htmlFor="bookingdate"
                className="block text-sm font-medium"
              >
                Booking Date From
              </label>
              <input
                id="bookingdate"
                type="date"
                value={formData.bookingdate}
                onChange={(e) =>
                  setFormData({ ...formData, bookingdate: e.target.value })
                }
                required
                className="mt-2 block w-full rounded-md bg-white/20 px-3 py-2 text-white placeholder:text-white/70 focus:outline-none"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label htmlFor="timeSlot" className="block text-sm font-medium">
                Select Time Slot
              </label>
              <select
                id="timeSlot"
                value={formData.bookingTime}
                onChange={(e) =>
                  setFormData({ ...formData, bookingTime: e.target.value })
                }
                className="mt-2 block w-full rounded-md bg-white/20 px-3 py-2 text-white placeholder:text-white/70 focus:outline-none"
                required
              >
                <option value="" className="text-black">
                  Select Time
                </option>
                {serviceDetails.serviceslot?.map((slot, idx) => (
                  <option key={idx} value={slot} className="text-black">
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipments */}
            {serviceDetails.equipmentItems?.length > 0 && (
              <div>
                <label className="block text-sm font-medium">
                  Select Equipments
                </label>
                <div className="space-y-2 mt-2">
                  {serviceDetails.equipmentItems.map((equipment) => (
                    <div key={equipment._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={equipment._id}
                        value={equipment._id}
                        onChange={(e) => handleEquipmentChange(e, equipment)}
                        checked={formData.selectedEquipments.some(
                          (item) => item.id === equipment._id
                        )}
                      />
                      <label htmlFor={equipment._id} className="ml-2">
                        {equipment.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                className="mt-2 block w-full rounded-md bg-white/20 px-3 py-2 text-white placeholder:text-white/70 focus:outline-none h-32"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="cursor-pointer w-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-2 font-semibold text-white hover:from-indigo-600 hover:to-purple-600"
              >
                Book Service
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookFitnessForm;
