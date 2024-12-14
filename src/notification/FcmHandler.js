// src/components/FcmHandler.js
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { useFcm } from "../hook/FcmProvider";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { useAuth } from "./../hook/AuthProvider";
import { post } from "../api/ApiManager";

const FcmHandler = () => {
  const auth = useAuth();
  const { saveDeviceId, plusUnRead, setUnReadApp } = useFcm();

  const subscribe = async (token) => {
    if (auth.token !== "") {
      try {
        var res = await post("/rental-service/fcm/subscribe/" + token, {}, auth.token);
        console.log(res);
        setUnReadApp(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

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
          subscribe(token);
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
  }, [auth.token]);

  return null;
};

export default FcmHandler;
