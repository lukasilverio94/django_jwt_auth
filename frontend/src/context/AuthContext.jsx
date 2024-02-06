import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("jwt");
  console.log("Stored Token:", token);

  const [authToken, setAuthToken] = useState(() => token || null);
  const [user, setUser] = useState(() => (token ? jwtDecode(token) : null));

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + authToken;
      localStorage.setItem("jwt", authToken); // Corrected key
      localStorage.setItem("user", JSON.stringify(user)); // Serialize user object
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("jwt");
    }
  }, [authToken, user]);

  const contextData = {
    authToken: authToken,
    user: user,
    setUser,
    setAuthToken,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
