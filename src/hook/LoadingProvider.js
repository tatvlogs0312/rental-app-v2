import { createContext, useContext, useState } from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const isLoading = () => {
    setLoading(true);
  };

  const nonLoading = () => {
    setLoading(false);
  };

  return <LoadingContext.Provider value={{ isLoading, nonLoading, loading }}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => {
  return useContext(LoadingContext);
};
