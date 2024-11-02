import { LogBox, StatusBar } from "react-native";
import { AuthProvider } from "./src/hook/AuthProvider";
import AppNav from "./src/navigation/AppNav";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { LoadingProvider } from "./src/hook/LoadingProvider";
import { ModalPortal } from "react-native-modals";
import { PermissionsAndroid } from "react-native";
import { FcmProvider, useFcm } from "./src/hook/FcmProvider";
import FcmHandler from "./src/notification/FcmHandler";

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
LogBox.ignoreAllLogs(true);

export default function App() {
  return (
    <AlertNotificationRoot>
      <FcmProvider>
        <AuthProvider>
          <LoadingProvider>
            <StatusBar />
            <AppNav />
            <ModalPortal />
            <FcmHandler />
          </LoadingProvider>
        </AuthProvider>
      </FcmProvider>
    </AlertNotificationRoot>
  );
}
