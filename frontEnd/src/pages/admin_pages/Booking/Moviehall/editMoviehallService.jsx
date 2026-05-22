import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BASE_URL from "../../../../../config";
import DynamicForm from "../../../../components/commonComponent/CrudComponent/DynamicFormComponent";

// MUI Time Picker
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EditMoviehallService = () => {
  const navigate = useNavigate();
  const { id: serviceId } = useParams();
  const token = localStorage.getItem("token");

  const [initialData, setInitialData] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [serviceslot, setServiceSlot] = useState([]);
  const [foodItems, setFoodItems] = useState([
    { title: "", imageUrl: "", foodPrice: "" },
  ]);

  // Fetch existing service data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/admin/get-single-moviehall/${serviceId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;
        setInitialData({
          title: data.title || "",
          movieimage: data.movieimage || "",
          totalSeats: data.totalSeats || 0,
          halltype: data.halltype || "",
          category: data.category || "",
          language: data.language || "",
          totalTiming: data.totalTiming || "",
          // posterUrl: data.posterUrl || "",
          releasedDate: data.releasedDate ? data.releasedDate.slice(0, 10) : "",
          moviePrice: data.moviePrice || "",
          movieDescription: data.movieDescription || "",
        });

        setServiceSlot(data.showtimeslot || []);
        setFoodItems(
          data.foodItems || [{ title: "", imageUrl: "", foodPrice: "" }]
        );
      } catch (error) {
        console.error("Failed to fetch Moviehall service:", error);
        toast.error("Failed to load Moviehall service.");
      }
    };

    if (serviceId) fetchData();
  }, [serviceId, token]);

  // Add new time slot
  const handleAddSlot = () => {
    if (timeSlot && !serviceslot.includes(timeSlot)) {
      setServiceSlot([...serviceslot, timeSlot]);
      setTimeSlot("");
    }
  };

  // Remove time slot
  const handleRemoveSlot = (slot) => {
    setServiceSlot(serviceslot.filter((t) => t !== slot));
  };
  const handleFoodChange = (index, field, value) => {
    const updatedItems = [...foodItems];
    updatedItems[index][field] = value;
    setFoodItems(updatedItems);
  };
  const handleAddFoodItem = () => {
    setFoodItems([...foodItems, { title: "", imageUrl: "", foodPrice: "" }]);
  };

  const handleRemoveFoodItem = (index) => {
    const updatedItems = [...foodItems];
    updatedItems.splice(index, 1);
    setFoodItems(updatedItems);
  };
  // Submit updated data
  const handleSubmit = async (formData) => {
    try {
      const updatedData = {
        ...formData,
        showtimeslot: serviceslot,
        foodItems: foodItems,
      };

      const res = await axios.put(
        `${BASE_URL}/admin/update-moviehall/${serviceId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Service updated successfully!");
        navigate("/admin/booking/viewMoviehallService");
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed");
    }
  };

  const fields = [
    {
      name: "title",
      label: "Movie Name",
      type: "text",
      required: true,
    },
    {
      name: "movieimage",
      label: "Image URL",
      type: "text",
    },
    {
      name: "totalSeats",
      label: "Total Seats",
      type: "number",
    },
    {
      name: "halltype",
      label: "Hall type",
      type: "select",
      options: ["Single-Screen", "Multiplex", "IMAX", "3D", "4DX"],
    },
    {
      name: "releasedDate",
      label: "Released Date",
      type: "date",
      required: true,
    },
    {
      name: "language",
      label: "Movie Language",
      type: "text",
      required: true,
    },
    {
      name: "totalTiming",
      label: "Movie Timing",
      type: "text",
      required: true,
    },
    // { name: "posterUrl", label: "Poster Url", type: "text" },
    { name: "moviePrice", label: "Movie Price", type: "number" },
    { name: "movieDescription", label: "Movie Description", type: "tiptap" },
    {
      name: "category",
      type: "hidden",
      disabled: true,
    },
  ];

  return (
    <div className="p-8">
      <ToastContainer position="top-right" autoClose={2000} />

      <h2 className="text-xl font-bold mb-4">Edit Moviehall Service</h2>

      {/* Time Slot Section */}
      <div className="mb-6 bg-white p-6 border rounded-xl shadow w-full">
        <label className="block mb-4 text-sm font-semibold text-gray-700">
          Update Service Slots
        </label>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <TimePicker
              label="Select Time"
              value={timeSlot ? dayjs(`2023-01-01T${timeSlot}`) : null}
              onChange={(newValue) => {
                if (newValue) {
                  setTimeSlot(newValue.format("HH:mm"));
                }
              }}
              sx={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: "0.5rem",
              }}
            />

            <button
              type="button"
              onClick={handleAddSlot}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 self-start"
            >
              Add Time
            </button>
          </div>
        </LocalizationProvider>

        <div className="mt-4 flex flex-wrap gap-2">
          {serviceslot.map((slot) => (
            <div
              key={slot}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {slot}
              <button
                onClick={() => handleRemoveSlot(slot)}
                className="text-red-500 font-bold text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6 bg-white p-6 border rounded-xl shadow w-full">
        <h2 className="text-sm font-semibold mb-4 text-gray-700">Food Items</h2>
        {foodItems.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Food Title"
              value={item.title}
              onChange={(e) => handleFoodChange(index, "title", e.target.value)}
              className="border p-2 w-full rounded-lg focus:outline-none focus:ring text-black"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={item.imageUrl}
              onChange={(e) =>
                handleFoodChange(index, "imageUrl", e.target.value)
              }
              className="border p-2 w-full rounded-lg focus:outline-none focus:ring text-black"
            />
            <input
              type="number"
              placeholder="Price"
              value={item.foodPrice}
              onChange={(e) =>
                handleFoodChange(index, "foodPrice", e.target.value)
              }
              className="border p-2 w-full rounded-lg focus:outline-none focus:ring text-black"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddFoodItem}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                +
              </button>
              {foodItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFoodItem(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  -
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Form */}
      {initialData ? (
        <DynamicForm
          fields={fields.map((f) => ({ ...f, value: initialData[f.name] }))}
          onSubmit={handleSubmit}
          submitText="Update Service"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditMoviehallService;
