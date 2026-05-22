import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../../../../config";
import DynamicForm from "../../../../components/commonComponent/CrudComponent/DynamicFormComponent";

const AddPartyhall = () => {
  const navigate = useNavigate();
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
  const fields = [
    { name: "hallName", label: "Hall Name" },
    { name: "price", label: "Price", type: "number" },
    { name: "capacity", label: "Capacity", type: "text" },
    { name: "description", label: "Description", type: "tiptap" },
  ];

  const handleFormSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (images.length === 0 || images.some((image) => !image.trim())) {
        toast.error("Please add at least one image URL.");
        return;
      }

      const dataToSubmit = {
        ...data,
        images,
      };
      await axios.post(
        `${BASE_URL}/admin/add-partyhall`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Partyhall added successfully!");
      navigate("/admin/booking/viewPartyhallService");
    } catch (error) {
      toast.error("Failed to add Partyhall item");
      console.error(error);
    }
  };
  

  return (
    <div className="w-full px-10 py-8 ">
      {/* Add Image Inputs Section */}
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
      
      <div className="mt-5 ">
      <DynamicForm
        fields={fields}
        onSubmit={handleFormSubmit}
        submitText="Add Partyhall"
      />
      </div>
    </div>
  );
};

export default AddPartyhall;
