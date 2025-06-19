import React, { useState , useEffect} from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Disclosure } from "@headlessui/react";
import { FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderedFoodItems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const navigate = useNavigate();

  //show all data
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/supervisor/get-ordered-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not OK");
        }
        return res.json();
      })
      .then((data) => {
        setFoodItems(data.orders);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);


const acceptOrder = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5000/supervisor/accept-order/${id}`,
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
        // Optionally, remove the accepted order from the list or refresh
        setFoodItems((prev) => prev.filter((o) => o._id !== id));
        setTimeout(() => {
          navigate("/supervisor/accepted-stationaryitems");        
        }, 2000);
        
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Accept order error:", err);
      toast.error("Server error");
    }
  };  
  
  
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
                <button
                  onClick={() => acceptOrder(order._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded mt-4 cursor-pointer"
                >
                  Accept
                </button>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};

export default OrderedFoodItems;
