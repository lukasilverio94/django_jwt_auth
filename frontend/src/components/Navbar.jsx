import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-950 text-white px-5 py-3 flex justify-between items-center">
      <span>Logo</span>

      <ul className="flex gap-5 text-lg">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </ul>
    </nav>
  );
}
