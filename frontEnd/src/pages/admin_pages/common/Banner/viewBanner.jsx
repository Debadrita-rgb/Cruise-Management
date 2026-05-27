import React, { useState, useEffect } from "react";
import TableComponent from "../../../../components/commonComponent/CrudComponent/TableComponent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import BASE_URL from "../../../../../config";

const ViewBanner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/admin/get-banner`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBanner(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);
  
  const formatType = (page_type) => {
    switch (page_type) {
      case "stationary":
        return "Stationary";
      case "movies":
        return "Movies";
      case "faq":
        return "FAQ";
      case "testimonial":
        return "Testimonial";
      case "contact":
        return "Contact";
      case "salonCategory":
        return "Beauty Salon";
      case "fitnessCategory":
        return "Fitness";
      case "partyhall":
        return "Party Hall";
      case "catering":
        return "Catering";
      case "about":
        return "About";
      case "feedback":
        return "Feedback";
     
      default:
        return page_type;
    }
  };
  
  const filteredItems = (banner || [])
    .filter((item) =>
      item.page_type?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .map((item, index) => {
      return {
        Id: index + 1,
        Page_Type: formatType(item.page_type),
        id: item._id,
        editPath: `/admin/edit-banner/${item._id}`,
      };
    });

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={2000} />

      <div>
        <TableComponent
          title="Banner"
          columns={["Id", "Page_Type"]}
          data={filteredItems}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showActiveColumn={false}
          showAddButton={false}
          addPath="/admin/add-banner"
          showRecommendedeColumn={false}
          showDeleteButton={false}
        />
      </div>
    </div>
  );
};

export default ViewBanner;
