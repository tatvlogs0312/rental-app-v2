import React, { useEffect, useState } from "react";
import { FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../../constants/COLORS";
import { get, post } from "../../../api/ApiManager";
import { TouchableOpacity } from "react-native";
import { DOMAIN, IMAGE_DOMAIN } from "../../../constants/URL";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useLoading } from "../../../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import uuid from "react-native-uuid";

const LessorAddPostScreen = ({ navigation }) => {
  const auth = useAuth();
  const load = useLoading();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  const [roomTypeIndex, setRoomTypeIndex] = useState(null);

  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [numberOfRoom, setNumberOfRoom] = useState(null);
  const [acreage, setAcreage] = useState(null);
  const [price, setPrice] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [ward, setWard] = useState(null);
  const [district, setDistrict] = useState(null);
  const [province, setProvince] = useState(null);
  const [detail, setDetail] = useState(null);
  const [files, setFiles] = useState([]);

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

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [6, 4],
    });

    if (result.assets !== null) {
      setFiles([...files, result.assets[0]]);
    }
  };

  const addPost = async () => {
    load.isLoading();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("positionDetail", detail);
      formData.append("ward", ward);
      formData.append("district", district);
      formData.append("province", province);
      formData.append("price", price);
      formData.append("acreage", acreage);
      formData.append("numberOfRoom", numberOfRoom);
      formData.append("roomType", roomType);
      files.forEach((file) => {
        formData.append("files", {
          uri: file.uri,
          type: "image/jpeg",
          name: uuid.v4() + ".jpg",
        });
      });
      const response = await axios.post(DOMAIN + "/post/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: auth.token,
        },
      });
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Đăng bài thành công",
        title: "Thông báo",
      });
      navigation.push("LessorPostList");
    } catch (error) {
      console.log(error);
      console.log(JSON.stringify(error));
    } finally {
      load.nonLoading();
    }
  };

  return (
    <>
      <LoadingModal modalVisible={load.loading} />
      <View style={{ flex: 1, backgroundColor: COLOR.white }}>
        <View style={{ padding: 15, flexDirection: "row", alignItems: "center" }}>
          <Pressable style={styles.icon} onPress={() => navigation.goBack()}>
            <FontAwesome6 name="angle-left" size={25} color={COLOR.white} />
          </Pressable>
          <Text style={{ fontSize: 25, marginLeft: 5 }}>Tạo bài viết</Text>
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ padding: 10 }}>
            <View style={{ marginHorizontal: 10 }}>
              <View>
                <TextInput style={styles.input} placeholder="Tiêu đề" onChangeText={(t) => setTitle(t)} value={title} />
              </View>
              <View>
                <TextInput style={styles.inputMutiline} placeholder="Nội dung ..." multiline onChangeText={(t) => setContent(t)} value={content} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TextInput
                  style={styles.input2}
                  placeholder="Số phòng ngủ"
                  keyboardType="number-pad"
                  onChangeText={(t) => setNumberOfRoom(t)}
                  value={numberOfRoom}
                />
                <TextInput style={styles.input2} placeholder="Diện tích (m²)" keyboardType="number-pad" onChangeText={(t) => setAcreage(t)} value={acreage} />
              </View>
              <View>
                <TextInput style={styles.input} placeholder="Giá cho thuê" onChangeText={(t) => setPrice(t)} value={price} keyboardType="number-pad" />
              </View>
              <Pressable onPress={() => setProvinceVisiable(true)}>
                <TextInput style={styles.input} placeholder="Tỉnh/Thành phố" readOnly value={province} />
              </Pressable>
              <Pressable onPress={() => setDistrictVisiable(true)}>
                <TextInput style={styles.input} placeholder="Quận/Huyện" readOnly value={district} />
              </Pressable>
              <Pressable onPress={() => setWardVisiable(true)}>
                <TextInput style={styles.input} placeholder="Xã/Phường" readOnly value={ward} />
              </Pressable>
              <View>
                <TextInput
                  style={styles.inputMutiline}
                  placeholder="Địa chỉ (Số nhà, ngõ, ngách, đường, ...)"
                  multiline
                  onChangeText={(t) => setDetail(t)}
                  value={detail}
                />
              </View>
              <View>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>Loại phòng</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {roomTypes.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        setRoomType(item.id);
                        setRoomTypeIndex(index);
                      }}
                    >
                      <Text
                        style={
                          index === roomTypeIndex
                            ? { fontSize: 15, padding: 5, borderWidth: 1, borderRadius: 10, margin: 5, backgroundColor: COLOR.black, color: COLOR.white }
                            : { fontSize: 15, padding: 5, borderWidth: 1, borderRadius: 10, margin: 5 }
                        }
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>Hình ảnh</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {files.map((file) => (
                    <View style={{ position: "relative" }}>
                      <Image source={{ uri: file.uri }} style={styles.image} />
                      <Pressable
                        style={{
                          backgroundColor: COLOR.black,
                          position: "absolute",
                          top: 5,
                          right: 15,
                          width: 25,
                          height: 25,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 20,
                        }}
                        onPress={() => setFiles(files.filter((f) => f !== file))}
                      >
                        <FontAwesome6 name="x" size={10} color={COLOR.white} />
                      </Pressable>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.image} onPress={() => selectImage()}>
                    <FontAwesome6 name="plus" size={30} color={COLOR.black} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              <TouchableOpacity onPress={() => addPost()}>
                <Text style={styles.btn}>Đăng tin</Text>
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
  icon: {
    padding: 5,
    backgroundColor: COLOR.black,
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

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

  input2: {
    color: COLOR.black,
    marginVertical: 10,
    height: 50,
    width: 160,
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

  inputMutiline: {
    color: COLOR.black,
    textAlignVertical: "top",
    marginVertical: 10,
    height: 100,
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
});

export default LessorAddPostScreen;
