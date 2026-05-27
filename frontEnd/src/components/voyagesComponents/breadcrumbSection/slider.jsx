import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../../config";

export function BackgroundBoxesDemo() {
  const location = useLocation();

  const [banner, setBanner] = useState(null);

  useEffect(() => {
    fetchBanner();
  }, [location.pathname]);

  const fetchBanner = async () => {
    try {
      let pageType = location.pathname.replace("/", "");
      // for nested routes
      if (location.pathname.includes("/services/facilities/movies")) {
        pageType = "movies";
      }

      if (location.pathname.includes("/services/facilities/salonCategory")) {
        pageType = "salonCategory";
      }

      if (location.pathname.includes("/services/facilities/fitnessCategory")) {
        pageType = "fitnessCategory";
      }

      if (location.pathname.includes("/services/facilities/partyhall")) {
        pageType = "partyhall";
      }

      if (location.pathname.includes("/services/catering")) {
        pageType = "catering";
      }

      if (location.pathname.includes("/services/stationary")) {
        pageType = "stationary";
      }

      const response = await axios.get(
        `${BASE_URL}/voyager/banner/${pageType}`,
      );

      setBanner(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="h-96 relative w-full overflow-hidden bg-cover bg-center flex items-center justify-center rounded-lg transition-all duration-500"
      style={{
        backgroundImage: `url('${
          banner?.page_banner_image ||
          "https://images.pexels.com/photos/18395182/pexels-photo-18395182/free-photo-of-a-large-cruise-ship-on-the-sea.jpeg"
        }')`,
      }}
    >
      <div className="relative z-20 text-center px-6">
        <div className="relative inline-block p-1 rounded-xl shadow-lg hover:scale-105 transition-transform">
          <div className="rounded-lg px-6 py-4">
            <h1
              className="text-3xl md:text-5xl font-bold"
              style={{
                color: "#E1E8ED",
                textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
              }}
            >
              {banner?.heading}
            </h1>

            <p
              className="mt-3 text-md md:text-lg font-bold"
              style={{
                color: "#E1E8ED",
                textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
              }}
            >
              {banner?.paragraph}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
