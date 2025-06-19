import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DynamicForm from "../../../../components/commonComponent/CrudComponent/DynamicFormComponent";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// MUI & Time Picker
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AddMoviehallService = () => {
  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");
  const navigate = useNavigate();

  const [timeSlot, setTimeSlot] = useState(""); // current selected time
  const [showtimeslot, setShowTimeslot] = useState([]); // array of selected times
  const [foodItems, setFoodItems] = useState([
    { title: "", imageUrl: "", foodPrice: "" },
  ]);

  const handleFoodChange = (index, field, value) => {
    const updatedItems = [...foodItems];
    updatedItems[index][field] = value;
    setFoodItems(updatedItems);
  };

  const handleAddFoodItem = () => {
    setFoodItems([...foodItems, { title: "", imageUrl: "", foodPrice : ""}]);
  };

  const handleRemoveFoodItem = (index) => {
    const updatedItems = [...foodItems];
    updatedItems.splice(index, 1);
    setFoodItems(updatedItems);
  };

  const handleAddSlot = () => {
    if (timeSlot && !showtimeslot.includes(timeSlot)) {
      setShowTimeslot([...showtimeslot, timeSlot]);
      setTimeSlot("");
    }
  };

  const handleRemoveSlot = (slot) => {
    setShowTimeslot(showtimeslot.filter((t) => t !== slot));
  };
  // console.log("Selected time:", timeSlot);
  // console.log("Showtime slot array:", showtimeslot);  
  
  const handleFormSubmit = async (formData) => {
    if (showtimeslot.length === 0) {
      toast.error("Please add at least one show time slot");
      return;
    }

    if (
      foodItems.some((item) => !item.title || !item.imageUrl || !item.foodPrice)
    ) {
      toast.error("Please complete all food items");
      return;
    }
  
    
    try {
      const token = localStorage.getItem("token");

      const dataToSend = {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        showtimeslot,
        category,
        foodItems,
      };
      await axios.post("http://localhost:5000/admin/add-moviehall", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Movie added successfully!");
      navigate("/admin/booking/viewMoviehallService");
    } catch (error) {
      toast.error("Failed to add Movie item");
      console.error(error);
    }
  };

  const fields = [
    {
      name: "title",
      label: "Movie title",
      type: "text",
      required: true,
    },
    { name: "movieimage", label: "Info Image", type: "text" },
    {
      name: "totalSeats",
      label: "Total Seats",
      type: "number",
      required: true,
    },
    {
      name: "halltype",
      label: "Hall Type",
      type: "select",
      required: true,
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
    { name: "moviePrice", label: "Seat Price", type: "number" },
    { name: "movieDescription", label: "Movie Description", type: "tiptap" },
    {
      name: "category",
      type: "hidden",
      defaultValue: category,
      disabled: true,
    },
  ];

  return (
    <div className="p-8">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="mb-6 bg-white p-6 border rounded-xl shadow w-full">
        <label className="block mb-4 text-sm font-semibold text-gray-700">
          Select Show Time Slots
        </label>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <TimePicker
              label="Select Time"
              value={timeSlot ? dayjs(`2023-01-01T${timeSlot}`) : null}
              onChange={(newValue) => {
                if (newValue) {
                  const formattedTime = dayjs(newValue).format("HH:mm");
                  setTimeSlot(formattedTime);
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

        {/* Display Added Slots */}
        <div className="mt-4 flex flex-wrap gap-2">
          {showtimeslot.map((slot) => (
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
        <h2 className="text-sm font-semibold mb-4 text-gray-700">
          Add Food Items
        </h2>
        {foodItems.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Food Title"
              value={item.title}
              onChange={(e) => handleFoodChange(index, "title", e.target.value)}
              className="border p-2 w-full border-gray-300 rounded-lg focus:outline-none focus:ring text-black"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={item.imageUrl}
              onChange={(e) =>
                handleFoodChange(index, "imageUrl", e.target.value)
              }
              className="border p-2 w-full border-gray-300 rounded-lg focus:outline-none focus:ring text-black"
            />
            <input
              type="number"
              placeholder="Price"
              value={item.foodPrice}
              onChange={(e) =>
                handleFoodChange(index, "foodPrice", e.target.value)
              }
              className="border p-2 w-full border-gray-300 rounded-lg focus:outline-none focus:ring text-black"
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
      <DynamicForm
        fields={fields}
        onSubmit={handleFormSubmit}
        submitText="Save Movie"
      />
    </div>
  );
};

export default AddMoviehallService;
