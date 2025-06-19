import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "../../../components/commonComponent/CrudComponent/DynamicFormComponent";

const EditCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/admin/get-single-category/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategory(data))
      .catch((err) => console.error("Error fetching Category:", err));
  }, [id]);

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/admin/update-category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error("Update failed");
      toast.success("Category updated successfully");
      navigate("/admin/view-all-category");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update failed");
    }
  };

  if (!category) return <div>Loading...</div>;

  const fields = [
    {
      name: "name",
      label: "Category Name",
      value: category.name,
    },
    {
      name: "image",
      label: "Image Link",
      value: category.image,
      type: "text",
    },
    {
      name: "type",
      label: "Type",
      value: category.type,
      type: "select",
      options: ["Fitness", "Salon", "Movie"],
    },
  ];

  return (
    <div className="p-6">
      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Update Category"
      />
    </div>
  );
};

export default EditCategory;
