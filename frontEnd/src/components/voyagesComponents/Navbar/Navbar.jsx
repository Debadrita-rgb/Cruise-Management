import { useRef, useContext, useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../assets/logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./Navbar.css";
import BASE_URL from "../../../../config";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "About", href: "/about", current: false },
  {
    name: "Services",
    current: false,
    children: [
      { name: "Catering", href: "/services/catering" },
      { name: "Stationary", href: "/services/stationary" },
      { name: "Movie", href: "/services/facilities/movies" },
      { name: "Beauty Salon", href: "/services/facilities/salonCategory" },
      { name: "Fitness Centre", href: "/services/facilities/fitnessCategory" },
      { name: "Party Hall", href: "/services/facilities/partyhall" },
    ],
  },
  { name: "Contact", href: "/contact", current: false },
  // { name: "SignIn", href: "/signin", current: false },
  // { name: "SignUp", href: "/signup", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { role } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [voyagerName, setVoyagerName] = useState("Guest");
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const isServicesActive = currentPath.startsWith("/services");
  const disclosureButtonRef = useRef();
  const [cartnotificationCount, setcartNotificationCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("voyagerName");

    if (token && storedName) {
      setIsLoggedIn(true);
      setVoyagerName(storedName);
    } else {
      setIsLoggedIn(false);
      setVoyagerName("Guest");
    }
  }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   const fetchcartNotificationCount = async () => {
  //     try {
  //       const res = await axios.get(
  //         "${BASE_URL}/voyager/get-cartnotification-count",
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       setcartNotificationCount(res.data.totalCount);
  //     } catch (err) {
  //       console.error("Error fetching cart notification count:", err);
  //     }
  //   };

  //   if (isLoggedIn) {
  //     fetchcartNotificationCount();
  //   }
  // }, [isLoggedIn]);

  // useEffect(() => {
  //   // Close the mobile menu when route changes and screen is small
  //   const handleRouteChange = () => {
  //     if (window.innerWidth < 640) {
  //       // Trigger the DisclosureButton click to toggle close
  //       disclosureButtonRef.current?.click();
  //     }
  //   };

  //   handleRouteChange(); // Call on initial load
  // }, [location.pathname]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("showWelcomeToast");
    localStorage.removeItem("voyagerName");

    // Update local state
    setIsLoggedIn(false);
    setVoyagerName("Guest");

    toast.success("🎉 Logged out successfully!", {
      autoClose: 3000,
      pauseOnFocusLoss: false,
    });

    navigate("/signin");
  };
  const filteredNavigation = isLoggedIn
    ? navigation.filter(
        (item) => item.name !== "SignIn" && item.name !== "SignUp"
      )
    : navigation;

  const handleLinkClick = () => {
    if (window.innerWidth < 640 && disclosureButtonRef.current) {
      disclosureButtonRef.current.click();
    }
  };
//   useEffect(() => {

//       const token = localStorage.getItem("token");
//         if (!token) return;
//     const fetchNotifications = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/voyager/notifications`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = await res.data;
//         setNotifications(data);

//         const hasUnread = data.some((n) => !n.isRead);
//         setHasNewNotification(hasUnread);
//       } catch (err) {console.error(
//         "Notification fetch failed:",
//         err.response?.data || err.message,
//       );
// }};

//     fetchNotifications();

//     const interval = setInterval(fetchNotifications, 10000); // every 10 sec
//     return () => clearInterval(interval);
//   }, []);

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/voyager/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(res.data);

      const hasUnread = res.data.some((n) => !n.isRead);
      setHasNewNotification(hasUnread);
    } catch (err) {
      console.error(
        "Notification fetch failed:",
        err.response?.data || err.message,
      );

      if (err.response?.status === 403) {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate("/signin");
      }
    }
  };

  fetchNotifications();

  const interval = setInterval(fetchNotifications, 10000);

  return () => clearInterval(interval);
}, [navigate]);

  const handleBellClick = async () => {
    setIsNotificationOpen(!isNotificationOpen);

    if (hasNewNotification) {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/voyager/notifications/mark-read`,{},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHasNewNotification(false);
    }
  };
  const dropdownRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("#notification-bell")
      ) {
        setIsNotificationOpen(false);
      }
    }
    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  function formatNotificationDate(dateString) {
    const noteDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // Normalize dates to midnight for comparison
    const noteDay = new Date(
      noteDate.getFullYear(),
      noteDate.getMonth(),
      noteDate.getDate()
    );
    const todayDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayDay = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (noteDay.getTime() === todayDay.getTime()) {
      return "Today";
    } else if (noteDay.getTime() === yesterdayDay.getTime()) {
      return "Yesterday";
    } else {
      // Return formatted date like "May 20, 2025"
      return noteDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton
              ref={disclosureButtonRef}
              className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link to="/">
                <img
                  alt="Aurelia"
                  src={logo}
                  className="h-10 w-auto rounded-4xl"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  if (item.children) {
                    return (
                      <Menu as="div" className="relative" key={item.name}>
                        <MenuButton
                          className={classNames(
                            isServicesActive
                              ? "bg-gradient-to-r from-[#003860] to-[#0f4c75] text-white shadow-lg"
                              : "text-white hover:bg-gradient-to-r hover:from-[#003860] hover:to-[#0f4c75] hover:text-yellow-300 shadow-md",
                            "rounded-md px-3 py-2 text-sm font-medium transition duration-300 ease-in-out"
                          )}
                        >
                          {item.name}
                        </MenuButton>
                        <Transition
                          enter="transition ease-out duration-200"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition ease-in duration-150"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <MenuItems className="absolute z-50 mt-2 w-44 origin-top-left rounded-xl bg-gradient-to-br from-[#003860] to-[#0f4c75] shadow-2xl ring-1 ring-white/10 focus:outline-none">
                            {item.children.map((child) => (
                              <MenuItem key={child.name}>
                                {({ active }) => (
                                  <Link
                                    to={child.href}
                                    className={`block px-4 py-2 text-sm rounded-md transition-all duration-200 ease-in-out ${
                                      currentPath === child.href
                                        ? "bg-white/20 text-yellow-300 shadow-lg"
                                        : active
                                        ? "text-white bg-white/10"
                                        : "text-white hover:bg-white/10 hover:text-yellow-200"
                                    }`}
                                  >
                                    {child.name}
                                  </Link>
                                )}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Transition>
                      </Menu>
                    );
                  } else {
                    const isActive = currentPath === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          isActive
                            ? "bg-gradient-to-r from-[#003860] to-[#0f4c75] text-white shadow-lg"
                            : "text-white hover:bg-gradient-to-r hover:from-[#003860] hover:to-[#0f4c75] hover:text-yellow-300 shadow-md transition duration-300 ease-in-out",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className={`relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none ${
                hasNewNotification ? "ring-horizontal" : ""
              }`}
              onClick={handleBellClick}
            >
              <span className="sr-only">View notifications</span>
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              ) : (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  0
                </span>
              )}
              <BellIcon aria-hidden="true" className="size-6" />
            </button>
            {/* {isLoggedIn && (
              <Link
                to="/cart?tab=catering"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Cart</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                {cartnotificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {cartnotificationCount}
                  </span>
                )}
              </Link>
            )} */}
            <div className="relative">
              {isNotificationOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-100 max-h-96 overflow-y-auto rounded-md shadow-lg ring-1 bg-white ring-black ring-opacity-5 z-50
            transform origin-top-right transition ease-out duration-300 scale-y-100"
                  style={{
                    transformOrigin: "top right,",
                    // background: linear-gradient(to top right, #011829, #1b4c6d);",
                  }}
                >
                  <div className="flex items-center justify-between border-b px-4 py-2 ">
                    <h3 className="text-lg font-semibold text-black">
                      Notifications
                    </h3>
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-black hover:text-gray-700 focus:outline-none"
                      aria-label="Close notifications"
                    >
                      ✕
                    </button>
                  </div>

                  <div
                    className={`p-4 bg-amber-100 ${
                      notifications.length > 3 ? "max-h-72 overflow-y-auto" : ""
                    }`}
                  >
                    {notifications.length === 0 ? (
                      <p className="text-gray-500">No notifications</p>
                    ) : (
                      (() => {
                        // Group notifications by date label
                        const groups = notifications.reduce((acc, note) => {
                          const label = formatNotificationDate(note.createdAt);
                          if (!acc[label]) acc[label] = [];
                          acc[label].push(note);
                          return acc;
                        }, {});

                        // Render grouped notifications
                        return Object.entries(groups).map(([label, notes]) => (
                          <div key={label} className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">
                              {label}
                            </h4>
                            {notes.map((note) => (
                              <div
                                key={note._id}
                                className="mb-2 p-3 bg-gray-100 rounded hover:bg-gray-200 transition cursor-pointer"
                              >
                                <p className="text-sm text-black">
                                  {note.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(note.createdAt).toLocaleTimeString(
                                    undefined,
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>
                        ));
                      })()
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>

                  <span className="ml-2 text-white hidden sm:block">
                    {isLoggedIn ? voyagerName : "Guest"}
                  </span>
                </MenuButton>
              </div>
              <Transition
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-gradient-to-br from-[#003860] to-[#0f4c75] py-1 shadow-2xl ring-1 ring-white/10 focus:outline-none transition">
                  {isLoggedIn ? (
                    <>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`block px-4 py-2 text-sm rounded-md ${
                              active
                                ? "bg-white/20 text-yellow-300"
                                : "text-white hover:bg-white/10 hover:text-yellow-200"
                            }`}
                          >
                            My Profile
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to="/cart?tab=catering"
                            className={`block px-4 py-2 text-sm rounded-md ${
                              active
                                ? "bg-white/20 text-yellow-300"
                                : "text-white hover:bg-white/10 hover:text-yellow-200"
                            }`}
                          >
                            My Cart
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to="/order?tab=catering"
                            className={`block px-4 py-2 text-sm rounded-md ${
                              active
                                ? "bg-white/20 text-yellow-300"
                                : "text-white hover:bg-white/10 hover:text-yellow-200"
                            }`}
                          >
                            My Order
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to="/booking"
                            className={`block px-4 py-2 text-sm rounded-md ${
                              active
                                ? "bg-white/20 text-yellow-300"
                                : "text-white hover:bg-white/10 hover:text-yellow-200"
                            }`}
                          >
                            My Booking
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`block w-full text-left px-4 py-2 text-sm rounded-md cursor-pointer ${
                              active
                                ? "bg-white/20 text-yellow-300"
                                : "text-white hover:bg-white/10 hover:text-yellow-200"
                            }`}
                          >
                            Logout
                          </button>
                        )}
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to="/signin"
                            className={`block px-4 py-2 text-sm rounded-md ${
                              active
                                ? "bg-white/20 text-yellow-300"
                                : "text-white hover:bg-white/10 hover:text-yellow-200"
                            }`}
                          >
                            Sign In
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to="/signup"
                            className={`block px-4 py-2 text-sm rounded-md ${
                              active
                                ? "bg-white/20 text-yellow-300"
                                : "text-white hover:bg-white/10 hover:text-yellow-200"
                            }`}
                          >
                            Sign Up
                          </Link>
                        )}
                      </MenuItem>
                    </>
                  )}
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {filteredNavigation.map((item) => {
            if (item.children) {
              return (
                <Disclosure key={item.name}>
                  {({ open }) => (
                    <>
                      <DisclosureButton className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-base font-medium text-white hover:bg-gray-700">
                        {item.name}
                        <svg
                          className={`ml-2 h-5 w-5 transform transition-transform ${
                            open ? "rotate-180" : "rotate-0"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </DisclosureButton>
                      <DisclosurePanel className="space-y-1 pl-6">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              );
            } else {
              return (
                <Link
                  onClick={handleLinkClick}
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    currentPath === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </Link>
              );
            }
          })}
          {/* Auth section: Conditionally show SignIn/SignUp or VoyagerName + Logout */}
          {!isLoggedIn ? (
            <div className="mt-3 space-y-1">
              <Link
                to="/signup"
                className="block rounded-md px-3 py-2 text-sm text-yellow-300 hover:bg-gray-600 hover:text-white"
              >
                Sign Up
              </Link>
              <Link
                to="/signin"
                className="block rounded-md px-3 py-2 text-sm text-yellow-300 hover:bg-gray-600 hover:text-white"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Disclosure as="div" className="mt-3">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-white hover:bg-gray-600">
                    <span>
                      Hello,{" "}
                      <span className="font-bold text-yellow-300">
                        {voyagerName}
                      </span>
                    </span>
                    <svg
                      className={`ml-2 h-5 w-5 transform transition-transform ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Disclosure.Button>

                  <Disclosure.Panel className="space-y-1 pl-3 pt-2 text-sm text-white">
                    <Link
                      to="/booking"
                      className="block rounded-md px-3 py-2 hover:bg-gray-600"
                    >
                      My Booking
                    </Link>
                    <Link
                      to="/order?tab=catering"
                      className="block rounded-md px-3 py-2 hover:bg-gray-600"
                    >
                      My Order
                    </Link>
                    <Link
                      to="/cart?tab=catering"
                      className="block rounded-md px-3 py-2 hover:bg-gray-600"
                    >
                      My Cart
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left rounded-md px-3 py-2 text-red-400 hover:bg-gray-600 hover:text-white"
                    >
                      Logout
                    </button>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
