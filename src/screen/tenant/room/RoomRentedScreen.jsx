import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { get } from "../../../api/ApiManager";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import LoadingModal from "react-native-loading-modal";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../../constants/COLORS";
import { TouchableOpacity } from "react-native";

const RoomRentedScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (auth.token !== "") {
      getRoom();
    }
  }, [auth.token]);

  const getRoom = async () => {
    try {
      load.isLoading();
      const res = await get("/rental-service/room/get-room-rented", {}, auth.token);
      setRooms(res);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingModal modalVisible={load.loading} />
      <HeaderBarNoPlus title={"Danh sách phòng đang thuê"} back={() => navigation.goBack()} />
      <View style={{ flex: 1 }}>
        <FlatList
          scrollEnabled
          showsVerticalScrollIndicator={false}
          data={rooms}
          refreshControl={<RefreshControl refreshing={load.loading} onRefresh={getRoom} />}
          renderItem={({ item }) => (
            <View style={{ margin: 10, padding: 15, backgroundColor: COLOR.white, elevation: 5, borderRadius: 10, position: "relative" }}>
              <View style={{ paddingBottom: 5, borderBottomWidth: 0.5 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: COLOR.primary }}>{`${item.houseName} - ${item.roomName}`}</Text>
                <View style={{ marginTop: 5 }}>
                  <Text style={{ color: COLOR.grey }}>
                    <FontAwesome6Icon name="location-dot" />
                    {` ${item.housePositionDetail}`}
                  </Text>
                  <Text style={{ color: COLOR.grey }}>{`${item.houseWard} - ${item.houseDistrict} - ${item.houseProvince}`}</Text>
                </View>
              </View>
              <View style={{ paddingTop: 5, flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <Text style={{ fontWeight: "600" }}>Chủ trọ:</Text>
                  <Text style={{ color: COLOR.primary, fontSize: 16, fontWeight: "500" }}>{item.lessorFullName}</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={{ fontWeight: "600" }}>Liên hệ:</Text>
                  <Text style={{ color: COLOR.primary, fontSize: 16, fontWeight: "500" }}>{item.lessorPhoneNumber}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: COLOR.green,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 100,
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              >
                <FontAwesome6Icon name="phone" color={COLOR.white} size={20} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default RoomRentedScreen;
