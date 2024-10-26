import { StatusBar } from "react-native";
import { AuthProvider } from "./src/hook/AuthProvider";
import AppNav from "./src/navigation/AppNav";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { LoadingProvider } from "./src/hook/LoadingProvider";
import { ModalPortal } from "react-native-modals";
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";

export default function App() {
  const requestUserPerrmission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log("authStatus: ", authStatus);
    }
  };

  useEffect(() => {
    if (requestUserPerrmission) {
      messaging()
        .getToken()
        .then((token) => console.log(token));
    } else {
      console.log("Permission not granted", authStatus);
    }

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        remoteMessage.notification;
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      remoteMessage.notification;
    });

    messaging().setBackgroundMessageHandler((remoteMessage) => {
      console.log("setBackgroundMessageHandler!", remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("message!", JSON.stringify(messaging));
    });

    return unsubscribe;
  });

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
