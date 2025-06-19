import React, { useState, useEffect } from "react";
import TableComponent from "../../../../components/commonComponent/CrudComponent/TableComponent";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const contact = () => {
  const [contactItems, setContactItems] = useState([]);

  //show all data
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/admin/get-contact", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setContactItems(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filteredItems = (contactItems || []).map((item, index) => ({
    Id: index + 1,
    Name: item.name,
    Email: item.email,
    Message: item.message,
    id: item._id,
    isActive: item.isActive,
    editPath: false,
  }));

  
  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <TableComponent
        title="Contact"
        columns={["Id", "Name", "Email", "Message"]}
        data={filteredItems}
        showAddButton={false}
        showActionColumn={false}
        showActiveColumn={false}
      />
    </div>
  );
};

export default contact;
