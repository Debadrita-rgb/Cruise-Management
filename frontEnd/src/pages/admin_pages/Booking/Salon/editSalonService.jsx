import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "../../../../components/commonComponent/CrudComponent/DynamicFormComponent";
import axios from "axios";
import BASE_URL from "../../../../../config";

// MUI & Time Picker
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EditCatering = () => {
  const navigate = useNavigate();
  const { id: serviceId } = useParams();

  const [initialData, setInitialData] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
    const [serviceslot, setServiceSlot] = useState([]);
  const [serviceItems, setServiceItems] = useState([
      { serviceslot: "", serviceprovidecount: "" },
    ]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!serviceId) return;

    fetch(`${BASE_URL}/admin/get-single-beauty-salon/${serviceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setInitialData({
          serviceName: data.serviceName || "",
          serviceimage: data.serviceimage || "",
          servicetime: data.servicetime || "",
          price: data.price || "",
          servicedescription: data.servicedescription || "",
        });
        setServiceItems(
          data.service || [{ serviceslot: "", serviceprovidecount: "" }]
        );

      })
      .catch((err) => {
        console.error("Error fetching item:", err);
        toast.error("Failed to load service item.");
      });
  }, [serviceId]);

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

  const handleSubmit = async (formData) => {
    try {
      const updatedData = {
        ...formData,
        service: serviceItems,
      };

      const res = await axios.put(
        `${BASE_URL}/admin/update-beauty-salon/${serviceId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Service item updated successfully");
        navigate("/admin/booking/viewSalonService");
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed");
    }
  };
  

  const fields = [
    {
      name: "serviceName",
      label: "Service Name",
      placeholder: "Enter Service name",
    },
    {
      name: "serviceimage",
      label: "Image Link",
      placeholder: "Enter image URL",
    },
    { name: "servicetime", label: "Service Time", type: "text" },
    {
      name: "price",
      label: "Price",
      placeholder: "Enter price",
      type: "number",
    },
    {
      name: "servicedescription",
      label: "Description",
      type: "tiptap",
      placeholder: "Write a description...",
      rows: 5,
    },
  ];

  // useEffect(() => {
  //   toast.success("Data Retrieved Successfully");
  // }, []);

  return (
    <div className="p-6">
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
      {initialData ? (
        <DynamicForm
          fields={fields.map((f) => ({ ...f, value: initialData[f.name] }))}
          onSubmit={handleSubmit}
          submitText="Update service"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditCatering;
