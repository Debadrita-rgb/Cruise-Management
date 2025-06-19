import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


// const images = [
//   "https://images.unsplash.com/photo-1554254648-2d58a1bc3fd5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3J1aXNlJTIwc2hpcHxlbnwwfHwwfHx8MA%3D%3D",
//   "https://www.smartertravel.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2022/10/AdobeStock_171454970-1-1400x500.jpeg.webp",
//   "https://t4.ftcdn.net/jpg/12/16/95/23/360_F_1216952323_pA1CGs9YhSyCdhd7g5FS3u2LKPDoHQL9.jpg",
//   "https://i.pinimg.com/736x/51/8f/b7/518fb7355f7d621e8f8c38e69857eb71.jpg",
//   "https://thumbs.dreamstime.com/b/costa-diadema-port-corfu-september-alongside-105344383.jpg",
//   "https://images.unsplash.com/photo-1548574505-12caf0050b5b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNydWlzZXN8ZW58MHx8MHx8fDA%3D",
// ];

const CruiseGallery = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [images, setImages] = useState();

    useEffect(() => {
      fetch("http://localhost:5000/voyager/get-gallery")
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
