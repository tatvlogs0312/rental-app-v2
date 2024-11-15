import React, { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import HeaderBarPlus from "../../../components/header/HeaderBarPlus";
import { get, post } from "../../../api/ApiManager";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";
import { COLOR } from "../../../constants/COLORS";
import NoData from "../../../components/NoData";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const RoomListScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const houseId = route.params.houseId;
  const houseName = route.params.houseName;

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [rooms, setRooms] = useState([]);

  const [roomName, setRoomName] = useState(null);
  const [number, setNumber] = useState(null);
  const [acreage, setAcreage] = useState(null);

  const [addVisiable, setAddVisiable] = useState(false);

  useEffect(() => {
    if (auth.token) {
      getRoom();
    }
  }, [auth.token]);

  const getRoom = async () => {
    try {
      const res = await get("/room/search/v2", { houseId: houseId, page: page, size: size }, auth.token);
      setRooms(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addRoom = async () => {
    try {
      load.isLoading();
      const res = await post("/room/create/v2", { roomName: roomName, acreage: acreage, numberOfRoom: number }, auth.token);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Thêm phòng thành công",
        title: "Thông báo",
      });
      navigation.navigate("HouseList");
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  return (
    <>
      <LoadingModal modalVisible={load.loading} />

      <View style={{ flex: 1, backgroundColor: COLOR.white }}>
        <HeaderBarPlus title={"Danh sách phòng"} back={() => navigation.goBack()} plus={() => setAddVisiable(true)} />
        <View style={{ padding: 10 }}>
          {/* <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, marginLeft: 10 }}>{houseName}</Text> */}
          {rooms.length > 0 ? (
            <View>
              <FlatList
                refreshControl={<RefreshControl refreshing={load.loading} onRefresh={getRoom} />}
                data={rooms}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Pressable
                      style={{
                        backgroundColor: COLOR.black,
                        position: "absolute",
                        top: 5,
                        right: 5,
                        width: 25,
                        height: 25,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 20,
                      }}
                    >
                      <FontAwesome6 name="x" size={10} color={COLOR.white} />
                    </Pressable>
                    <Text style={{ fontSize: 20, fontWeight: "bold", paddingBottom: 1, borderBottomWidth: 0.5 }}>{item.roomName}</Text>
                    <Text style={{ marginTop: 10 }}>
                      <FontAwesome6 name="crop-simple" />
                      {` Diện tích: ${item.acreage}/m²`}
                    </Text>
                    <Text style={{ marginTop: 5 }}>
                      <FontAwesome6 name="bed" />
                      {` Số phòng ngủ: ${item.numberOfRom}`}
                    </Text>
                    <Text style={{ marginTop: 5 }}>{`Tình trạng: ${item.roomStatus === "EMPTY" ? "Còn trống" : "Đã cho thuê"}`}</Text>
                  </View>
                )}
              />
            </View>
          ) : (
            <NoData message={"Không có dữ liệu"} />
          )}
        </View>
      </View>

      <Modal visible={addVisiable} animationType="slide" onRequestClose={() => setAddVisiable(false)}>
        <View style={{ position: "relative" }}>
          <TouchableOpacity onPress={() => setAddVisiable(false)} style={{ zIndex: 1, position: "absolute", top: 15, right: 15 }}>
            <FontAwesome6 name="x" size={25} color={COLOR.red} />
          </TouchableOpacity>
          <View>
            <Text style={{ textAlign: "center", marginTop: 15, fontWeight: "bold", fontSize: 20 }}>Thêm phòng</Text>
            <View style={{ padding: 20 }}>
              <View>
                <TextInput style={styles.input} placeholder="Tên phòng" value={roomName} onChangeText={(t) => setRoomName(t)} />
              </View>
              <View>
                <TextInput style={styles.input} placeholder="Diện tích" value={acreage} onChangeText={(t) => setAcreage(t)} keyboardType="number-pad" />
              </View>
              <View>
                <TextInput style={styles.input} placeholder="Số phòng ngủ" value={number} onChangeText={(t) => setNumber(t)} keyboardType="number-pad" />
              </View>
            </View>
            <View>
              <TouchableOpacity onPress={addRoom}>
                <Text style={styles.btn}>Thêm phòng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    color: COLOR.black,
    marginVertical: 10,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: COLOR.black,
    borderRadius: 10,
    backgroundColor: COLOR.white,
    // Đổ bóng
    shadowColor: "#000", // Màu đổ bóng
    shadowOffset: { width: 0, height: 5 }, // Vị trí bóng đổ
    shadowOpacity: 0.2, // Độ mờ của bóng
    shadowRadius: 3.5, // Độ lan của bóng
    elevation: 5, // Đổ bóng cho Android
  },

  btn: {
    marginTop: 20,
    textAlign: "center",
    width: 200,
    margin: "auto",
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLOR.black,
    color: COLOR.white,
    fontWeight: "bold",
    fontSize: 17,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    // Thiết lập đổ bóng cho iOS
    shadowColor: "#000",
    shadowRadius: 20,
    // Thiết lập đổ bóng cho Android
    elevation: 5,
  },
});

export default RoomListScreen;
