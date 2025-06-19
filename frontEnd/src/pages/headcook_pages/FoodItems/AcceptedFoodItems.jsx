import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Disclosure } from "@headlessui/react";
import { FaChevronUp } from "react-icons/fa";

const AcceptedFoodItems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foodItems, setFoodItems] = useState([]);

  //show all data
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Fetching accepted orders");
    fetch("http://localhost:5000/headcook/get-accepted-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Response status:", res.status); // Log the status code
        if (!res.ok) {
          throw new Error("Network response was not OK");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        setFoodItems(data.orders);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);
  

  return (
    <div className="p-6 text-white">
      <ToastContainer position="top-right" autoClose={2000} />
      {foodItems.map((order) => (
        <Disclosure key={order._id}>
          {({ open }) => (
            <>
              <Disclosure.Button className="mt-5 flex justify-between w-full bg-gray-100 px-4 py-2 text-left text-lg font-medium text-black rounded-lg hover:bg-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-500">
                    Voyager Name:{" "}
                    {order.voyagerId
                      ? order.voyagerId.name
                      : "Name not available"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {order.status}
                  </p>
                </div>
                <FaChevronUp
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } w-5 h-5 text-black self-center`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-700 bg-white rounded-lg shadow">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm">₹{item.price}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="font-bold text-right">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};

export default AcceptedFoodItems;
