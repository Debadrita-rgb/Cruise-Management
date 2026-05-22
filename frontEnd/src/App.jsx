import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Layout
import VoyageLayout from "./pages/voyages_pages/layouts/VoyageLayout";

//voyages routes
import VoyageHomePage from "./pages/voyages_pages/Index/Index";
import SignUp from "./pages/voyages_pages/signUp/signUp";
import SignIn from "./pages/voyages_pages/signIn/signIn";
import About from "./pages/voyages_pages/about/about";
import Contact from "./pages/voyages_pages/contact/contact";
import Catering from "./pages/voyages_pages/services/catering/Catering";
import Stationary from "./pages/voyages_pages/services/stationary/Stationary";
import Movies from "./pages/voyages_pages/services/facilities/movies/movies";
import SalonCategory from "./pages/voyages_pages/services/facilities/salon/saloncategory.jsx";
import Salon from "./pages/voyages_pages/services/facilities/salon/salon.jsx";
import FitnessCategory from "./pages/voyages_pages/services/facilities/fitness/fitnesscategory.jsx";
import Fitness from "./pages/voyages_pages/services/facilities/fitness/fitness.jsx"
import Partyhall from "./pages/voyages_pages/services/facilities/partyHall/partyHall.jsx";
import BookPartyhallForm from "./components/voyagesComponents/services/facilities/partyHall/BookPartyhallForm.jsx";
import BooksalonForm from "./components/voyagesComponents/services/facilities/salon/BooksalonForm.jsx";
import BookFitnessForm from "./components/voyagesComponents/services/facilities/fitness/BookFitnessForm.jsx";
import BookMovieForm from "./components/voyagesComponents/services/facilities/movies/BookMovieForm.jsx";
import SeatArrangementPage from "./components/voyagesComponents/services/facilities/movies/SeatArrangementPage";
import Faq from "./pages/voyages_pages/faq/faq";
import MyCart from "./pages/voyages_pages/Cart/Cart";
import MyOrder from "./pages/voyages_pages/Order/Order";
import MyBooking from "./pages/voyages_pages/Booking/Booking";
import MyBookingMovies from "./pages/voyages_pages/Booking/facilities/Movie.jsx";
import MyBookingPartyhall from "./pages/voyages_pages/Booking/facilities/Partyhall.jsx";
import MyBookingFitness from "./pages/voyages_pages/Booking/facilities/Fitness.jsx";
import MyBookingSalon from "./pages/voyages_pages/Booking/facilities/Salon.jsx";

//admin routes
import AdminLayout from "./components/layout/admin/AdminLayout";
import AdminDashboard from "./pages/admin_pages/AdminDashboard/AdminDashboard.jsx";
import Facilities from "./pages/admin_pages/Facilities/Facilities.jsx";

//booking Salon Service
import ViewSalonService from "./pages/admin_pages/Booking/Salon/ViewSalonService.jsx";
import AdminaddSalonService from "./pages/admin_pages/Booking/Salon/AddSalonService.jsx";
import AdmineditSalonService from "./pages/admin_pages/Booking/Salon/editSalonService.jsx";

//booking Fitness Service
import ViewFitnessService from "./pages/admin_pages/Booking/Fitness/ViewFitnessService.jsx";
import AdminaddFitnessService from "./pages/admin_pages/Booking/Fitness/AddFitnessService.jsx";
import AdmineditFitnessService from "./pages/admin_pages/Booking/Fitness/editFitnessService.jsx";

//booking Moviehall Service
import ViewMoviehallService from "./pages/admin_pages/Booking/Moviehall/viewMoviehallService.jsx";
import AdminaddMoviehallService from "./pages/admin_pages/Booking/Moviehall/addMoviehallService.jsx";
import AdmineditMoviehallService from "./pages/admin_pages/Booking/Moviehall/editMoviehallService.jsx";

//booking Partyhall Service
import ViewPartyhallService from "./pages/admin_pages/Booking/Partyhall/viewPartyhallService.jsx";
import AdminaddPartyhallService from "./pages/admin_pages/Booking/Partyhall/addPartyhallService.jsx";
import AdmineditPartyhallService from "./pages/admin_pages/Booking/Partyhall/editPartyhallService.jsx";

// Catering
import AdminCatering from "./pages/admin_pages/Services/Catering/Catering.jsx";
import AdminaddCatering from "./pages/admin_pages/Services/Catering/addCatering.jsx";
import AdmineditCatering from "./pages/admin_pages/Services/Catering/editCatering.jsx";

// Stationary
import AdminStationary from "./pages/admin_pages/Services/Stationary/Stationary.jsx";
import AdminaddStationary from "./pages/admin_pages/Services/Stationary/addStationary.jsx";
import AdmineditStationary from "./pages/admin_pages/Services/Stationary/editStationary.jsx";

//User
import AdminUser from "./pages/admin_pages/User/viewUser.jsx";
import AdminAddUser from "./pages/admin_pages/User/addUser.jsx";
import AdmineditUser from "./pages/admin_pages/User/editUser.jsx";

//Category
import AdminCategory from "./pages/admin_pages/Category/viewCategory.jsx";
import AdminAddCategory from "./pages/admin_pages/Category/addCategory.jsx";
import AdmineditCategory from "./pages/admin_pages/Category/editCategory.jsx";

//Manager
import ManagerLayout from "./components/layout/manager/ManagerLayout";
import ManagerDashboard from "./pages/Manager_pages/ManagerDashboard/ManagerDashboard.jsx";
import ManagerBookedPartyhall from "./pages/manager_pages/bookedPartyhall/bookedPartyhall.jsx";
import ManagerBookedFitness from "./pages/manager_pages/bookedFitness/bookedFitness.jsx"
import ManagerBookedMovies from "./pages/manager_pages/bookedMovies/bookedMovies.jsx";
import ManagerBookedSalon from "./pages/manager_pages/bookedSalon/bookedSalon.jsx";
import ManagerProfile from "./pages/manager_pages/ManagerProfile/ManagerProfile.jsx";

//Head Cook
import HeadCookLayout from "./components/layout/headcook/HeadCookLayout";
import HeadCookDashboard from "./pages/headcook_pages/HeadCookDashboard/HeadCookDashboard.jsx";
import OrderedFoodItems from "./pages/headcook_pages/FoodItems/OrderedFoodItems";
import AcceptedFoodItems from "./pages/headcook_pages/FoodItems/AcceptedFoodItems";
import HeadcookProfile from "./pages/headcook_pages/HeadcookProfile/HeadcookProfile.jsx";


//Supervisor
import SupervisorLayout from "./components/layout/supervisor/SupervisorLayout";
import SupervisorDashboard from "./pages/supervisor_pages/SupervisorDashboard/SupervisorDashboard.jsx";
import OrderedStationaryItems from "./pages/supervisor_pages/StationaryItems/OrderedItems";
import AcceptedStationaryItems from "./pages/supervisor_pages/StationaryItems/AcceptedItems";
import SupervisorProfile from "./pages/supervisor_pages/SupervisorProfile/SupervisorProfile.jsx";

//Gallery
import AdminviewGallery from "./pages/admin_pages/common/Gallery/viewGallery.jsx";
import AdminaddGallery from "./pages/admin_pages/common/Gallery/addGallery.jsx";

// Admin conatct
import AdminContact from "./pages/admin_pages/common/Contact/contact.jsx";
import AdminViewContactDetails from "./pages/admin_pages/common/Contact/ViewContactDetails.jsx";

// Admin conatct
import AdminFeedback from "./pages/admin_pages/common/Feedback/Feedback.jsx";
import AdminViewFeedbackDetails from "./pages/admin_pages/common/Feedback/Viewfeedbackdetails.jsx";

// Admin conatct
import AdminTestimonial from "./pages/admin_pages/common/Testimonial/Testimonial.jsx";
import AdminViewTestimonialDetails from "./pages/admin_pages/common/Testimonial/Viewtestimonialdetails.jsx";

//user testimonial
import UserTestimonial from "./pages/voyages_pages/Testimonial/Testimonial.jsx"
// user feedback
import UserFeedback from "./pages/voyages_pages/Feedback/Feedback.jsx";

// Login Page of Admin,Manager,Head Cook,Supervisor
import LoginPage from "./pages/LoginPage/LoginPage";

const App = () => {
  // const { role } = useAuth();
  // const role = localStorage.getItem("role");
  // const isAuthenticated = !!role;
  const { loading, isAuthenticated, role } = useAuth();
  if (loading) return <div>Loading...</div>;

  // console.log("Auth check:", isAuthenticated, "Role:", role);
  return (
    <div className="min-h-screen bg-transparent">
      {/* <ToastContainer position="top-right" autoClose={2000} /> */}

      <BrowserRouter>
        <Routes>
          {/* Voyage */}
          <Route element={<VoyageLayout />}>
            <Route path="/" element={<VoyageHomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonial" element={<UserTestimonial />} />
            <Route path="/feedback" element={<UserFeedback />} />

            <Route path="/faq" element={<Faq />} />
            <Route path="/services/catering" element={<Catering />} />
            <Route path="services/stationary" element={<Stationary />} />
            <Route path="services/facilities/movies" element={<Movies />} />
            <Route
              path="services/facilities/salonCategory"
              element={<SalonCategory />}
            />
            <Route path="services/facilities/salon/" element={<Salon />} />
            <Route
              path="services/facilities/fitnessCategory"
              element={<FitnessCategory />}
            />
            <Route path="services/facilities/fitness/" element={<Fitness />} />
            <Route path="cart" element={<MyCart />} />
            <Route path="order" element={<MyOrder />} />
            <Route path="booking" element={<MyBooking />} />
            <Route
              path="services/facilities/partyhall"
              element={<Partyhall />}
            />
            <Route
              path="services/facilities/partyhall/book-hall/:hallId"
              element={<BookPartyhallForm />}
            />
            <Route
              path="services/facilities/salon/book-salon/:salonId"
              element={<BooksalonForm />}
            />
            <Route
              path="services/facilities/fitness/book-fitness/:serviceId"
              element={<BookFitnessForm />}
            />
            <Route
              path="services/facilities/movies/book-movie/:movieId"
              element={<BookMovieForm />}
            />
            <Route
              path="services/facilities/movies/book-movie/:movieId/select-seats"
              element={<SeatArrangementPage />}
            />
            <Route
              path="booking/facilities/movies"
              element={<MyBookingMovies />}
            />
            <Route
              path="booking/facilities/partyhall"
              element={<MyBookingPartyhall />}
            />
            <Route
              path="booking/facilities/fitness"
              element={<MyBookingFitness />}
            />
            <Route
              path="booking/facilities/salon"
              element={<MyBookingSalon />}
            />
          </Route>

          {/* Common Login Page */}
          <Route path="/backend/login" element={<LoginPage />} />

          {/* Admin Routes */}
          {isAuthenticated && role === "admin" && (
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="facilities" element={<Facilities />} />
              {/* Catering */}
              <Route path="services/catering" element={<AdminCatering />} />
              <Route
                path="services/catering/addCatering"
                element={<AdminaddCatering />}
              />
              <Route
                path="services/catering/editCatering/:id"
                element={<AdmineditCatering />}
              />
              {/* Stationary */}
              <Route path="services/stationary" element={<AdminStationary />} />
              <Route
                path="services/stationary/addStationary"
                element={<AdminaddStationary />}
              />
              <Route
                path="services/stationary/editStationary/:id"
                element={<AdmineditStationary />}
              />
              {/* Booking Salon  */}
              <Route
                path="booking/viewSalonService"
                element={<ViewSalonService />}
              />
              <Route
                path="booking/addSalonService"
                element={<AdminaddSalonService />}
              />
              <Route
                path="booking/editSalonService/:id"
                element={<AdmineditSalonService />}
              />
              {/* Booking Fitness  */}
              <Route
                path="booking/viewFitnessService"
                element={<ViewFitnessService />}
              />
              <Route
                path="booking/addFitnessService"
                element={<AdminaddFitnessService />}
              />
              <Route
                path="booking/editFitnessService/:id"
                element={<AdmineditFitnessService />}
              />
              {/* Booking Moviehall  */}
              <Route
                path="booking/viewMoviehallService"
                element={<ViewMoviehallService />}
              />
              <Route
                path="booking/addMoviehallService"
                element={<AdminaddMoviehallService />}
              />
              <Route
                path="booking/editMoviehallService/:id"
                element={<AdmineditMoviehallService />}
              />
              {/* Booking Partyhall  */}
              <Route
                path="booking/viewPartyhallService"
                element={<ViewPartyhallService />}
              />
              <Route
                path="booking/addPartyhallService"
                element={<AdminaddPartyhallService />}
              />
              <Route
                path="booking/editPartyhallService/:id"
                element={<AdmineditPartyhallService />}
              />
              {/* User */}
              <Route path="view-all-user" element={<AdminUser />} />
              <Route path="add-user" element={<AdminAddUser />} />
              <Route path="edit-user/:id" element={<AdmineditUser />} />
              {/* Gallery */}
              <Route path="view-gallery" element={<AdminviewGallery />} />
              <Route path="add-gallery" element={<AdminaddGallery />} />

              {/* Category */}
              <Route path="view-all-category" element={<AdminCategory />} />
              <Route path="add-category" element={<AdminAddCategory />} />
              <Route path="edit-category/:id" element={<AdmineditCategory />} />

              {/* AdminContact */}
              <Route path="view-contact" element={<AdminContact />} />
              <Route
                path="view-contact-details/:id"
                element={<AdminViewContactDetails />}
              />
              {/* AdminFeedback */}
              <Route path="view-feedback" element={<AdminFeedback />} />
              <Route
                path="view-feedback-details/:id"
                element={<AdminViewFeedbackDetails />}
              />
              {/* AdminTestimonial */}
              <Route path="view-testimonial" element={<AdminTestimonial />} />
              <Route
                path="view-testimonial-details/:id"
                element={<AdminViewTestimonialDetails />}
              />
            </Route>
          )}

          {/* Manager Routes */}
          {isAuthenticated && role === "manager" && (
            <Route path="/manager" element={<ManagerLayout />}>
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route
                path="bookings/bookedPartyhall"
                element={<ManagerBookedPartyhall />}
              />
              <Route
                path="bookings/bookedFitness"
                element={<ManagerBookedFitness />}
              />
              <Route
                path="bookings/bookedMovies"
                element={<ManagerBookedMovies />}
              />
              <Route
                path="bookings/bookedSalon"
                element={<ManagerBookedSalon />}
              />
              <Route path="profile" element={<ManagerProfile />} />
            </Route>
          )}

          {/* Head Cook Routes */}

          {isAuthenticated && role === "headcook" && (
            <Route path="/headcook" element={<HeadCookLayout />}>
              <Route path="dashboard" element={<HeadCookDashboard />} />
              <Route
                path="ordered-cateringitems"
                element={<OrderedFoodItems />}
              />
              <Route
                path="accepted-cateringitems"
                element={<AcceptedFoodItems />}
              />
              <Route path="profile" element={<HeadcookProfile />} />
            </Route>
          )}

          {/* Supervisor Routes */}
          {isAuthenticated && role === "supervisor" && (
            <Route path="/supervisor" element={<SupervisorLayout />}>
              <Route path="dashboard" element={<SupervisorDashboard />} />
              <Route
                path="ordered-stationaryitems"
                element={<OrderedStationaryItems />}
              />
              <Route
                path="accepted-stationaryitems"
                element={<AcceptedStationaryItems />}
              />
              <Route path="profile" element={<SupervisorProfile />} />
            </Route>
          )}

          {/* Redirect unknown routes */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
