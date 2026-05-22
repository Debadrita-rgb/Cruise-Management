import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "../../../components/commonComponent/CrudComponent/DynamicFormComponent";
import BASE_URL from "../../../../config";

const AddCategory = () => {
  const navigate = useNavigate();

  const categoryFields = [
    { name: "name", label: "Category Name", type: "text" },
    { name: "image", label: "Image Link", type: "text" },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: ["Fitness", "Salon", "Movie"], // we'll handle dropdown rendering below
    },
  ];

  const handleAddCategory = async (data) => {
    const token = localStorage.getItem("token");
    // if (data.role === "MANAGER") {
    //   data.isActive = true;
    // }
    try {
      const res = await fetch(`${BASE_URL}/admin/add-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success("Category added successfully");
        navigate("/admin/view-all-category");
      } else {
        toast.error(json.error || "Failed to add Category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add Category");
    }
  };

  return (
    <div className="w-full px-10 py-8 ">
      <DynamicForm
        fields={categoryFields}
        onSubmit={handleAddCategory}
        submitText="Add Category"
      />
    </div>
  );
};

export default AddCategory;
