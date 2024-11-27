import { BackHandler, LogBox, StatusBar } from "react-native";
import { AuthProvider } from "./src/hook/AuthProvider";
import AppNav from "./src/navigation/AppNav";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { LoadingProvider } from "./src/hook/LoadingProvider";
import { ModalPortal } from "react-native-modals";
import { PermissionsAndroid } from "react-native";
import { FcmProvider, useFcm } from "./src/hook/FcmProvider";
import FcmHandler from "./src/notification/FcmHandler";
import { useEffect } from "react";

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
LogBox.ignoreAllLogs(true);

export default function App() {
  // useEffect(() => {
  //   // Vô hiệu hóa nút quay lại trên toàn bộ ứng dụng
  //   BackHandler.addEventListener("hardwareBackPress", () => {
  //     console.log("Back button is blocked");
  //     return true; // Trả về true để ngừng hành động quay lại mặc định
  //   });
  // }, []);

  return (
    <AlertNotificationRoot>
      <FcmProvider>
        <AuthProvider>
          <LoadingProvider>
            <StatusBar />
            <AppNav />
            <ModalPortal />
          </LoadingProvider>
        </AuthProvider>
        <FcmHandler />
      </FcmProvider>
    </AlertNotificationRoot>
  );
}
