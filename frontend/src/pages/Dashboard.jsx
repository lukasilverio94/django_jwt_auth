// Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const { user, setUser, authToken, setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("Response data:", response.data);
      console.log("Response status:", response.status);
      setAuthToken(response.data.jwt);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //   LOGOUT
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/logout/");
      console.log(response.data.message);

      // Clear local storage
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem("jwt");

      // Redirect to login or home page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    console.log("Token before fetchUser:", authToken);
    fetchUser();
    console.log("Token after fetchUser:", authToken);
  }, [authToken, setUser]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-950 text-gray-700 dark:text-gray-300">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 mt-12 text-gray-700 dark:text-slate-200">
          Welcome, {user ? user.user : "User"}!
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
