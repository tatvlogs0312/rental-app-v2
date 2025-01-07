import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, Modal, FlatList, Image } from "react-native";
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
import * as ImagePicker from "expo-image-picker";
import { getUUID } from "../../../utils/Utils";
import MsgInputError from "../../../components/MsgInputError";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { faL } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { DOMAIN } from "../../../constants/URL";

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
  const [image, setImage] = useState(null);

  const [houseNameMsg, setHouseNameMsg] = useState(null);
  const [wardMsg, setWardMsg] = useState(null);
  const [districtMsg, setDistrictMsg] = useState(null);
  const [provinceMsg, setProvinceMsg] = useState(null);
  const [detailMsg, setDetailMsg] = useState(null);
  const [imageMsg, setImageMsg] = useState(null);

  const [provinceVisiable, setProvinceVisiable] = useState(false);
  const [wardVisiable, setWardVisiable] = useState(false);
  const [districtVisiable, setDistrictVisiable] = useState(false);

  useEffect(() => {
    getProvinces();
  }, []);

  const getProvinces = async () => {
    try {
      const data = await get("/rental-service/province", {}, null);
      setProvinces(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDistricts = async (provinceId) => {
    try {
      const data = await get("/rental-service/province/district", { provinceId: provinceId }, null);
      setDistricts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getWard = async (districtId) => {
    try {
      const data = await get("/rental-service/province/ward", { districtId: districtId }, null);
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
          "/rental-service/house/create",
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

  const addHouseV2 = async () => {
    if (handleInput() === true) {
      try {
        load.isLoading();
        const formData = new FormData();
        formData.append("houseName", houseName);
        formData.append("positionDetail", detail);
        formData.append("ward", ward);
        formData.append("district", district);
        formData.append("province", province);
        formData.append("image", {
          uri: image.uri,
          type: "image/jpeg",
          name: getUUID() + ".jpg",
        });
        await axios.post(DOMAIN + "/rental-service/house/create/v2", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: auth.token,
          },
        });
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          textBody: "Thêm nhà thành công",
          title: "Thông báo",
        });
        navigation.navigate("HouseList", {
          refresh: getUUID(),
        });
      } catch (error) {
        console.log("====================================");
        console.log(JSON.stringify(error));
        console.log("====================================");
        let errorMessage = "Đã có lỗi xảy ra, vui lòng thử lại sau.";

        if (error.response) {
          errorMessage = error.response.data.message || errorMessage;
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage = "Network error. Please check your connection.";
        }

        Toast.show({
          type: ALERT_TYPE.DANGER,
          textBody: errorMessage,
          title: "Lỗi",
        });
      } finally {
        load.nonLoading();
      }
    }
  };

  const handleInput = () => {
    let isValid = true;
    if (houseName === null || houseName === "") {
      setHouseNameMsg("Vui lòng điền tên nhà");
      isValid = false;
    }
    if (province === null || province === "") {
      setProvinceMsg("Vui lòng chọn tỉnh/thành phố");
      isValid = false;
    }
    if (district === null || district === "") {
      setDistrictMsg("Vui lòng chọn quận/huyện");
      isValid = false;
    }
    if (ward === null || ward === "") {
      setWardMsg("Vui lòng chọn xã/phường");
      isValid = false;
    }
    if (detail === null || detail === "") {
      setDetailMsg("Vui lòng điền địa chỉ cụ thể");
      isValid = false;
    }
    if (image === null) {
      setImageMsg("Vui lòng thêm hình ảnh nhà");
      isValid = false;
    }
    return isValid;
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [6, 4],
    });

    if (result.assets !== null) {
      setImage(result.assets[0]);
      setImageMsg(null);
    }
  };

  return (
    <>
      <LoadingModal modalVisible={load.loading} />
      <View style={{ flex: 1 }}>
        <HeaderBarNoPlus title={"Thêm nhà"} back={() => navigation.goBack()} />
        <View style={{ flex: 1, backgroundColor: COLOR.white, margin: 5, borderRadius: 5 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ padding: 5, margin: 5 }}>
              <View style={{ marginHorizontal: 10 }}>
                <View style={styles.inputBackgroud}>
                  <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Tên nhà:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập tên nhà"
                    onChangeText={(t) => {
                      setHouseName(t);
                      setHouseNameMsg(null);
                    }}
                    value={houseName}
                  />
                  {houseNameMsg !== null && houseNameMsg !== "" && <MsgInputError msg={houseNameMsg} />}
                </View>

                <Pressable onPress={() => setProvinceVisiable(true)} style={styles.inputBackgroud}>
                  <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Tỉnh/Thành phố:</Text>
                  <TextInput style={styles.input} placeholder="Chọn tỉnh/thành phố" readOnly value={province} />
                  {provinceMsg !== null && provinceMsg !== "" && <MsgInputError msg={provinceMsg} />}
                </Pressable>

                <Pressable onPress={() => setDistrictVisiable(true)} style={styles.inputBackgroud}>
                  <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Quận/Huyện:</Text>
                  <TextInput style={styles.input} placeholder="Chọn quận/huyện" readOnly value={district} />
                  {districtMsg !== null && districtMsg !== "" && <MsgInputError msg={districtMsg} />}
                </Pressable>

                <Pressable onPress={() => setWardVisiable(true)} style={styles.inputBackgroud}>
                  <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Xã/Phường:</Text>
                  <TextInput style={styles.input} placeholder="Chọn xã/phường" readOnly value={ward} />
                  {wardMsg !== null && wardMsg !== "" && <MsgInputError msg={wardMsg} />}
                </Pressable>

                <View style={{ marginTop: 10 }}>
                  <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Địa chỉ chi tiết:</Text>
                  <TextInput
                    style={styles.inputMutiline}
                    placeholder="Nhập địa chỉ (Số nhà, ngõ, ngách, đường, ...)"
                    multiline
                    onChangeText={(t) => {
                      setDetail(t);
                      setDetailMsg(null);
                    }}
                    value={detail}
                  />
                  {detailMsg !== null && detailMsg !== "" && <MsgInputError msg={detailMsg} />}
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Hình ảnh nhà:</Text>
                  {image === null ? (
                    <TouchableOpacity style={styles.image} onPress={() => selectImage()}>
                      <FontAwesome6Icon name="plus" size={30} color={COLOR.black} />
                    </TouchableOpacity>
                  ) : (
                    <View style={{ position: "relative", width: 100, height: 100 }}>
                      <Image source={{ uri: image.uri }} style={styles.image} />
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
                        }}
                        onPress={() => setImage(null)}
                      >
                        <FontAwesome6Icon name="x" size={10} color={COLOR.red} />
                      </Pressable>
                    </View>
                  )}
                  {imageMsg !== null && imageMsg !== "" && <MsgInputError msg={imageMsg} />}
                </View>
              </View>
              <View>
                <TouchableOpacity onPress={addHouseV2}>
                  <Text style={styles.btn}>Thêm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
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
                  style={{ padding: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#dcdde1" }}
                  onPress={() => {
                    setProvince(item.province_name);
                    setDistrict(null);
                    setWard(null);
                    setProvinceVisiable(false);
                    getDistricts(item.province_id);
                    setWards([]);
                    setProvinceMsg(null);
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
                  style={{ padding: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#dcdde1" }}
                  onPress={() => {
                    setDistrict(item.district_name);
                    setWard(null);
                    setDistrictVisiable(false);
                    getWard(item.district_id);
                    setDistrictMsg(null);
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
                  style={{ padding: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#dcdde1" }}
                  onPress={() => {
                    setWard(item.ward_name);
                    setWardVisiable(false);
                    setWardMsg(null);
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLOR.grey,
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLOR.grey,
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
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: COLOR.light,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddHouseScreen;
