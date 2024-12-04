// src/components/FcmHandler.js
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { useFcm } from "../hook/FcmProvider";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const FcmHandler = () => {
  const { saveDeviceId, plusUnRead } = useFcm();

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log("token: " + token);
          saveDeviceId(token);
        });
    } else {
      console.log("Permission not granted");
    }

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(remoteMessage.notification);
        }
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(remoteMessage.notification);
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("setBackgroundMessageHandler!", remoteMessage);
      plusUnRead();
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("notification: ", JSON.stringify(remoteMessage));
      plusUnRead();
      Toast.show({
        type: ALERT_TYPE.INFO,
        title: "Thông báo",
        textBody: remoteMessage.notification.title,
      });
    });

    return unsubscribe;
  }, []);

  return null;
};

export default FcmHandler;
