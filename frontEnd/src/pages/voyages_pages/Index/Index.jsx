import React from "react";
import VideoSection from "../../../components/voyagesComponents/VideoSection/VideoSection";
import VoyagerAccessSection from "../../../components/voyagesComponents/VoyagerAccessSection/VoyagerAccessSection";
import WhyChooseUs from "../../../components/voyagesComponents/WhyChooseUs/WhyChooseUs";
import { AnimatedTestimonialsDemo } from "../../../components/voyagesComponents/TestimonialSection/TestimonialSection";
import CruiseGallery from "../../../components/voyagesComponents/CruiseGallery/CruiseGallery";

const VoyageHomePage = () => {
  return (
    <>
      <VideoSection />
      <VoyagerAccessSection />
      <WhyChooseUs />
      <AnimatedTestimonialsDemo />
      <CruiseGallery />
    </>
  );
};

export default VoyageHomePage;
