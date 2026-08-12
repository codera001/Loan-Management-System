import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore login after browser refresh
  useEffect(() => {
    const initAuth = async () => {
      const access = localStorage.getItem("token");

      if (!access) {
        setLoading(false);
        return;
      }

      try {
        const res = await getMe();

        console.log("ME RESPONSE:", res.data);

        setUser({
          token: access,
          ...res.data,
        });

      } catch (error) {
        console.error("Failed to restore authentication:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("refresh");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.access);
    localStorage.setItem("refresh", data.refresh);

    setUser({
      token: data.access,
      refresh: data.refresh,
      ...data.user,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};