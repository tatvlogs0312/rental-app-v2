import React, { useEffect, useState } from "react";
import { Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@rneui/themed";
import { useAuth } from "../../hook/AuthProvider";
import { apiCall } from "../../api/ApiManager";
import { COLOR } from "../../constants/COLORS";
import { heighScreen } from "../../utils/Utils";
import { useLoading } from "../../hook/LoadingProvider";

const RoomScreen = ({ navigation }) => {
  const auth = useAuth();
  const loading = useLoading();

  const [rooms, setRooms] = useState([]);

  const [status, setStatus] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [postition, setPosition] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [auth.token]);

  const fetchData = async () => {
    if (!auth.token) return;

    try {
      const data = await apiCall(
        "/room/search",
        "POST",
        {
          status: "",
          roomTypeId: "",
          position: "",
          ward: "",
          district: "",
          province: "",
          page: page,
          size: size,
        },
        {},
        auth.token,
      );
      setRooms(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ marginHorizontal: 0, marginTop: 0, marginBottom: 150, height: heighScreen - 130 }}>
      <View style={{ flexDirection: "column", justifyContent: "space-between", marginHorizontal: 10, marginTop: 15 }}>
        <View>
          <Text style={{ fontSize: 22, textAlign: "center", marginBottom: 10, fontWeight: "800", color: COLOR.lightBlue }}>Danh sách phòng của bạn</Text>
        </View>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
          {rooms.map((item) => (
            <View style={styles.itemStyle} key={item.roomId}>
              <Text style={{ fontSize: 17, fontWeight: "600", color: COLOR.lightBlue }}>{item.roomCode + " - " + item.typeName}</Text>
              <Text style={{ marginVertical: 3 }}>{`${item.positionDetail} - ${item.ward} - ${item.district} - ${item.province}`}</Text>
              <Text style={{}}>{`Trạng thái: ${item.roomStatus.trim() === "EMPTY" ? "Còn trống" : "Đã cho thuê"}`}</Text>
              <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-end", alignContent: "flex-end" }}>
                <Pressable>
                  <Text style={{ marginRight: 15, color: COLOR.lightBlue }}>Đăng bài</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.navigate("RoomDetail", {
                      id: item.roomId,
                    });
                  }}
                >
                  <Text style={{ color: COLOR.lightBlue }}>Xem chi tiết</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View>
        <Button
          title={"Thêm phòng"}
          onPress={() => {
            navigation.navigate("RoomAdd");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemStyle: {
    borderWidth: 2,
    borderColor: COLOR.lightBlue,
    padding: 7,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default RoomScreen;
