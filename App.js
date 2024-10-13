import { StatusBar } from "react-native";
import { AuthProvider } from "./src/hook/AuthProvider";
import AppNav from "./src/navigation/AppNav";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { LoadingProvider } from "./src/hook/LoadingProvider";
import { ModalPortal } from "react-native-modals";

export default function App() {
  return (
    <AlertNotificationRoot>
      <AuthProvider>
        <LoadingProvider>
          <StatusBar />
          <AppNav />
          <ModalPortal />
        </LoadingProvider>
      </AuthProvider>
    </AlertNotificationRoot>
  );
}
