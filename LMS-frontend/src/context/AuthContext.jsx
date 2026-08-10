import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Only store token for now
      setUser({ token });
    }
  }, []);

  const login = (data) => {
    // data should come from API response
    localStorage.setItem("token", data.access);

    setUser({
      token: data.access,
      username: data.user?.username,
      role: data.user?.role,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};