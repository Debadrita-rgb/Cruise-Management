import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../../../../config";
import DynamicForm from "../../../../components/commonComponent/CrudComponent/DynamicFormComponent";

const EditPartyhall = () => {
  const navigate = useNavigate();
  const { id: partyhallId } = useParams();

  const [initialData, setInitialData] = useState(null);
  const token = localStorage.getItem("token");
const [images, setImages] = useState([""]);

  // Handle image input changes
  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  // Add a new image input
  const addImage = () => {
    setImages([...images, ""]);
  };

  // Remove an image input
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };
  useEffect(() => {
    if (!partyhallId) return;

    fetch(`${BASE_URL}/admin/get-single-partyhall/${partyhallId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setInitialData({
          hallName: data.hallName || "",
          price: data.price || "",
          capacity: data.capacity || "",
          description: data.description || "",
        });
        setImages(data.images || []);
      })
      .catch((err) => {
        console.error("Error fetching item:", err);
        toast.error("Failed to load partyhall item.");
      });
  }, [partyhallId]);

  const handleSubmit = async (formData) => {
    try {
      const dataToSubmit = {
        ...formData,
        images,
      };
      const res = await fetch(
        `${BASE_URL}/admin/update-partyhall/${partyhallId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!res.ok) throw new Error("Update failed");
      toast.success("Party hall item updated successfully");
      navigate("/admin/booking/ViewpartyhallService");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed");
    }
  };

  const fields = [
    { name: "hallName", label: "Hall Name" },
    { name: "price", label: "Price", type: "number" },
    { name: "capacity", label: "Capacity", type: "text" },
    { name: "description", label: "Description", type: "tiptap" },
  ];

  // useEffect(() => {
  //   toast.success("Data Retrieved Successfully");
  // }, []);

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="mt-6 bg-white p-6 border rounded-xl shadow w-full">
        <label className="block mb-4 text-sm font-semibold text-gray-700">
          Add Images
        </label>

        {/* Image Inputs */}
        {images.map((image, index) => (
          <div key={index} className="flex gap-4 mb-4">
            <input
              type="text"
              value={image}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder="Image URL"
              className="p-2 border w-full border-gray-300 rounded-lg focus:outline-none focus:ring text-black"
            />
            
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="text-red-600 font-bold px-2 py-1"
            >
              −
            </button>
          </div>
        ))}

        {/* Add Image Button */}
        <button
          type="button"
          onClick={addImage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Image
        </button>
      </div>
      <div className="mt-5">
        {initialData ? (
          <DynamicForm
            fields={fields.map((f) => ({ ...f, value: initialData[f.name] }))}
            onSubmit={handleSubmit}
            submitText="Update Partyhall"
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default EditPartyhall;
