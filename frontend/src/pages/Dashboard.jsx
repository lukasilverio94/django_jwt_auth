// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data after component mounts
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          console.error("No JWT token found in localStorage");
          return;
        }

        // JWT is valid, proceed with API call
        const axiosConfig = {
          withCredentials: true,
          credentials: "include", // Set credentials to 'include'
        };

        const response = await axios.get(
          "http://localhost:8000/api/user",
          axiosConfig
        );

        console.log(response.data);
        setUser(response.data); // Assuming the user data is returned in the response
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  //   LOGOUT
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/logout/");
      console.log(response.data.message);

      // Clear local storage
      localStorage.removeItem("jwt");
      setUser(null);

      // Redirect to login or home page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-950 text-gray-700 dark:text-gray-300">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 mt-12 text-gray-700 dark:text-slate-200">
          Welcome, {user ? user.name : "User"}!
        </h2>

        {/* Logout button */}
        <button
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Dashboard;
