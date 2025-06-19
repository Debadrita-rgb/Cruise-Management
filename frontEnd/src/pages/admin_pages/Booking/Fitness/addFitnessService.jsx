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

const AddFitnessService = () => {
  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");
  const navigate = useNavigate();

  const [timeSlot, setTimeSlot] = useState(""); // current selected time
  const [serviceslot, setServiceSlot] = useState([]); // array of selected times
  const [equipmentItems, setEquipmentItems] = useState([
    { title: "", imageUrl: "" },
  ]);

  const handleEquipmentChange = (index, field, value) => {
    const updatedItems = [...equipmentItems];
    updatedItems[index][field] = value;
    setEquipmentItems(updatedItems);
  };

  const handleAddEquipment = () => {
    setEquipmentItems([...equipmentItems, { title: "", imageUrl: "" }]);
  };

  const handleRemoveEquipment = (index) => {
    const updatedItems = [...equipmentItems];
    updatedItems.splice(index, 1);
    setEquipmentItems(updatedItems);
  };

  const handleAddSlot = () => {
    if (timeSlot && !serviceslot.includes(timeSlot)) {
      setServiceSlot([...serviceslot, timeSlot]);
      setTimeSlot("");
    }
  };

  const handleRemoveSlot = (slot) => {
    setServiceSlot(serviceslot.filter((t) => t !== slot));
  };

  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const dataToSend = {
        ...formData,
        serviceslot,
        category,
        equipmentItems,
      };

      await axios.post("http://localhost:5000/admin/add-fitness", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Service added successfully!");
      navigate("/admin/booking/viewFitnessService");
    } catch (error) {
      toast.error("Failed to add Service item");
      console.error(error);
    }
  };

  const fields = [
    {
      name: "servicename",
      label: "Service Name",
      type: "text",
      required: true,
    },
    {
      name: "trainer",
      label: "Trainer Name",
      type: "text",
      required: true,
    },
    { name: "serviceimage", label: "Image", type: "text" },
    { name: "price", label: "Price", type: "number" },
    { name: "servicedescription", label: "Description", type: "tiptap" },
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

      <h2 className="text-xl font-bold mb-4">Add New Service</h2>

      {/* Service Slots Section */}
      <div className="mb-6 bg-white p-6 border rounded-xl shadow w-full">
        <label className="block mb-4 text-sm font-semibold text-gray-700">
          Select Service Slots
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

        {/* Display Added Slots */}
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
      {/* Equipment Items Section */}
      <div className="mb-6 bg-white p-6 border rounded-xl shadow w-full">
        <h3 className="text-sm font-semibold mb-4 text-gray-700">
          Equipment Items
        </h3>

        {equipmentItems.map((item, index) => (
          <div
            key={index}
            className="mb-4 flex flex-col md:flex-row gap-4 items-center"
          >
            <input
              type="text"
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                handleEquipmentChange(index, "title", e.target.value)
              }
              className="p-2 border w-full border-gray-300 rounded-lg focus:outline-none focus:ring text-black"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={item.imageUrl}
              onChange={(e) =>
                handleEquipmentChange(index, "imageUrl", e.target.value)
              }
              className="p-2 border w-full border-gray-300 rounded-lg focus:outline-none focus:ring text-black"
            />
            <button
              type="button"
              onClick={() => handleRemoveEquipment(index)}
              className="text-red-600 font-bold px-2 py-1"
            >
              −
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddEquipment}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Equipment
        </button>
      </div>

      {/* Dynamic Form */}
      <DynamicForm
        fields={fields}
        onSubmit={handleFormSubmit}
        submitText="Save Service"
      />
    </div>
  );
};

export default AddFitnessService;
