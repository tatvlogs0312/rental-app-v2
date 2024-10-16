import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { useAuth } from "../hook/AuthProvider";

export default function AppNav() {
  const auth = useAuth();

  return <NavigationContainer>{(auth.user === null) | undefined ? <AuthStack /> : <AppStack />}</NavigationContainer>;
}
