# Aurelia - Cruise Management System
Welcome to Aurelia, a cutting-edge cruise management platform designed to deliver an integrated experience for admin control, user bookings, staff coordination, and customer interactions.

Aurelia bridges frontend luxury with backend efficiency, offering a seamless, secure, and scalable platform for both cruise staff and voyagers.

✨ Project Overview
Aurelia is a full-featured cruise management system combining luxury and convenience for voyagers and operators. It is built using the latest tech stack, focusing on performance, elegance, and ease of use.

🎨 User Interface – Home & Services
✅ Home Page Features
Banner Video – Welcomes users with a dynamic video.

Facilities Section – Highlights cruise services.

Testimonials – Displays admin-approved user testimonials.

Gallery Carousel – Showcases event and facility photos.

🍽️ Catering & Stationary Browsing
Users can view individual items under Catering and Stationaries.

Cart functionality is disabled until login, allowing preview only.

🧘‍♀️ Other Services
Fitness, Salon, Movie, and Party Hall services are visible without login.

Booking requires login, ensuring only authenticated users can reserve services.

👤 User Features
📝 Signup & Login
Users can register and log in, unlocking interactive features like cart and booking.

📬 Notifications
Automated notifications are sent when bookings (Party Hall, Salon, Fitness, Catering, Stationary) are accepted, including date and details.

🛒 Ordering & Booking
Users can add items to the cart after login.

Booking forms with date, time, and special requests available for services like:

Salon

Party Hall

Fitness

Movies (including seats & food items)

📖 Booking Status
Users can track booking statuses like Booked or Accepted.

💬 Feedback & Testimonials
Users can submit feedback/testimonials.

Testimonials require admin approval before being shown on the frontend.

📚 Informational Pages
Contact Us, FAQ, and About Us pages included for additional guidance.

🛠️ Admin Features
🗂️ Category & Item Management
Create categories: Catering, Movie, Stationary, Party Hall, Salon, Fitness.

Add items with:

Name, description, image, and price.

Facilities for create, update, status change.

🎬 Add Movie Hall Services
Admin form includes:

Show time slots.

Movie info (title, image, seats, hall type, release date, timing, language, seat price).

Rich text editor for movie description.

Add food items with titles, images, and prices.

💇‍♀️ Add Salon Services
Define:

Service timings & slots.

Service details (name, duration, image, price).

Description with rich formatting.

Dynamic add/remove service slots.

🏋️ Add Fitness Services
Schedule service slots.

Add equipment details (title, image URL).

Specify service details (name, trainer, price, image, description).

🖼️ Gallery Uploads
Admins can upload images to appear on the user-facing gallery carousel.

📩 Contact Form Management
View and respond to contact form submissions from frontend users.

✅ Review & Approve Testimonials
View all submitted feedback/testimonials.

Approve using checkboxes – only approved testimonials are shown on the frontend.

View each testimonial in detail.

🔒 Role Management
Admins can create users with roles: Manager, Supervisor, Head Cook.

Roles have personalized dashboards with tasks specific to their department.

🧑‍💼 Staff Features
📋 Manager Dashboard
Accept/reject bookings for Party Hall, Salon, and Fitness.

Monitor movie bookings.

Update profile details.

🍳 Head Cook Dashboard
View catering orders.

Accept/reject orders to manage kitchen operations.

📦 Supervisor Dashboard
View stationary orders.

Confirm deliveries and update order statuses.

📊 Dashboards
Admin, Manager, Head Cook, Supervisor – Each role has a personalized dashboard with relevant data, actions, and analytics.

💻 Tech Stack
Frontend Libraries

@headlessui/react

@heroicons/react

@mui/material

@tiptap/react

@tailwindcss/vite

framer-motion

slick-carousel

date-fns, dayjs, react-datepicker

axios, react-icons

aceternity-ui for elegant interactive UI

Backend Architecture

Database: MongoDB (mongodb://127.0.0.1:27017/cruise_management)

Main Models:

BeautySalon

Booking

CateringOrder

Contact

Fitness

FoodItem

Gallery

MovieBooking

Notification

PartyHall

SlotUsageSalon

StationaryOrder

User

Routing Overview

/admin

/common

/voyager

/headcook

/supervisor

/user

🚀 How to Run Locally
bash
Copy
Edit
# Clone the repository
git clone [https://github.com/Debadrita-rgb/Cruise-Management](https://github.com/Debadrita-rgb/Cruise-Management)
cd aurelia-cruise-management

# Install dependencies
npm install

# Start the frontend server
npm run dev
🌟 Aurelia Project Summary
Aurelia represents a full-stack solution for cruise management, blending operational control, elegant design, and voyager satisfaction — redefining how cruise services operate in the digital age.

# Start the backend server
node server.js

📞 Contact
For support or inquiries, please use the Contact Us form available in the platform.

🙏 Thank You
Thank you for exploring the Aurelia Cruise Management System!
Feel free to check out the code, contribute, or try the live demo.
