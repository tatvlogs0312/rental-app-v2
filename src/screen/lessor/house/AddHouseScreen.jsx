import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, Modal, FlatList } from "react-native";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { COLOR } from "../../../constants/COLORS";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { get, post } from "../../../api/ApiManager";
import { useEffect } from "react";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import uuid from "react-native-uuid";
import { getUUID } from "../../../utils/Utils";

const AddHouseScreen = ({ navigation }) => {
  const auth = useAuth();
  const load = useLoading();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [houseName, setHouseName] = useState(null);
  const [ward, setWard] = useState(null);
  const [district, setDistrict] = useState(null);
  const [province, setProvince] = useState(null);
  const [detail, setDetail] = useState(null);

  const [provinceVisiable, setProvinceVisiable] = useState(false);
  const [wardVisiable, setWardVisiable] = useState(false);
  const [districtVisiable, setDistrictVisiable] = useState(false);

  useEffect(() => {
    getProvinces();
  }, []);

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

  const addHouse = async () => {
    if (handleInput() === true) {
      try {
        load.isLoading();
        const res = await post(
          "/house/create",
          {
            houseName: houseName,
            positionDetail: detail,
            ward: ward,
            district: district,
            province: province,
          },
          auth.token,
        );
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          textBody: "Thêm nhà thành công",
          title: "Thông báo",
        });
        navigation.navigate("HouseList", {
          refresh: getUUID(),
        });
      } catch (error) {
        console.log(error);
      } finally {
        load.nonLoading();
      }
    }
  };

  const handleInput = () => {
    if (
      houseName === null ||
      houseName === "" ||
      detail === null ||
      detail === "" ||
      ward === null ||
      ward === "" ||
      district === null ||
      district === "" ||
      province === null ||
      province === ""
    ) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: "Vui lòng nhập đầy đủ thông tin",
        title: "Thông báo",
      });
      return false;
    }
    return true;
  };

  return (
    <>
      <LoadingModal modalVisible={load.loading} />
      <View style={{ flex: 1, backgroundColor: COLOR.white }}>
        <HeaderBarNoPlus title={"Thêm nhà"} back={() => navigation.goBack()} />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ padding: 5, margin: 5, elevation: 1 }}>
            <View style={{ marginHorizontal: 10 }}>
              <View style={styles.inputBackgroud}>
                <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Tên nhà:</Text>
                <TextInput style={styles.input} placeholder="Nhập tên nhà" onChangeText={(t) => setHouseName(t)} value={houseName} />
              </View>
              <Pressable onPress={() => setProvinceVisiable(true)} style={styles.inputBackgroud}>
                <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Tỉnh/Thành phố:</Text>
                <TextInput style={styles.input} placeholder="Chọn tỉnh/thành phố" readOnly value={province} />
              </Pressable>
              <Pressable onPress={() => setDistrictVisiable(true)} style={styles.inputBackgroud}>
                <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Quận/Huyện:</Text>
                <TextInput style={styles.input} placeholder="Chọn quận/huyện" readOnly value={district} />
              </Pressable>
              <Pressable onPress={() => setWardVisiable(true)} style={styles.inputBackgroud}>
                <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Xã/Phường:</Text>
                <TextInput style={styles.input} placeholder="Chọn xã/phường" readOnly value={ward} />
              </Pressable>
              <View style={{ marginTop: 10 }}>
                <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Địa chỉ chi tiết:</Text>
                <TextInput
                  style={styles.inputMutiline}
                  placeholder="Nhập địa chỉ (Số nhà, ngõ, ngách, đường, ...)"
                  multiline
                  onChangeText={(t) => setDetail(t)}
                  value={detail}
                />
              </View>
            </View>
            <View>
              <TouchableOpacity onPress={addHouse}>
                <Text style={styles.btn}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

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
                    setDistrict(null);
                    setWard(null);
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
                    setWard(null);
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
    </>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginTop: 20,
    textAlign: "center",
    // width: 200,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLOR.primary,
    color: COLOR.white,
    fontWeight: "bold",
    fontSize: 17,
  },

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

  inputMutiline: {
    color: COLOR.black,
    textAlignVertical: "top",
    marginVertical: 10,
    height: 100,
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

  inputBackgroud: {
    marginTop: 10,
    // borderBottomWidth: 0.5,
  },
});

export default AddHouseScreen;
