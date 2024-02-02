import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("jwt");
  console.log("Stored Token:", token);

  const [authToken, setAuthToken] = useState(() => token || null);
  const [user, setUser] = useState(() => (token ? jwtDecode(token) : null));

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
