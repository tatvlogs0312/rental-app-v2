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
import ConfirmPopup from "../../../components/ConfirmPopup";
import MsgInputError from "./../../../components/MsgInputError";

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
  const [floor, setFloor] = useState(null);

  const [roomNameMsg, setRoomNameMsg] = useState(null);
  const [numberMsg, setNumberMsg] = useState(null);
  const [acreageMsg, setAcreageMsg] = useState(null);
  const [floorMsg, setFloorMsg] = useState(null);

  const [roomId, setRoomId] = useState(null);

  const [addVisiable, setAddVisiable] = useState(false);
  const [deleteVisiable, setDeleteVisiable] = useState(false);

  const [status, setStatus] = useState("EMPTY");

  useEffect(() => {
    if (auth.token) {
      getRoom();
    }
  }, [auth.token, status]);

  const getRoom = async () => {
    try {
      load.isLoading();
      const res = await get("/rental-service/room/search/v2", { houseId: houseId, status: status, page: page, size: size }, auth.token);
      setRooms(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const addRoom = async () => {
    try {
      if (validateAdd() === true) {
        load.isLoading();
        const res = await post(
          "/rental-service/room/create/v2",
          {
            houseId: houseId,
            roomName: roomName,
            acreage: acreage,
            numberOfRoom: number,
            floor: floor,
          },
          auth.token,
        );
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          textBody: "Thêm phòng thành công",
          title: "Thông báo",
        });

        await getRoom();
        clearData();
        setAddVisiable(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const validateAdd = () => {
    let isValid = true;
    if (roomName === null || roomName === "") {
      setRoomNameMsg("Vui lòng điền tên phòng");
      isValid = false;
    }

    if (acreage === null || acreage === "") {
      setAcreageMsg("Vui lòng điền diện tích phòng");
      isValid = false;
    }

    if (number === null || number === "") {
      setNumberMsg("Vui lòng điền số phòng ngủ");
      isValid = false;
    }

    if (floor === null || floor === "") {
      setFloorMsg("Vui lòng điền tầng");
      isValid = false;
    }

    return isValid;
  };

  const clearData = () => {
    setRoomName(null);
    setAcreage(null);
    setNumber(null);
    setFloor(null);
  };

  const clearDataMsg = () => {
    setRoomNameMsg(null);
    setAcreageMsg(null);
    setNumberMsg(null);
  };

  const deleteRoom = async () => {
    try {
      load.isLoading();
      const res = await post(`/rental-service/room/delete/${roomId}`, null, auth.token);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Xóa phòng thành công",
        title: "Thông báo",
      });
      await getRoom();
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
      setDeleteVisiable(false);
    }
  };

  return (
    <>
      <LoadingModal modalVisible={load.loading} />
      <View style={{ flex: 1 }}>
        <HeaderBarPlus title={"Danh sách phòng"} back={() => navigation.goBack()} plus={() => setAddVisiable(true)} />
        <View style={{ backgroundColor: COLOR.white, flexDirection: "row" }}>
          <Pressable style={[styles.button, status === "EMPTY" && styles.selectedButton]} onPress={() => setStatus("EMPTY")}>
            <Text style={[styles.text, status === "EMPTY" && styles.selectedText]}>Còn trống</Text>
          </Pressable>

          <Pressable style={[styles.button, status === "RENTED" && styles.selectedButton]} onPress={() => setStatus("RENTED")}>
            <Text style={[styles.text, status === "RENTED" && styles.selectedText]}>Đã cho thuê</Text>
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: 5, marginTop: 10, flex: 1 }}>
          {rooms.length > 0 ? (
            <View>
              <FlatList
                scrollEnabled
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={load.loading} onRefresh={getRoom} />}
                data={rooms}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Pressable
                      style={{
                        backgroundColor: COLOR.white,
                        position: "absolute",
                        top: 5,
                        right: 5,
                        width: 25,
                        height: 25,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 20,
                        zIndex: 10,
                      }}
                      onPress={() => {
                        setRoomId(item.id);
                        setDeleteVisiable(true);
                      }}
                    >
                      <FontAwesome6 name="x" size={13} color={COLOR.red} />
                    </Pressable>
                    <Text style={{ fontSize: 20, fontWeight: "bold", paddingBottom: 1, borderBottomWidth: StyleSheet.hairlineWidth, color: COLOR.primary }}>
                      {item.roomName}
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                      <FontAwesome6 name="crop-simple" color={COLOR.grey} size={16} />
                      <Text style={{ color: COLOR.grey, fontWeight: "bold" }}>  Diện tích: </Text>
                      <Text style={{ fontWeight: "bold" }}>{`${item.acreage}/m²`}</Text>
                    </Text>
                    <Text style={{ marginTop: 5 }}>
                      <FontAwesome6 name="bed" color={COLOR.grey} />
                      <Text style={{ color: COLOR.grey, fontWeight: "bold" }}>  Số phòng ngủ: </Text>
                      <Text style={{ fontWeight: "bold" }}>{`${item.numberOfRom}`}</Text>
                    </Text>
                    <Text style={{ marginTop: 5 }}>
                      <FontAwesome6 name="layer-group" color={COLOR.grey} />
                      <Text style={{ color: COLOR.grey, fontWeight: "bold" }}>  Tầng: </Text>
                      <Text style={{ fontWeight: "bold" }}>{item.floor}</Text>
                    </Text>
                    <Text style={{ marginTop: 5 }}>
                      <Text style={{ color: COLOR.grey, fontWeight: "bold" }}>Tình trạng: </Text>
                      <Text style={{ fontWeight: "bold" }}>{`${item.roomStatus === "EMPTY" ? "Còn trống" : "Đã cho thuê"}`}</Text>
                    </Text>
                  </View>
                )}
              />
            </View>
          ) : (
            <View style={{ marginTop: 50 }}>
              <NoData message={"Chưa có phòng nào"} />
            </View>
          )}
        </View>
      </View>

      <Modal visible={addVisiable} animationType="slide">
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            onPress={() => {
              clearDataMsg();
              setAddVisiable(false);
            }}
            style={{ zIndex: 1, position: "absolute", top: 15, right: 15 }}
          >
            <FontAwesome6 name="x" size={25} color={COLOR.primary} />
          </TouchableOpacity>
          <View>
            <Text style={{ textAlign: "center", marginTop: 15, fontWeight: "bold", fontSize: 20, color: COLOR.primary }}>Thêm phòng</Text>
            <View style={{ padding: 20, marginTop: 20 }}>
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Tên phòng</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên phòng"
                  value={roomName}
                  onChangeText={(t) => {
                    setRoomName(t);
                    setRoomNameMsg(null);
                  }}
                />
                {roomNameMsg !== null && roomNameMsg !== "" && <MsgInputError msg={roomNameMsg} />}
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Tầng</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tầng"
                  value={floor}
                  onChangeText={(t) => {
                    setFloor(t);
                    setFloorMsg(null);
                  }}
                  keyboardType="number-pad"
                />
                {floorMsg !== null && floorMsg !== "" && <MsgInputError msg={floorMsg} />}
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Diện tích</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập diện tích"
                  value={acreage}
                  onChangeText={(t) => {
                    setAcreage(t);
                    setAcreageMsg(null);
                  }}
                  keyboardType="number-pad"
                />
                {acreageMsg !== null && acreageMsg !== "" && <MsgInputError msg={acreageMsg} />}
              </View>

              <View>
                <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Số phòng ngủ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số phòng ngủ"
                  value={number}
                  onChangeText={(t) => {
                    setNumber(t);
                    setNumberMsg(null);
                  }}
                  keyboardType="number-pad"
                />
                {numberMsg !== null && numberMsg !== "" && <MsgInputError msg={numberMsg} />}
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

      <Modal visible={deleteVisiable} transparent animationType="slide" onRequestClose={() => setAddVisiable(false)}>
        <ConfirmPopup
          title={"Bạn có muốn xóa phòng này"}
          onCancel={() => {
            setDeleteVisiable(false);
            setRoomId(null);
          }}
          onSubmit={() => {
            deleteRoom();
          }}
        />
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
    borderColor: COLOR.primary,
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
    backgroundColor: COLOR.primary,
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

  status1: {
    padding: 10,
    backgroundColor: COLOR.primary,
    color: COLOR.white,
    borderRadius: 10,
    marginRight: 10,
  },

  status2: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLOR.primary,
    color: COLOR.primary,
    borderRadius: 10,
    marginRight: 10,
  },

  button: {
    width: "50%",
    padding: 10,
  },
  selectedButton: {
    borderBottomWidth: 2, // Đường viền dưới
    borderBottomColor: COLOR.primary, // Màu của đường viền
  },
  text: {
    textAlign: "center",
    color: "#000", // Màu chữ mặc định
  },
  selectedText: {
    color: COLOR.primary, // Màu chữ của nút được chọn
    fontWeight: "bold", // Chữ đậm cho nút được chọn
  },
});

export default RoomListScreen;
