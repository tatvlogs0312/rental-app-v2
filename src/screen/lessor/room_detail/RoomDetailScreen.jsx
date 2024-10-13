import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, SafeAreaView, useWindowDimensions } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { get } from "../../../api/ApiManager";
import InfoTab from "./InfoTab";
import UtilityTab from "./UtilityTab";
import ImageTab from "./ImageTab";
import { Tab, TabView } from "@rneui/themed";
import { COLOR } from "../../../constants/COLORS";
import { useLoading } from "../../../hook/LoadingProvider";
import axios from "axios";
import { DOMAIN } from "../../../constants/URL";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const RoomDetailScreen = ({ navigation, route }) => {
  const auth = useAuth();
  // const { loading, isLoading, nonLoading } = useLoading();
  const layout = useWindowDimensions();

  const [room, setRoom] = useState(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoomData();
  }, []);

  const fetchRoomData = async () => {
    try {
      console.log("Fetching room data...");
      const data = await get("/room/" + route.params.id, {}, auth.token);
      console.log(data);
      setRoom(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {room === null ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLOR.lightBlue} />
        </View>
      ) : (
        <>
          <Tab
            value={index}
            onChange={(e) => setIndex(e)}
            indicatorStyle={{
              backgroundColor: "white",
              height: 3,
            }}
          >
            <Tab.Item
              title="Thông tin"
              titleStyle={{ fontSize: 12 }}
              containerStyle={(active) => ({
                backgroundColor: active ? COLOR.lightBlue : undefined,
              })}
            />
            <Tab.Item
              title="Dịch vụ"
              titleStyle={{ fontSize: 12 }}
              containerStyle={(active) => ({
                backgroundColor: active ? COLOR.lightBlue : undefined,
              })}
            />
            <Tab.Item
              title="Hình ảnh"
              titleStyle={{ fontSize: 12 }}
              containerStyle={(active) => ({
                backgroundColor: active ? COLOR.lightBlue : undefined,
              })}
            />
          </Tab>

          <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={{ width: layout.width }}>
              <InfoTab room={room} />
            </TabView.Item>
            <TabView.Item style={{ width: layout.width }}>
              <UtilityTab room={room} />
            </TabView.Item>
            <TabView.Item style={{ width: layout.width }}>
              <ImageTab room={room} />
            </TabView.Item>
          </TabView>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({});

export default RoomDetailScreen;
