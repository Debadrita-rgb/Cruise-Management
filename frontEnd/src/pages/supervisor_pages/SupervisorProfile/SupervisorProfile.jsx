import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicForm from "../../../components/commonComponent/CrudComponent/DynamicFormComponent";
import { jwtDecode } from "jwt-decode";

const SupervisorProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const supervisor = jwtDecode(token);
    fetch(
      `http://localhost:5000/supervisor/get-single-supervisor/${supervisor.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem("token");
    const supervisor = jwtDecode(token);
    try {
      const res = await fetch(
        `http://localhost:5000/supervisor/update-supervisor/${supervisor.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error("Update failed");
      toast.success("Supervisor updated successfully");
      setTimeout(() => {
        window.location.href = "/supervisor/dashboard";
      }, 1500);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update failed");
    }
  };

  if (!user) return <div>Loading...</div>;

  const fields = [
    { name: "name", label: "Name", value: user.name, type: "text" },
    {
      name: "email",
      label: "Email",
      value: user.email,
      type: "email",
      readOnly: true,
    },
    {
      name: "password",
      label: "Password",
      value: user.password,
      type: "password",
    },
  ];

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={2000} />

      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Update Profile"
      />
    </div>
  );
};

export default SupervisorProfile;
