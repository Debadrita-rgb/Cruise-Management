import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "../../../../components/commonComponent/CrudComponent/DynamicFormComponent";
import BASE_URL from "../../../../../config";

const EditBanner = () => {
  const { id } = useParams(); 
  const [banner, setBanner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/admin/get-single-banner/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBanner(data))
      .catch((err) => console.error("Error fetching Banner:", err));
  }, [id]);

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/admin/update-banner/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error("Update failed");
      toast.success("Banner updated successfully");
      navigate("/admin/view-all-banner");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update failed");
    }
  };

  if (!banner) return <div>Loading...</div>;

  const fields = [
    {
      name: "heading",
      label: "Heading",
      value: banner.heading,
      type: "text",
    },
    {
      name: "paragraph",
      label: "Paragraph",
      value: banner.paragraph,
      type: "text",
    },
    {
      name: "page_banner_image",
      label: "Image Link",
      value: banner.page_banner_image,
      type: "text",
    },
    {
      name: "page_type",
      label: "Type",
      value: banner.page_type,
      type: "select",
      options: [
        "catering",
        "movies",
        "stationary",
        "salonCategory",
        "fitnessCategory",
        "partyhall",
        "testimonial",
        "contact",
        "feedback",
        "faq",
        "about",
      ],
    },
  ];

  return (
    <div className="p-6">
      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Update Banner"
      />
    </div>
  );
};

export default EditBanner;
