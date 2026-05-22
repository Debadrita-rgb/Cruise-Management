import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Disclosure } from "@headlessui/react";
import { FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../../config";

const bookedSalon = () => {
  const [salon, setSalon] = useState([]);
  const [activeTab, setActiveTab] = useState("Booking"); 
  const navigate = useNavigate();
  const [salonBookings, setSalonBookings] = useState([]);
  const [acceptedSalon, setAcceptedSalon] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/manager/get-booked-salon`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not OK");
        return res.json();
      })
      .then((data) => {
        setSalonBookings(data.bookings || []);
        setAcceptedSalon(data.accepted || []);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const acceptOrder = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${BASE_URL}/manager/accept-salon-order/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Order accepted!");
        // Update local state: set status to 'Accepted'
        setSalonBookings((prev) => prev.filter((order) => order._id !== id));

        // Add to accepted list
        const acceptedOrder = salonBookings.find(
          (order) => order._id === id
        );
        if (acceptedOrder) {
          setAcceptedSalon((prev) => [
            ...prev,
            { ...acceptedOrder, status: "Accepted" },
          ]);
        }

        setActiveTab("Accepted");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Accept order error:", err);
      toast.error("Server error");
    }
  };

  const filteredOrders =
    activeTab === "Booking" ? salonBookings : acceptedSalon;

    // const filteredOrders = salon.filter(
    //   (order) =>
    //     order.status === (activeTab === "Booking" ? "Booking" : "Accepted")
    // );

  return (
    <div className="p-6 text-white">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "Booking"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveTab("Booking")}
        >
          Booking
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "Accepted"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveTab("Accepted")}
        >
          Accepted
        </button>
      </div>

      {/* Booking List */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-300">No {activeTab} orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <Disclosure key={order._id}>
            {({ open }) => (
              <>
                <Disclosure.Button className="mt-3 flex justify-between w-full bg-gray-100 px-4 py-2 text-left text-lg font-medium text-black rounded-lg hover:bg-gray-200">
                <div className="flex w-full justify-between">
                    {/* LEFT SECTION */}
                    <div className="w-1/2">
                    <p className="text-sm text-gray-500">
                      Booking ID: {order._id}
                    </p>
                    <p className="text-sm text-gray-500">
                      Voyager Name: {order.voyagerId?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Voyager Email: {order.voyagerId?.email || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status:{" "}
                      <strong className="text-red-700">{order.status}</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      Created At: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-1/2 pl-6">
                    <p className="text-sm text-gray-500">
                      <strong>Booking Date:</strong> {order.details.bookingdate}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Booking Time:</strong> {order.details.bookingTime}
                    </p>

                    <p className="text-sm text-gray-500">
                      <strong>Service Name:</strong> {order.details.salonName || "N/A"}
                    </p>
                  </div>
                  </div>
                  <FaChevronUp
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } w-5 h-5 text-black self-center ml-4`}
                  />
                </Disclosure.Button>

                <Disclosure.Panel className="px-4 mt-2 pt-4 pb-2 text-sm text-gray-700 bg-white rounded-lg shadow">
                  <div className="border-b py-2">
                    <span className="font-medium text-gray-800">
                      Requirements:
                    </span>
                    <p>
                      {order.details.requirements || "No requirements provided"}
                    </p>
                  </div>

                  {activeTab === "Booking" && (
                    <button
                      onClick={() => acceptOrder(order._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded mt-4 cursor-pointer"
                    >
                      Accept
                    </button>
                  )}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))
      )}
    </div>
  );
};

export default bookedSalon;
