import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../../../config";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const CateringSection = () => {
  const [foodItems, setFoodItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/voyager/get-food-item`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFoodItems(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleOrder = async (item) => {
    if (!item || !item._id) {
      toast.error("Invalid item.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/signin");

    try {
      // Step 1: Get current order
      const getOrderRes = await fetch(
        `${BASE_URL}/voyager/get-catering-order`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const getOrderData = await getOrderRes.json();
      let existingOrderId = getOrderData?.order?._id || null;
      let existingItems = getOrderData?.order?.items || [];

      // Step 2: Update quantity if item exists
      const existingItemIndex = existingItems.findIndex(
        (i) => i._id === item._id || i.id === item._id
      );

      if (existingItemIndex > -1) {
        existingItems[existingItemIndex].quantity += 1;
      } else {
        existingItems.push({
          id: item._id,
          quantity: 1,
        });
      }

      // Step 3: Prepare items for API
      const finalItems = existingItems.map((i) => ({
        id: i._id || i.id,
        quantity: i.quantity,
      }));

      // Step 4: Send update to server
      const res = await fetch(`${BASE_URL}/voyager/order-catering`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: finalItems,
          orderId: existingOrderId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Added to cart!");
        setTimeout(() => {
          navigate("/cart?tab=catering");
        }, 3000);
      } else {
        toast.error(data.message || "Failed to add item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };
  
  
  return (
    <section className="py-16 px-4 md:px-16">
      <ToastContainer position="top-right" autoClose={2000} />
      <motion.div
        className="rounded-3xl space-y-10  bg-white/10 shadow-2xl backdrop-blur-md border border-white/20 p-6"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        {/* Header */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center text-white"
          variants={fadeUp}
          custom={1}
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Aurelia
          </span>{" "}
          Catering and Dining
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-lg text-center text-white"
          variants={fadeUp}
          custom={2}
        >
          Explore a world of delicious offerings tailored for your voyage.
        </motion.p>

        {/* Food Cards */}
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={fadeUp}
          custom={3}
        >
          {foodItems.map((item, i) => (
            <motion.div
              key={item.i}
              className="flex flex-col justify-between items-center bg-white rounded-lg shadow-lg p-6 space-y-4 transform transition hover:scale-105 hover:shadow-xl"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4 + i}
            >
              <img
                // className="w-86 h-86 object-cover rounded-lg"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-86 lg:h-86 object-cover rounded-lg"
                src={item.image}
                alt={item.name}
              />
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                {item.name}
              </h2>
              <div className="text-sm text-gray-600 text-center"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />

              <p className="text-lg font-medium text-green-500">
                ₹{item.price}
              </p>

              <button
                onClick={() => handleOrder(item)}
                className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-xl shadow-lg cursor-pointer"
              >
                Add to Cart
              </button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
export default CateringSection;
