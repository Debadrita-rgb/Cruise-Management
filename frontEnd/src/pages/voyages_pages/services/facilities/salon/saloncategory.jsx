import React from 'react'
import { BackgroundBoxesDemo } from "../../../../../components/voyagesComponents/breadcrumbSection/slider";
import { SalonFirst } from "../../../../../components/voyagesComponents/services/facilities/salon/SalonFirst";
import { useLocation } from "react-router-dom";
const saloncategory = () => {
  const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
  
    return (
      <>
        <BackgroundBoxesDemo />
        <section className="px-6 md:px-16 py-16">
          {/* <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Salon Services
          </h2> */}
          <div className="rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md border border-white/20 p-6">
            <SalonFirst selectedCategory={category} />
          </div>
        </section>
      </>
    );
  };

export default saloncategory
