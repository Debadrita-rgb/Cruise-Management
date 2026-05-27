import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "../../../../components/commonComponent/CrudComponent/DynamicFormComponent";
import BASE_URL from "../../../../../config";

const AddBanner = () => {
  const navigate = useNavigate();

  const BannerFields = [
    { name: "page_banner_image", label: "Image Link", type: "text" },
    { name: "heading", label: "Heading", type: "text" },
    { name: "paragraph", label: "Paragraph", type: "text" },
    {
      name: "page_type",
      label: "Page Type",
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
      required: true,
    },
  ];

  const handleAddBanner = async (data) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/admin/add-banner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success("Banner added successfully");
        navigate("/admin/view-all-banner");
      } else {
        toast.error(json.error || "Failed to add Banner");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add Banner");
    }
  };

  return (
    <div className="w-full px-10 py-8 ">
      <DynamicForm
        fields={BannerFields}
        onSubmit={handleAddBanner}
        submitText="Add Banner"
      />
    </div>
  );
};

export default AddBanner;
// https://rare-gallery.com/thumbs/865036-School-Stationery-Scissors-Pencils-Ballpoint-pen.jpg
