import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

export const Login = () => {
  const { setAuthToken, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      // Set the entire response data in the AuthContext, which includes the JWT
      setAuthToken(responseData.jwt);
      console.log("Token after setting:", responseData.jwt);

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("An unexpected error occurred:", error);

      setError({
        message: error.message || "Login failed",
        details: error.details || "login failed",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-950 text-gray-700 dark:text-gray-300">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 mt-12 text-gray-700 dark:text-slate-200">
        Login
      </h2>

      <form className="w-full max-w-md px-4" onSubmit={handleSubmit}>
        <label htmlFor="email" className="block mb-1">
          * Email
        </label>
        <input
          className="w-full border-2 border-gray-300 mb-4  p-2 rounded-lg dark:bg-transparent dark:focus:outline-none dark:focus:border-teal-500"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password" className="block mb-1">
          * Password
        </label>
        <input
          className="w-full border-2 border-gray-300 mb-4  p-2 rounded-lg dark:bg-transparent dark:focus:outline-none dark:focus:border-teal-500"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg"
          type="submit"
        >
          Login
        </button>
      </form>

      {/* Display error messages if there are any */}
      {error && (
        <div className="text-red-500 mt-2">
          <ul>
            {Object.keys(error.details).map((field) => (
              <li key={field}>
                {Array.isArray(error.details[field])
                  ? error.details[field].join(", ")
                  : error.details[field]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link to="/dashboard">
        <p className="mt-2 text-blue-700 dark:text-gray-300">
          Don't have an account?
          <span className="font-bold hover:underline ml-1 dark:text-teal-300">
            Sign up!
          </span>
        </p>
      </Link>
    </div>
  );
};
