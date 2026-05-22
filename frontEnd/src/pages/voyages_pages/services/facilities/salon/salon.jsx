import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ExpandableCardDemo from "../../../../../components/voyagesComponents/services/facilities/salon/ExpandableCardDemo";
import { BackgroundBoxesDemo } from "../../../../../components/voyagesComponents/breadcrumbSection/slider";
import BASE_URL from "../../../../../../config";

const salon = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category"); // e.g., "Face/ Skin Care"
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!category) return;

    fetch(
      `${BASE_URL}/voyager/get-categorized-salon?category=${encodeURIComponent(
        category
      )}`
    )
      .then((res) => res.json())
      .then((result) => {
        const activeItems = result.filter((item) => item.isActive);
        setData(activeItems);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [category]);
  
  return (
    <>
      <BackgroundBoxesDemo />
      <section className="px-6 md:px-16 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          {category}
        </h2>
        {data && data.length > 0 ? (
          <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-2 bg-white/10 rounded-3xl">
            {data.map((service, index) => (
              <ExpandableCardDemo key={index} item={service} />
            ))}
          </div>
        ) : (
          <p className="text-center w-full text-gray-300 py-8">
            No Data in this Category
          </p>
        )}
      </section>
    </>
  );
};

export default salon;
