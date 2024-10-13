import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.log("Error loading user:", error);
      } finally {
        setLoading(false); // Set loading to false once data is loaded
      }
    };

    loadUser();
  }, []);

  const login = (user) => {
    setUser(user);
    setToken(user.token);
    AsyncStorage.setItem("user", JSON.stringify(user));
    AsyncStorage.setItem("token", user.token);
  };

  const logout = () => {
    AsyncStorage.removeItem("user");
    AsyncStorage.removeItem("token");
    setUser(null);
    setToken("");
  };

  return <AuthContext.Provider value={{ user, token, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
