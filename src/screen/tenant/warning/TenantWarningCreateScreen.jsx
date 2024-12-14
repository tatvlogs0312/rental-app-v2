import React, { useEffect, useState } from "react";
import { FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { get } from "../../../api/ApiManager";
import { COLOR } from "../../../constants/COLORS";
import MsgInputError from "../../../components/MsgInputError";
import * as ImagePicker from "expo-image-picker";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { getUUID } from "../../../utils/Utils";
import InputTitleImportant from "../../../components/InputTitleImportant";
import axios from "axios";
import { DOMAIN } from "../../../constants/URL";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import LoadingModal from "react-native-loading-modal";

const TenantWarningCreateScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [contracts, setContracts] = useState([]);

  const [roomId, setRoomId] = useState(null);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [files, setFiles] = useState([]);

  const [titleMsg, setTitleMsg] = useState(null);
  const [contentMsg, setContentMsg] = useState(null);
  const [roomMsg, setRoomMsg] = useState(null);

  const [room, setRoom] = useState(null);
  const [contractVisiable, setContractVisiable] = useState(false);

  useEffect(() => {
    if (auth.token !== "") {
      getContracts();
    }
  }, [auth.token]);

  const getContracts = async () => {
    load.isLoading();
    try {
      const response = await get(
        "/rental-service/contract/search-for-tenant",
        {
          status: "SIGNED",
          page: 0,
          size: 10000,
        },
        auth.token,
      );
      setContracts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
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

  const create = async () => {
    try {
      if (validateCreate() === true) {
        load.isLoading();
        const formData = new FormData();
        formData.append("roomId", roomId);
        formData.append("title", title);
        formData.append("content", content);
        files.forEach((file) => {
          formData.append("files", {
            uri: file.uri,
            type: "image/jpeg",
            name: getUUID() + ".jpg",
          });
        });

        await axios.post(DOMAIN + "/rental-service/malfunction-warning/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: auth.token,
          },
        });
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          textBody: "Gửi sự cố đến chủ trọ thành công",
          title: "Thông báo",
        });
        navigation.navigate("TenantWarningList", {
          refresh: getUUID(),
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const validateCreate = () => {
    let isValid = true;
    if (title === null || title === "") {
      setTitleMsg("Vui lòng nhập sự cố");
      isValid = false;
    }

    if (content === null || content === "") {
      setContentMsg("Vui lòng mô tả sự cố của bạn");
      isValid = false;
    }

    if (roomId === null || roomId === "") {
      setRoomMsg("Vui lòng chọn phòng gặp sự cố");
      isValid = false;
    }

    return isValid;
  };

  const setInputTitle = (t) => {
    setTitle(t);
    setTitleMsg(null);
  };

  const setInputContent = (t) => {
    setContent(t);
    setContentMsg(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingModal modalVisible={load.loading} />
      <HeaderBarNoPlus title={"Quay lại"} back={() => navigation.goBack()} />
      <View style={{ margin: 5, padding: 5, flex: 1, backgroundColor: COLOR.white }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View>
              <View>
                <Pressable onPress={() => setContractVisiable(true)} style={{ marginTop: 10 }}>
                  <InputTitleImportant title="Phòng:" />
                  <TextInput placeholder="Chọn phòng" readOnly style={styles.input} value={room} />
                  {roomMsg !== null && roomMsg !== "" && <MsgInputError msg={roomMsg} />}
                </Pressable>
              </View>

              <View>
                <InputTitleImportant title="Sự cố:" />
                <TextInput style={styles.input} placeholder="Điền sự cố" onChangeText={(t) => setInputTitle(t)} value={title} />
                {titleMsg !== null && titleMsg !== "" && <MsgInputError msg={titleMsg} />}
              </View>

              <View>
                <InputTitleImportant title="Mô tả chi tiết sự cố:" />
                <TextInput
                  style={styles.inputMutiline}
                  placeholder="Điền mô tả sự cố chi tiết"
                  multiline
                  onChangeText={(t) => setInputContent(t)}
                  value={content}
                />
                {contentMsg !== null && contentMsg !== "" && <MsgInputError msg={contentMsg} />}
              </View>

              <View>
                <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 5 }}>Hình ảnh sự cố</Text>
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
                        <FontAwesome6Icon name="x" size={10} color={COLOR.white} />
                      </Pressable>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.image} onPress={() => selectImage()}>
                    <FontAwesome6Icon name="plus" size={30} color={COLOR.black} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View>
          <TouchableOpacity onPress={create}>
            <Text style={styles.btn}>Gửi sự cố đến chủ trọ</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={contractVisiable} animationType="slide">
        <View style={{ padding: 10, flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Chọn phòng</Text>
            <Pressable
              style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center", borderRadius: 10 }}
              onPress={() => setContractVisiable(false)}
            >
              <FontAwesome6Icon name="x" color={COLOR.red} size={20} />
            </Pressable>
          </View>
          <View style={{ flex: 1, marginTop: 10 }}>
            <FlatList
              data={contracts}
              renderItem={({ item }) => (
                <View>
                  <Pressable
                    onPress={() => {
                      setRoomId(item.roomId);
                      setContractVisiable(false);
                      setRoom(`${item.houseName} - ${item.roomName}`);
                      setRoomMsg(null);
                    }}
                  >
                    <View style={{ borderBottomWidth: 0.5, paddingHorizontal: 10, paddingVertical: 15, borderColor: COLOR.grey }}>
                      <Text style={{ fontSize: 16 }}>{`${item.houseName} - ${item.roomName}`}</Text>
                    </View>
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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

  inputTitle: {
    fontSize: 15,
    fontWeight: "bold",
    // color: COLOR.grey,
    marginTop: 10,
    marginBottom: 0,
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
});

export default TenantWarningCreateScreen;
