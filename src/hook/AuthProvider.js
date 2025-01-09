import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "../api/ApiManager";
import { useLoading } from "./LoadingProvider";
import { err } from "react-native-svg";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [info, setInfo] = useState(null);

  const load = useLoading();

  const getUser = async (token) => {
    try {
      const data = await get("/rental-service/user-profile/get-information", null, token);
      setInfo(data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      load.isLoading();
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedUser && storedToken) {
          await getUser(storedToken);
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.log("Error loading user:", error);
      } finally {
        load.nonLoading();
      }
    };

    loadUser();
  }, []);

  const setInfoApp = (infoReq) => {
    setInfo(infoReq);
  };

  const login = async (user) => {
    await getUser(user.token);
    setUser(user);
    setToken(user.token);
    AsyncStorage.setItem("user", JSON.stringify(user));
    AsyncStorage.setItem("token", user.token);
  };

  const logout = () => {
    AsyncStorage.removeItem("user");
    AsyncStorage.removeItem("token");
    setUser(null);
    setInfo(null);
    setToken("");
  };

  return <AuthContext.Provider value={{ user, token, info, setInfoApp, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
