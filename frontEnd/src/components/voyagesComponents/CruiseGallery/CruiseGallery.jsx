import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BASE_URL from "../../../../config";

const CruiseGallery = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [images, setImages] = useState();

    useEffect(() => {
      fetch(`${BASE_URL}/voyager/get-gallery`)
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not OK");
          return res.json();
        })
        .then((data) => {
          setImages(data);
        })
        .catch((err) => console.error("Fetch error:", err));
    }, []);   
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="px-6 md:px-16 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
        Cruise Experience Gallery
      </h2>

      {images?.length > 0 ? (
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index} className="px-2">
              <div className="rounded-2xl overflow-hidden shadow-lg relative group">
                <img
                  src={img.image}
                  alt={`Cruise ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => setActiveIndex(index)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="text-white text-5xl font-bold transform transition-transform hover:scale-125">
                    +
                  </span>
                </button>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-white">No images found.</p>
      )}
    </section>
  );
};

export default CruiseGallery;
