import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DynamicForm from "../../../../components/commonComponent/CrudComponent/DynamicFormComponent";

// MUI Time Picker
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EditFitnessService = () => {
  const navigate = useNavigate();
  const { id: serviceId } = useParams();
  const token = localStorage.getItem("token");

  const [initialData, setInitialData] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [serviceslot, setServiceSlot] = useState([]);
  const [equipmentItems, setEquipmentItems] = useState([
    { title: "", imageUrl: "", trainerName: "" },
  ]);

  // Fetch existing service data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/admin/get-single-fitness/${serviceId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;
        setInitialData({
          servicename: data.servicename || "",
          serviceimage: data.serviceimage || "",
          price: data.price || "",
          servicedescription: data.servicedescription || "",
          category: data.category || "",
          trainer: data.trainer || "",
        });

        setServiceSlot(data.serviceslot || []);
        setEquipmentItems(data.equipmentItems || [{ title: "", imageUrl: "" }]);
      } catch (error) {
        console.error("Failed to fetch fitness service:", error);
        toast.error("Failed to load fitness service.");
      }
    };

    if (serviceId) fetchData();
  }, [serviceId, token]);

  const handleAddEquipment = () => {
    setEquipmentItems([
      ...equipmentItems,
      { title: "", imageUrl: "" },
    ]);
  };

  const handleRemoveEquipment = (index) => {
    const updatedItems = [...equipmentItems];
    updatedItems.splice(index, 1);
    setEquipmentItems(updatedItems);
  };

  const handleEquipmentChange = (index, field, value) => {
    const updatedItems = [...equipmentItems];
    updatedItems[index][field] = value;
    setEquipmentItems(updatedItems);
  };
  
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

  // Submit updated data
  const handleSubmit = async (formData) => {
    try {
      const updatedData = {
        ...formData,
        serviceslot,
        equipmentItems,
      };

      const res = await axios.put(
        `http://localhost:5000/admin/update-fitness/${serviceId}`,
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
        navigate("/admin/booking/viewFitnessService");
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
    {
      name: "serviceimage",
      label: "Image URL",
      type: "text",
    },
    {
      name: "price",
      label: "Price",
      type: "number",
    },
    {
      name: "servicedescription",
      label: "Description",
      type: "tiptap",
    },
    {
      name: "category",
      type: "hidden",
      disabled: true,
    },
  ];

  return (
    <div className="p-8">
      <ToastContainer position="top-right" autoClose={2000} />

      <h2 className="text-xl font-bold mb-4">Edit Fitness Service</h2>

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

      {/* Equipment Items Section */}
      <div className="mb-6 bg-white p-6 border rounded-xl shadow w-full">
        <label className="block mb-4 text-sm font-semibold text-gray-700">
          Equipment Items
        </label>

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

export default EditFitnessService;
