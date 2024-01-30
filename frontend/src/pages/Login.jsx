import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        formData
      );
      localStorage.setItem("jwt", response.data.jwt);
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data) {
        setError({ message: "Login failed", details: error.response.data });
      } else {
        console.error("An unexpected error occurred:", error);
      }
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
