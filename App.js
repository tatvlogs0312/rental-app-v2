import { StatusBar } from "react-native";
import { AuthProvider } from "./src/hook/AuthProvider";
import AppNav from "./src/navigation/AppNav";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { LoadingProvider } from "./src/hook/LoadingProvider";
import { ModalPortal } from "react-native-modals";
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { useFcm } from "./src/hook/FcmProvider";

export default function App() {

  const fcm = useFcm();

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
        .then((token) => {
          console.log(token);
          fcm.saveDeviceId(token);
        });
    } else {
      console.log("Permission not granted", authStatus);
    }

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(remoteMessage.notification);
        }
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(remoteMessage.notification);
    });

    messaging().setBackgroundMessageHandler((remoteMessage) => {
      console.log("setBackgroundMessageHandler!", remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("message!", JSON.stringify(remoteMessage));
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
