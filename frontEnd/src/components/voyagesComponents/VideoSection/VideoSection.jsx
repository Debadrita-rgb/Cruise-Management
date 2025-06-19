import React from "react";
import sampleVideo from "../../../assets/sample.mp4";

const VideoSection = () => {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={sampleVideo} type="video/mp4" />
      </video>
      {/* <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h2 className="text-white text-3xl font-bold">
          Welcome to Your Voyage
        </h2>
      </div> */}
    </div>
  );
};

export default VideoSection;
