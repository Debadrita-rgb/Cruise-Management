import { motion } from "framer-motion";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const ContactSection = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/voyager/submit-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    }
  }

  return (
    <section className="relative px-6 md:px-16 py-16 overflow-hidden">
            <ToastContainer position="top-right" autoClose={2000} />
      
      {/* Blurred Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://media.cnn.com/api/v1/images/stellar/prod/221129103455-06-body-cruise-critic-editors-picks-2022-norwegian-prima.jpg?q=w_1110,c_fill"
          alt="Cruise"
          className="w-full h-full object-cover blur-md scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-cyan-900/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 backdrop-blur-md bg-white/10 border border-white/30 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        {/* Contact Info */}
        <motion.div
          className="text-white space-y-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text mb-4">
            Let's Get In Touch
          </h2>
          <p className="text-lg text-white/90">
            Whether you're ready to book or just have a question, our crew is
            always here for you.
          </p>
          <div>
            <h3 className="font-semibold text-cyan-400">Headquarters</h3>
            <p>123 Oceanview Avenue, Marina City</p>
          </div>
          <div>
            <h3 className="font-semibold text-cyan-400 mt-4">Phone</h3>
            <p>Support: +91 (800) 555-CELE</p>
            <p>Office: +91 (800) 555-1234</p>
          </div>
          <div>
            <h3 className="font-semibold text-cyan-400 mt-4">Email</h3>
            <p>support@celestia.com</p>
            <p>info@celestia.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-cyan-400 mt-4">Socials</h3>
            <p>Instagram: @celestia_cruises</p>
            <p>Twitter: @CelestiaCruise</p>
          </div>
        </motion.div>

        {/* Contact Form */}
        {/* Contact Form with Header */}
        <div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-white"
          >
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-teal-300 to-cyan-400 text-transparent bg-clip-text">
              Send a Message
            </h3>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-white space-y-5"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                className="w-full p-2 rounded-lg bg-white/20 placeholder-white/70 text-white"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="w-full p-2 rounded-lg bg-white/20 placeholder-white/70 text-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 rounded-lg bg-white/20 placeholder-white/70 text-white"
                placeholder="Type your message..."
              />
            </div>
            <button
              type="submit"
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-xl shadow-lg"
            >
              Send
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
