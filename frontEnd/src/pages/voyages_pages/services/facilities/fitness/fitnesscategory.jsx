import React from 'react'
import { BackgroundBoxesDemo } from "../../../../../components/voyagesComponents/breadcrumbSection/slider";
import { FitnessFirst } from "../../../../../components/voyagesComponents/services/facilities/fitness/FitnessFirst";
import { useLocation } from "react-router-dom";
const fitnesscategory = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  return (
    <>
      <BackgroundBoxesDemo />
      <section className="px-6 md:px-10 py-16">
        {/* <h2 className="text-3xl md:text-4xl font-bold text-center mb-5 lg:mb-10 text-white">
          Fitness Services
        </h2> */}
        <div className="rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md border border-white/20 p-6">
          <FitnessFirst selectedCategory={category} />
        </div>
      </section>
    </>
  );
};

export default fitnesscategory
