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

const AddSalonService = () => {
  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");
  const navigate = useNavigate();
  const [timeSlot, setTimeSlot] = useState(""); // current selected time
  const [serviceslot, setServiceSlot] = useState([]); // array of selected times
  const [serviceItems, setServiceItems] = useState([
    { serviceslot: "", serviceprovidecount: "" },
  ]);

  const handleServiceChange = (index, field, value) => {
    const updatedItems = [...serviceItems];
    updatedItems[index][field] = value;
    setServiceItems(updatedItems);
  };

  const handleAddService = () => {
    setServiceItems([
      ...serviceItems,
      { serviceslot: "", serviceprovidecount: "" },
    ]);
  };

  const handleRemoveService = (index) => {
    const updatedItems = [...serviceItems];
    updatedItems.splice(index, 1);
    setServiceItems(updatedItems);
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
        category: category,
        service: serviceItems,
      };
      await axios.post(
        "http://localhost:5000/admin/add-beauty-salon",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Service added successfully!");
      navigate("/admin/booking/viewSalonService");
    } catch (error) {
      toast.error("Failed to add Service item");
      console.error(error);
    }
  };

  const fields = [
    {
      name: "serviceName",
      label: "Service Name",
      type: "text",
      required: true,
    },
    { name: "serviceimage", label: "Image", type: "text" },
    { name: "servicetime", label: "Service Time", type: "text" },
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
      <div className="mb-6 bg-white p-6 border rounded-xl shadow w-full">
        <h3 className="text-sm font-semibold mb-4 text-gray-700">
          Service Timings and Provide Count
        </h3>

        {serviceItems.map((item, index) => (
          <div
            key={index}
            className="mb-4 flex flex-col md:flex-row gap-4 items-center"
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Select Time"
                value={
                  item.serviceslot
                    ? dayjs(`2023-01-01T${item.serviceslot}`)
                    : null
                }
                onChange={(newValue) => {
                  if (newValue) {
                    handleServiceChange(
                      index,
                      "serviceslot",
                      newValue.format("HH:mm")
                    );
                  }
                }}
                sx={{
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                }}
              />
            </LocalizationProvider>

            <input
              type="text"
              placeholder="Service Provide Count"
              value={item.serviceprovidecount}
              onChange={(e) =>
                handleServiceChange(
                  index,
                  "serviceprovidecount",
                  e.target.value
                )
              }
              className="p-2 border w-full border-gray-300 rounded-lg focus:outline-none focus:ring text-black"
            />
            <button
              type="button"
              onClick={() => handleRemoveService(index)}
              className="text-red-600 font-bold px-2 py-1"
            >
              −
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddService}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add service
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Add New Service</h2>
      <DynamicForm
        fields={fields}
        onSubmit={handleFormSubmit}
        submitText="Save Service"
      />
    </div>
  );
};

export default AddSalonService;
