import { createContext, useContext, useState } from "react";

export const FcmContext = createContext();

export const FcmProvider = ({ children }) => {
  const [deviceId, setDeviceId] = useState("");
  const [unRead, setUnRead] = useState(0);

  const saveDeviceId = (token) => {
    console.log("device: " + token);
    setDeviceId(token);
  };

  const plusUnRead = () => {
    setUnRead(unRead + 1);
  };

  const minusUnRead = () => {
    if (unRead > 0) {
      setUnRead(unRead - 1);
    }
  };

  const setUnReadApp = (number) => {
    setUnRead(number);
  };

  return <FcmContext.Provider value={{ deviceId, saveDeviceId, unRead, setUnReadApp, plusUnRead, minusUnRead }}>{children}</FcmContext.Provider>;
};

export const useFcm = () => {
  return useContext(FcmContext);
};
