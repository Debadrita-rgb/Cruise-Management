import { AnimatedTestimonials } from "../../../lib/animated-testimonials";
import { useState, useEffect } from "react";
import BASE_URL from "../../../../config";

export function AnimatedTestimonialsDemo() {
  const [testimonials, setTestimonials] = useState([]);

  const defaultUserImage =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const testimonialRes = await fetch(`${BASE_URL}/voyager/get-testimonial`);

      const testimonialData = await testimonialRes.json();

      const feedbackRes = await fetch(`${BASE_URL}/voyager/get-contact`);

      const feedbackData = await feedbackRes.json();

      const filteredFeedback = feedbackData.filter(
        (item) => item.status === "Feedback",
      );

      const formattedFeedback = filteredFeedback.map((item) => ({
        message: item.message,
        name: item.name,
        designation: item.email,
        profileimage: item.profileimage || defaultUserImage,
      }));

      const formattedTestimonials = testimonialData.map((item) => ({
        ...item,
        profileimage: item.profileimage || defaultUserImage,
      }));

      const combinedData = [...formattedTestimonials, ...formattedFeedback];

      setTestimonials(combinedData);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <section className="px-6 md:px-16 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
        What Our Guests Say
      </h2>

      <div className="rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md border border-white/20 p-6">
        <AnimatedTestimonials testimonials={testimonials} />
      </div>
    </section>
  );
}
