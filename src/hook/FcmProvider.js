import { createContext, useContext, useState } from "react";

export const FcmContext = createContext();

export const FcmProvider = ({ children }) => {
  const [deviceId, setDeviceId] = useState("");

  const saveDeviceId = (token) => {
    console.log("device: " + token);
    setDeviceId(token);
  };

  return <FcmContext.Provider value={{ deviceId, saveDeviceId }}>{children}</FcmContext.Provider>;
};

export const useFcm = () => {
  return useContext(FcmContext);
};