// Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data after component mounts
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt");

        const axiosConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/",
          axiosConfig
        );

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-950 text-gray-700 dark:text-gray-300">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 mt-12 text-gray-700 dark:text-slate-200">
        Welcome, {user ? user.name : "User"}!
      </h2>
    </div>
  );
};

export default Dashboard;
