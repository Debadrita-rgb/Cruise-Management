import React, { useState, useEffect } from "react";
import TableComponent from "../../../../components/commonComponent/CrudComponent/TableComponent";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../../../../config";

const feedback = () => {
  const [feedbackItems, setFeedbackItems] = useState([]);

  //show all data
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/admin/get-fullfeedback-details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFeedbackItems(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filteredItems = (feedbackItems || []).map((item, index) => ({
    Id: index + 1,
    Name: item.name,
    Email: item.email,
    id: item._id,
    isActive: item.isActive,
    viewPath: `/admin/view-feedback-details/${item._id}`,
  }));

  const handleToggleActive = async (id, isActive) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${BASE_URL}/admin/toggle-contact-status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive }),
        },
      );

      if (!res.ok) throw new Error("Toggle failed");

      setFeedbackItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isActive } : item)),
      );

      toast.success(
        `Feedback ${isActive ? "activated" : "deactivated"} successfully`,
      );
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };
  
  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <TableComponent
        title="Feedback"
        columns={["Id", "Name", "Email"]}
        data={filteredItems}
        showAddButton={false}
        showActionColumn={true}
        showActiveColumn={true}
        handleToggleActive={handleToggleActive}
      />
    </div>
  );
};

export default feedback;
