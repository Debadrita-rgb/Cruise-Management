import React, { useState, useEffect } from "react";
import TableComponent from "../../../../components/commonComponent/CrudComponent/TableComponent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from "axios";

const ViewFitnessService = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [categoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/admin/get-fitnesscategory-active", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleAddClick = (category) => {
    const token = localStorage.getItem("token");
    if (!token || token === "") {
      navigate("/login");
    } else {
      navigate(
        `/admin/booking/addFitnessService?category=${encodeURIComponent(
          category
        )}`
      );
    }
  };

  const handleCategoryClick = async (categoryName) => {
    setSelectedCategory(categoryName);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/admin/get-categorized-fitness",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter the services by selected category
      const filteredItems = response.data.filter(
        (item) => item.category === categoryName
      );

      setCategoryItems(filteredItems);
    } catch (error) {
      console.error("Error fetching fitness services:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const filteredItems = categoryItems
    .filter((item) =>
      (item.servicename || "")
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase())
    )
    .map((item, index) => ({
      Id: index + 1,
      ServiceName: item.servicename,
      id: item._id,
      isActive: item.isActive,
      editPath: `/admin/booking/editFitnessService/${item._id}`,
    }));

  const handleToggleActive = async (id, isActive) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/admin/toggle-fitness-status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive }),
        }
      );

      if (!res.ok) throw new Error("Toggle failed");

      setCategoryItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isActive } : item))
      );

      toast.success(
        `Service ${isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  // delete
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!id) {
      console.error("Invalid ID passed to delete.");
      toast.error("Invalid item selected for deletion.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/admin/delete-fitness/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setCategoryItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Service deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-10">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="relative cursor-pointer group"
            onClick={() => handleCategoryClick(cat.name)}
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="rounded-xl w-full h-48 object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white font-semibold text-lg bg-black/50 px-2 py-1 rounded">
              {cat.name}
            </div>

            {/* Add Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddClick(cat.name);
              }}
              className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 text-sm rounded cursor-pointer"
            >
              + Add
            </button>
          </div>
        ))}
      </div>

      {/* Show Table When Category Clicked */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          <span className="ml-4 text-blue-600 font-medium">
            Loading services...
          </span>
        </div>
      ) : (
        selectedCategory && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Services under : {selectedCategory}
            </h2>

            <TableComponent
              title={selectedCategory}
              columns={["Id", "ServiceName"]}
              data={filteredItems}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleToggleActive={handleToggleActive}
              handleDelete={handleDelete}
              showAddButton={false}
              // showEdit={true}
              // editPath="editLink"
            />
          </div>
        )
      )}
    </div>
  );
};

export default ViewFitnessService;
