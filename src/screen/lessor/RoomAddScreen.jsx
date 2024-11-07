import { Input } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { get, post } from "../../api/ApiManager";
import { useAuth } from "../../hook/AuthProvider";
import { useLoading } from "../../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";
import ConfirmPopup from "../../components/ConfirmPopup";
import HeaderBar from "../../components/header/HeaderBar";
import { COLOR } from "../../constants/COLORS";
import { TouchableOpacity } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { toMoneyDot } from "../../utils/Utils";

const RoomAddScreen = ({ navigation }) => {
  const auth = useAuth();
  const loading = useLoading();

  const [roomTypes, setRoomTypes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [roomType, setRoomType] = useState(null);
  const [roomTypeName, setRoomTypeName] = useState(null);

  const [price, setPrice] = useState("");
  const [number, setNumber] = useState(null);
  const [acreage, setAcreage] = useState(null);
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [detail, setDetail] = useState("");

  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [roomTypeVisiable, setRoomTypeVisiable] = useState(false);
  const [provinceVisiable, setProvinceVisiable] = useState(false);
  const [wardVisiable, setWardVisiable] = useState(false);
  const [districtVisiable, setDistrictVisiable] = useState(false);

  useEffect(() => {
    getRoomTypes();
    getProvinces();
  }, []);

  const getRoomTypes = async () => {
    try {
      const data = await post("/room-type/search", {}, null);
      setRoomTypes(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProvinces = async () => {
    try {
      const data = await get("/province", {}, null);
      setProvinces(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDistricts = async (provinceId) => {
    try {
      const data = await get("/province/district", { provinceId: provinceId }, null);
      setDistricts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getWard = async (districtId) => {
    try {
      const data = await get("/province/ward", { districtId: districtId }, null);
      setWards(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addRoom = async () => {
    loading.isLoading();
    try {
      const res = await post(
        "/room/create",
        {
          roomTypeId: roomType,
          price: Number(price),
          acreage: Number(acreage),
          numberOfRoom: Number(number),
          province: province,
          district: district,
          ward: ward,
          positionDetail: detail,
        },
        auth.token,
      );

      if (res) {
        navigation.navigate("Room");
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.nonLoading();
      setConfirmVisible(false);
    }
  };

  return (
    <>
      <LoadingModal modalVisible={loading.loading} />
      <SafeAreaView style={{ height: "100%", backgroundColor: COLOR.white, flex: 1 }}>
        <HeaderBar title={"Thêm phòng"} back={() => navigation.goBack()} />
        <KeyboardAvoidingView style={{ flex: 1, justifyContent: "space-between", padding: 10 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: 5, marginVertical: 10 }}>
              <View style={styles.boxInfo}>
                <Text style={styles.boxInfoTitle}>Thông tin chung</Text>
                <View>
                  <View style={styles.boxInput}>
                    <Text style={{ marginLeft: 5 }}>Loại phòng:</Text>
                    <Pressable onPress={() => setRoomTypeVisiable(true)}>
                      <TextInput readOnly style={styles.input} placeholder="Chưng cư, Phòng trọ, Studio, ..." value={roomTypeName} />
                    </Pressable>
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={{ marginLeft: 5 }}>Diện tích:</Text>
                    <TextInput style={styles.input} placeholder="20m2, 18m2, ..." keyboardType="number-pad" onChangeText={(text) => setAcreage(text)} />
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={{ marginLeft: 5 }}>Số phòng ngủ:</Text>
                    <TextInput style={styles.input} placeholder="1, 2 phòng ..." keyboardType="number-pad" onChangeText={(text) => setNumber(text)} />
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={{ marginLeft: 5 }}>Giá cho thuê dự tính:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="3.000.000, 2.000.000, ..."
                      keyboardType="number-pad"
                      value={price}
                      onChangeText={(text) => setPrice(text)}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.boxInfo}>
                <Text style={styles.boxInfoTitle}>Địa chỉ</Text>
                <View>
                  <View style={styles.boxInput}>
                    <Text style={{ marginLeft: 5 }}>Tỉnh/Thành phố:</Text>
                    <Pressable onPress={() => setProvinceVisiable(true)}>
                      <TextInput readOnly style={styles.input} placeholder="Hà Nội, Hà Nam, ..." value={province} />
                    </Pressable>
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={{ marginLeft: 5 }}>Quận/Huyện:</Text>
                    <Pressable onPress={() => setDistrictVisiable(true)}>
                      <TextInput readOnly style={styles.input} placeholder="Cầu Giấy, Ba Đình, ..." value={district} />
                    </Pressable>
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={{ marginLeft: 5 }}>Xã/Phường:</Text>
                    <Pressable onPress={() => setWardVisiable(true)}>
                      <TextInput readOnly style={styles.input} placeholder="Quan Hoa, Yên Hòa, ..." value={ward} />
                    </Pressable>
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={{ marginLeft: 5 }}>Địa chỉ chi tiết:</Text>
                    <TextInput style={styles.input} placeholder="Số nhà, ngõ, ngách, đường ..." onChangeText={(text) => setDetail(text)} />
                  </View>
                </View>
              </View>
            </View>

            <View>
              <Pressable onPress={() => setConfirmVisible(true)}>
                <Text style={styles.button}>Thêm </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal transparent animationType="fade" visible={isConfirmVisible}>
          <ConfirmPopup title={"Bạn có muốn thêm phòng không?"} onCancel={() => setConfirmVisible(false)} onSubmit={addRoom} />
        </Modal>

        <Modal visible={roomTypeVisiable} transparent={true} animationType="slide" onRequestClose={() => setRoomTypeVisiable(false)}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: "80%", height: 400, backgroundColor: "white", borderRadius: 8, padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Chọn loại phòng trọ:</Text>
              <FlatList
                scrollEnabled
                showsVerticalScrollIndicator={false}
                data={roomTypes}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ padding: 20, borderBottomWidth: 0.5, borderBottomColor: "#dcdde1" }}
                    onPress={() => {
                      setRoomTypeName(item.name);
                      setRoomType(item.id);
                      setRoomTypeVisiable(false);
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setRoomTypeVisiable(false)} style={{ padding: 10, marginTop: 10 }}>
                <Text style={{ color: "red", textAlign: "center" }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={provinceVisiable} transparent={true} animationType="slide" onRequestClose={() => setProvinceVisiable(false)}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: "80%", height: 400, backgroundColor: "white", borderRadius: 8, padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Chọn Tỉnh/Thành phố:</Text>
              <FlatList
                scrollEnabled
                showsVerticalScrollIndicator={false}
                data={provinces}
                renderItem={({ index, item }) => (
                  <TouchableOpacity
                    key={index}
                    style={{ padding: 20, borderBottomWidth: 0.5, borderBottomColor: "#dcdde1" }}
                    onPress={() => {
                      setProvince(item.province_name);
                      setProvinceVisiable(false);
                      getDistricts(item.province_id);
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{item.province_name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setProvinceVisiable(false)} style={{ padding: 10, marginTop: 10 }}>
                <Text style={{ color: "red", textAlign: "center" }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={districtVisiable} transparent={true} animationType="slide" onRequestClose={() => setDistrictVisiable(false)}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: "80%", height: 400, backgroundColor: "white", borderRadius: 8, padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Chọn Quận/Huyện:</Text>
              <FlatList
                scrollEnabled
                showsVerticalScrollIndicator={false}
                data={districts}
                renderItem={({ index, item }) => (
                  <TouchableOpacity
                    key={index}
                    style={{ padding: 20, borderBottomWidth: 0.5, borderBottomColor: "#dcdde1" }}
                    onPress={() => {
                      setDistrict(item.district_name);
                      setDistrictVisiable(false);
                      getWard(item.district_id);
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{item.district_name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setDistrictVisiable(false)} style={{ padding: 10, marginTop: 10 }}>
                <Text style={{ color: "red", textAlign: "center" }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={wardVisiable} transparent={true} animationType="slide" onRequestClose={() => setWardVisiable(false)}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: "80%", height: 400, backgroundColor: "white", borderRadius: 8, padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Chọn Xã/Phường:</Text>
              <FlatList
                scrollEnabled
                showsVerticalScrollIndicator={false}
                data={wards}
                renderItem={({ index, item }) => (
                  <TouchableOpacity
                    key={index}
                    style={{ padding: 20, borderBottomWidth: 0.5, borderBottomColor: "#dcdde1" }}
                    onPress={() => {
                      setWard(item.ward_name);
                      setWardVisiable(false);
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{item.ward_name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setWardVisiable(false)} style={{ padding: 10, marginTop: 10 }}>
                <Text style={{ color: "red", textAlign: "center" }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 250,
    lineHeight: 50,
    backgroundColor: COLOR.darkGreen,
    textAlign: "center",
    color: "white",
    fontSize: 20,
    margin: "auto",
    borderRadius: 20,
  },

  boxInfo: {
    padding: 10,
    backgroundColor: COLOR.light,
    marginVertical: 10,
    borderRadius: 20,
  },

  boxInfoTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: COLOR.darkGreen,
  },

  boxInput: {
    marginVertical: 5,
  },

  input: {
    borderWidth: 0.5,
    padding: 7,
    borderRadius: 10,
    backgroundColor: COLOR.white,
    color: "black",
  },
});

export default RoomAddScreen;
