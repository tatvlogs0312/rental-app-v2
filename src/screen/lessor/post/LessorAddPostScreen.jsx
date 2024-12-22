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
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import MsgInputError from "../../../components/MsgInputError";
import { ConvertMoneyV4 } from "../../../utils/Utils";

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

  const [titleMsg, setTitleMsg] = useState(null);
  const [contentMsg, setContentMsg] = useState(null);
  const [numberOfRoomMsg, setNumberOfRoomMsg] = useState(null);
  const [acreageMsg, setAcreageMsg] = useState(null);
  const [priceMsg, setPriceMsg] = useState(null);
  const [roomTypeMsg, setRoomTypeMsg] = useState(null);
  const [wardMsg, setWardMsg] = useState(null);
  const [districtMsg, setDistrictMsg] = useState(null);
  const [provinceMsg, setProvinceMsg] = useState(null);
  const [detailMsg, setDetailMsg] = useState(null);
  const [filesMsg, setFilesMsg] = useState(null);

  const [priceValue, setPriceValue] = useState(null);

  const [provinceVisiable, setProvinceVisiable] = useState(false);
  const [wardVisiable, setWardVisiable] = useState(false);
  const [districtVisiable, setDistrictVisiable] = useState(false);

  useEffect(() => {
    getRoomTypes();
    getProvinces();
  }, []);

  const getRoomTypes = async () => {
    try {
      const data = await post("/rental-service/room-type/search", {}, null);
      setRoomTypes(data.data);
    } catch (error) {
      console.log(error);
    }
  };

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

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [6, 4],
    });

    if (result.assets !== null) {
      setFiles([...files, result.assets[0]]);
      setFilesMsg(null);
    }
  };

  const addPost = async () => {
    try {
      load.isLoading();
      if (createValidate() === true) {
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
        const response = await axios.post(DOMAIN + "/rental-service/post/create", formData, {
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
        navigation.navigate("LessorPostList", {
          refresh: uuid.v4(),
        });
      }
    } catch (error) {
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
  };

  const createValidate = () => {
    let isValid = true;
    if (title === null || title === "") {
      setTitleMsg("Vui lòng điền tiêu đề");
      isValid = false;
    }

    if (content === null || content === "") {
      setContentMsg("Vui lòng điền nội dung");
      isValid = false;
    }

    if (numberOfRoom === null || numberOfRoom === "") {
      setNumberOfRoomMsg("Vui lòng điền số phòng ngủ");
      isValid = false;
    }

    if (acreage === null || acreage === "") {
      setAcreageMsg("Vui lòng điền diện tích phòng");
      isValid = false;
    }

    if (price === null || price === "") {
      setPriceMsg("Vui lòng điền giá cho thuê");
      isValid = false;
    }

    if (province === null || province === "") {
      setProvinceMsg("Vui lòng chọn tỉnh/thành phố");
      isValid = false;
    }

    if (district === null || district === "") {
      setDistrictMsg("Vui lòng chọn quận/hiện");
      isValid = false;
    }

    if (ward === null || ward === "") {
      setWardMsg("Vui lòng chọn xã/phường");
      isValid = false;
    }

    if (detail === null || detail === "") {
      setDetailMsg("Vui lòng nhập vị trí phòng");
      isValid = false;
    }

    if (roomType === null || roomType === "") {
      setRoomTypeMsg("Vui lòng chọn loại phòng");
      isValid = false;
    }

    if (files.length < 1) {
      setFilesMsg("Vui lòng chọn tối thiểu 1 ảnh");
      isValid = false;
    }

    return isValid;
  };

  const setInputPrice = (t) => {
    setPrice(t.replace(".", ""));
    setPriceValue(ConvertMoneyV4(t));
    setPriceMsg(null);
  };

  return (
    <>
      <LoadingModal modalVisible={load.loading} />
      <View style={{ flex: 1 }}>
        <HeaderBarNoPlus title={"Tạo bài viết"} back={() => navigation.goBack()} />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ padding: 5, backgroundColor: COLOR.white }}>
            <View style={{ marginHorizontal: 10 }}>
              {/* Tiêu đề */}
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Tiêu đề"
                  onChangeText={(t) => {
                    setTitle(t);
                    setTitleMsg(null);
                  }}
                  value={title}
                />
                {titleMsg !== null && titleMsg !== "" && <MsgInputError msg={titleMsg} />}
              </View>

              {/* Nội dung */}
              <View>
                <TextInput
                  style={styles.inputMutiline}
                  placeholder="Nội dung ..."
                  multiline
                  onChangeText={(t) => {
                    setContent(t);
                    setContentMsg(null);
                  }}
                  value={content}
                />
                {contentMsg !== null && contentMsg !== "" && <MsgInputError msg={contentMsg} />}
              </View>

              {/* Số phòng ngủ */}
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                  <TextInput
                    style={styles.input2}
                    placeholder="Số phòng ngủ"
                    keyboardType="number-pad"
                    onChangeText={(t) => {
                      setNumberOfRoom(t);
                      setNumberOfRoomMsg(null);
                    }}
                    value={numberOfRoom}
                  />
                  {numberOfRoomMsg !== null && numberOfRoomMsg !== "" && <MsgInputError msg={numberOfRoomMsg} />}
                </View>

                {/* Diện tích */}
                <View>
                  <TextInput
                    style={styles.input2}
                    placeholder="Diện tích (m²)"
                    keyboardType="number-pad"
                    onChangeText={(t) => {
                      setAcreage(t);
                      setAcreageMsg(null);
                    }}
                    value={acreage}
                  />
                  {acreageMsg !== null && acreageMsg !== "" && <MsgInputError msg={acreageMsg} />}
                </View>
              </View>

              {/* Giá cho thuê */}
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Giá cho thuê"
                  onChangeText={(t) => setInputPrice(t)}
                  value={priceValue}
                  keyboardType="number-pad"
                />
                {priceMsg !== null && priceMsg !== "" && <MsgInputError msg={priceMsg} />}
              </View>

              <Pressable onPress={() => setProvinceVisiable(true)}>
                <TextInput style={styles.input} placeholder="Tỉnh/Thành phố" readOnly value={province} />
                {provinceMsg !== null && provinceMsg !== "" && <MsgInputError msg={provinceMsg} />}
              </Pressable>

              <Pressable onPress={() => setDistrictVisiable(true)}>
                <TextInput style={styles.input} placeholder="Quận/Huyện" readOnly value={district} />
                {districtMsg !== null && districtMsg !== "" && <MsgInputError msg={districtMsg} />}
              </Pressable>

              <Pressable onPress={() => setWardVisiable(true)}>
                <TextInput style={styles.input} placeholder="Xã/Phường" readOnly value={ward} />
                {wardMsg !== null && wardMsg !== "" && <MsgInputError msg={wardMsg} />}
              </Pressable>

              <View>
                <TextInput
                  style={styles.inputMutiline}
                  placeholder="Địa chỉ (Số nhà, ngõ, ngách, đường, ...)"
                  multiline
                  onChangeText={(t) => {
                    setDetail(t);
                    setDetailMsg(null);
                  }}
                  value={detail}
                />
                {detailMsg !== null && detailMsg !== "" && <MsgInputError msg={detailMsg} />}
              </View>

              <View>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>Loại phòng</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {roomTypes.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        setRoomType(item.id);
                        setRoomTypeIndex(index);
                        setRoomTypeMsg(null);
                      }}
                    >
                      <Text
                        style={
                          index === roomTypeIndex
                            ? { fontSize: 16, padding: 6, borderRadius: 10, margin: 5, backgroundColor: COLOR.primary, color: COLOR.white }
                            : { fontSize: 16, padding: 5, borderWidth: 1, borderRadius: 10, margin: 5, color: COLOR.primary, borderColor: COLOR.primary }
                        }
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {roomTypeMsg !== null && roomTypeMsg !== "" && <MsgInputError msg={roomTypeMsg} />}
              </View>

              <View>
                <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>Hình ảnh</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {files.map((file) => (
                    <View style={{ position: "relative" }}>
                      <Image source={{ uri: file.uri }} style={styles.image} />
                      <Pressable
                        style={{
                          backgroundColor: COLOR.primary,
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
                {filesMsg !== null && filesMsg !== "" && <MsgInputError msg={filesMsg} />}
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
                  style={{ padding: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#dcdde1" }}
                  onPress={() => {
                    setProvince(item.province_name);
                    setDistrict(null);
                    setWard(null);
                    setProvinceVisiable(false);
                    getDistricts(item.province_id);
                    setProvinceMsg(null);
                    setWards([]);
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

  input2: {
    color: COLOR.black,
    marginVertical: 10,
    height: 50,
    width: 160,
    padding: 10,
    borderWidth: 1,
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
    borderWidth: 1,
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
    marginVertical: 20,
    textAlign: "center",
    width: "100%",
    margin: "auto",
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLOR.primary,
    color: COLOR.white,
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default LessorAddPostScreen;
