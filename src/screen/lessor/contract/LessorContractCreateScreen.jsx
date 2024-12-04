import React, { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { COLOR } from "../../../constants/COLORS";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { get, post } from "../../../api/ApiManager";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";
import { TouchableOpacity } from "react-native";
import { err } from "react-native-svg";
import { SelectList } from "react-native-dropdown-select-list";
import { Calendar } from "react-native-calendars";
import { convertDate, getUUID } from "../../../utils/Utils";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const LessorContractCreateScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [houses, setHouses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [utilityData, setUtilityData] = useState([]);

  const [houseName, setHouseName] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [utilities, setUtilities] = useState([]);

  const [uId, setUId] = useState(null);
  const [uPrice, setUPrice] = useState(null);
  const [uType, setUType] = useState(null);

  const [tenant, setTenant] = useState(null);
  const [tenantInfo, setTenantInfo] = useState(null);

  const [houseId, setHouseId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [price, setPrice] = useState(null);
  const [startDate, setStartDate] = useState(null);

  const [houseVisiable, setHouseVisiable] = useState(false);
  const [roomVisiable, setRoomVisiable] = useState(false);
  const [utilityVisiable, setUtilityVisiable] = useState(false);
  const [dateVisiable, setDateVisiable] = useState(false);

  useEffect(() => {
    if (auth.token !== "") {
      getHouses();
      getUtility();
    }
  }, [auth.token]);

  const getUser = async () => {
    if (tenant !== null) {
      load.isLoading();
      try {
        const res = await get(
          "/rental-service/user-profile/get",
          {
            username: tenant,
            role: "TENANT",
          },
          auth.token,
        );
        setTenantInfo(res);
      } catch (error) {
        console.log(error);
      } finally {
        load.nonLoading();
      }
    }
  };

  const getUtility = async () => {
    try {
      const res = await post("/rental-service/utility/search", {}, null);
      setUtilityData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getHouses = async () => {
    try {
      const res = await get("/rental-service/house/search", { page: 0, size: 10000 }, auth.token);
      setHouses(res.data);
      console.log(houses);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const getRoom = async (house) => {
    try {
      load.isLoading();
      const res = await get("/rental-service/room/search/v3", { houseId: house, roomStatus: "EMPTY", page: 0, size: 10000 }, auth.token);
      setRooms(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const createContract = async () => {
    try {
      load.isLoading();
      const res = await post(
        "/rental-service/contract/create",
        {
          tenant: tenantInfo.username,
          houseId: houseId,
          roomId: roomId,
          price: price,
          startDate: startDate,
          utilities: utilities.map((u) => ({
            utilityId: u.utilityId,
            price: u.utilityPrice,
            unit: u.utilityUnit,
          })),
        },
        auth.token,
      );

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Tạo hợp đồng thành công",
        title: "Thông báo",
      });

      navigation.navigate("LessorContractList", {
        refresh: getUUID(),
      });
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const addUtility = () => {
    const utility = utilityData.filter((u) => u.id === uId)[0];
    const newUtilities = utilities.filter((u) => u.utilityId !== uId);
    newUtilities.push({
      utilityId: utility.id,
      utilityName: utility.name,
      utilityPrice: uPrice,
      utilityUnit: uType,
    });

    setUtilities(newUtilities);
    setUPrice(null);
    setUType(null);
    setUtilityVisiable(false);
  };

  const Row = ({ title, value }) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 15 }}>
        <View>
          <Text style={{ color: COLOR.grey }}>{title}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold" }}>{value}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: COLOR.white }}>
        <LoadingModal modalVisible={load.loading} />
        <HeaderBarNoPlus title={"Quay lại"} back={() => navigation.goBack()} />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#F5F5F5",
                  borderRadius: 10,
                  padding: 10,
                  margin: 10,
                }}
              >
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm khách thuê"
                  placeholderTextColor={COLOR.grey}
                  onChangeText={(t) => setTenant(t)}
                  value={tenant}
                />
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: 50,
                    backgroundColor: COLOR.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                  onPress={getUser}
                >
                  <FontAwesome6 name="magnifying-glass" color={COLOR.white} size={20} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              {tenantInfo !== null && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ padding: 10 }}>
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Thông tin khách thuê</Text>
                      <View style={{ borderColor: COLOR.grey, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth }}>
                        <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                          <Row title={"Họ tên:"} value={tenantInfo.firstName + " " + tenantInfo.lastName} />
                        </View>
                        <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                          <Row title={"Số điện thoại:"} value={tenantInfo.phoneNumber} />
                        </View>
                        <View style={{ borderColor: COLOR.grey, marginHorizontal: 15 }}>
                          <Row title={"Email:"} value={tenantInfo.email} />
                        </View>
                      </View>
                    </View>

                    <View style={{ marginTop: 20, backgroundColor: COLOR.light, padding: 10, borderRadius: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Thông tin hợp đồng</Text>
                      <View>
                        <View>
                          <Text style={styles.inputTitle}>Nhà:</Text>
                          <Pressable onPress={() => setHouseVisiable(true)} style={{ zIndex: 10 }}>
                            <TextInput placeholder="Chọn nhà" readOnly style={styles.input} value={houseName} />
                          </Pressable>
                        </View>

                        <View>
                          <Text style={styles.inputTitle}>Phòng:</Text>
                          <Pressable onPress={() => setRoomVisiable(true)} style={{ zIndex: 10 }}>
                            <TextInput placeholder="Chọn phòng" readOnly style={styles.input} value={roomName} />
                          </Pressable>
                        </View>

                        <View>
                          <Text style={styles.inputTitle}>Giá cho thuê:</Text>
                          <TextInput
                            placeholder="Nhập giá cho thuê"
                            style={styles.input}
                            keyboardType="number-pad"
                            onChangeText={(t) => setPrice(t)}
                            value={price}
                          />
                        </View>

                        <View>
                          <Text style={styles.inputTitle}>Ngày vào ở:</Text>
                          <Pressable onPress={() => setDateVisiable(true)} style={{ zIndex: 10 }}>
                            <TextInput placeholder="Chọn ngày vào ở" readOnly style={styles.input} value={convertDate(startDate, "DD/MM/YYYY")} />
                          </Pressable>
                        </View>
                      </View>
                    </View>

                    <View style={{ marginTop: 20, backgroundColor: COLOR.light, padding: 10, borderRadius: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>Dịch vụ</Text>
                      <View style={{ borderColor: COLOR.grey, borderRadius: 10, borderWidth: 0.5, backgroundColor: COLOR.white }}>
                        {utilities.map((item, index) => (
                          <View
                            style={
                              index === utilities.length - 1
                                ? { borderColor: COLOR.grey, marginHorizontal: 15 }
                                : { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }
                            }
                          >
                            <Row title={item.utilityName + ":"} value={item.utilityPrice + "/" + item.utilityUnit} />
                          </View>
                        ))}
                      </View>
                      <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setUtilityVisiable(true)}>
                        <Text style={[styles.btn, { width: 160, margin: "auto" }]}>Thêm dịch vụ</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ padding: 10 }}>
                    <TouchableOpacity onPress={createContract}>
                      <Text style={styles.btn}>Tạo hợp đồng</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </View>

      <Modal visible={dateVisiable} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", backgroundColor: "white", borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Chọn ngày hiệu lực:</Text>
            <View>
              <Calendar
                onDayPress={(day) => {
                  setStartDate(day.dateString);
                  setDateVisiable(false);
                }}
              />
            </View>
            <TouchableOpacity onPress={() => setDateVisiable(false)} style={{ padding: 10, marginTop: 10 }}>
              <Text style={{ color: "red", textAlign: "center" }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={utilityVisiable} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", backgroundColor: "white", borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Chọn dịch vụ:</Text>
            <View>
              <SelectList
                data={utilityData.map(({ id, name }) => ({ key: id, value: name }))}
                save="key"
                placeholder="Chọn dịch vụ"
                setSelected={(val) => setUId(val)}
              />
              <TextInput
                style={{ borderWidth: 1, height: 50, paddingVertical: 5, paddingHorizontal: 20, marginVertical: 10, borderRadius: 10 }}
                placeholder="Đơn giá"
                inputMode="numeric"
                value={uPrice}
                onChangeText={(val) => setUPrice(val)}
              />
              <SelectList
                setSelected={(val) => setUType(val)}
                data={[
                  { key: 1, value: "Người" },
                  { key: 2, value: "Phòng" },
                  { key: 3, value: "Số" },
                  { key: 4, value: "Khối" },
                ]}
                save="value"
                placeholder="Đơn vị tính"
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setUtilityVisiable(false);
                  setUId(null);
                  setUPrice(null);
                  setUType(null);
                }}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.accessButton}
                onPress={() => {
                  addUtility();
                }}
              >
                <Text style={styles.cancelText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={houseVisiable} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", height: 400, backgroundColor: "white", borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Chọn nhà:</Text>
            <FlatList
              scrollEnabled
              showsVerticalScrollIndicator={false}
              data={houses}
              renderItem={({ index, item }) => (
                <TouchableOpacity
                  key={index}
                  style={{ padding: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLOR.grey }}
                  onPress={() => {
                    setHouseId(item.id);
                    setHouseName(item.houseName);
                    getRoom(item.id);
                    setRoomId(null);
                    setRoomName(null);
                    setHouseVisiable(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item.houseName}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setHouseVisiable(false)} style={{ padding: 10, marginTop: 10 }}>
              <Text style={{ color: "red", textAlign: "center" }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={roomVisiable} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", height: 400, backgroundColor: "white", borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Chọn phòng:</Text>
            <FlatList
              scrollEnabled
              showsVerticalScrollIndicator={false}
              data={rooms}
              renderItem={({ index, item }) => (
                <TouchableOpacity
                  key={index}
                  style={{ padding: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLOR.grey }}
                  onPress={() => {
                    setRoomId(item.id);
                    setRoomName(item.roomName);
                    setRoomVisiable(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item.roomName}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setRoomVisiable(false)} style={{ padding: 10, marginTop: 10 }}>
              <Text style={{ color: "red", textAlign: "center" }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    width: 290,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },

  input: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 0.5,
    borderRadius: 5,
    color: COLOR.black,
    borderColor: COLOR.grey,
    backgroundColor: COLOR.white,
  },

  inputTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLOR.grey,
    marginTop: 10,
    marginBottom: 5,
  },

  btn: {
    marginTop: 20,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLOR.primary,
    color: COLOR.white,
    fontWeight: "bold",
    fontSize: 17,
  },

  cancelButton: {
    marginTop: 10,
    marginHorizontal: 4,
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 5,
    width: 100,
  },

  accessButton: {
    marginTop: 10,
    marginHorizontal: 4,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    width: 100,
  },

  cancelText: {
    color: "white",
    textAlign: "center",
  },
});

export default LessorContractCreateScreen;
