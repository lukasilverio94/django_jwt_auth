import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
