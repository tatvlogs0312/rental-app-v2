import React, { useEffect, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { DOMAIN, IMAGE_DOMAIN } from "../../../constants/URL";
import { get } from "../../../api/ApiManager";
import { COLOR } from "../../../constants/COLORS";
import { useAuth } from "../../../hook/AuthProvider";

const LessorUserScreen = () => {
  const auth = useAuth();

  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (auth.token !== "") {
      getUser();
    }
  }, [auth.token]);

  const getUser = async () => {
    try {
      const data = await get("/rental-service/user-profile/get-information", null, auth.token);
      setUser(data);
      setAvatar(data.avatar);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.assets !== null) {
      const file = result.assets[0];
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: "image/jpeg", // hoặc định dạng phù hợp với ảnh của bạn
        name: "photo.jpg",
      });
      axios
        .post(DOMAIN + "/rental-service/user-profile/upload-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: auth.token,
          },
        })
        .then((res) => setAvatar(res.data))
        .catch((err) => console.log(JSON.stringify(err)));
    }
  };

  return (
    <>
      {user && (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.white }}>
          <View>
            <View style={{ padding: 20, flexDirection: "row", borderBottomWidth: 0.5, borderColor: COLOR.primary, backgroundColor: COLOR.primary }}>
              <View style={{ position: "relative", marginTop: 10 }}>
                <Image source={{ uri: `${IMAGE_DOMAIN}/${avatar}` }} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 100 }} />
                <Pressable
                  style={{ position: "absolute", right: 0, bottom: 0, padding: 5, backgroundColor: COLOR.white, borderRadius: 100 }}
                  onPress={uploadAvatar}
                >
                  <FontAwesome6 name="camera" size={20} />
                </Pressable>
              </View>
              <View style={{ flexDirection: "column", justifyContent: "flex-end", marginLeft: 20 }}>
                <Text style={{ fontSize: 18, color: COLOR.white }}>{user.role === "LESSOR" ? "Chủ trọ" : "Khách thuê"}</Text>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: COLOR.white }}>{user.firstName + " " + user.lastName}</Text>
              </View>
            </View>
            {/* </LinearGradient> */}
          </View>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 10, margin: 10, backgroundColor: COLOR.white, elevation: 5, borderRadius: 5 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: COLOR.primary }}>Thông tin cá nhân:</Text>
                <Pressable>
                  <FontAwesome6 name="pen-to-square" size={20} color={COLOR.primary} />
                </Pressable>
              </View>
              <View>
                <View style={styles.info}>
                  <Text>Số điện thoại:</Text>
                  <TextInput value="0381551953" style={styles.infoInput} />
                </View>
                <View style={styles.info}>
                  <Text>Email:</Text>
                  <TextInput value="tanhtuan093@gmail.com" style={styles.infoInput} />
                </View>
              </View>
            </View>
            {/* <View style={{ padding: 10, margin: 10, backgroundColor: COLOR.white, elevation: 5, borderRadius: 5 }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: COLOR.primary }}>Tiện ích:</Text>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    padding: 10,
                    marginVertical: 3,
                    borderRadius: 10,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignContent: "center",
                    // backgroundColor: COLOR.white,
                    // elevation: 2,
                  }}
                >
                  <FontAwesome6 name="file-contract" size={20} color={COLOR.primary} />
                  <Text style={{ marginLeft: 10, fontSize: 16 }}>Hợp đồng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: 10,
                    marginVertical: 3,
                    borderRadius: 10,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignContent: "center",
                  }}
                >
                  <FontAwesome6 name="money-bill-wave" size={20} color={COLOR.primary} />
                  <Text style={{ marginLeft: 10, fontSize: 16 }}>Hóa đơn</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: 10,
                    marginVertical: 3,
                    borderRadius: 10,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignContent: "center",
                  }}
                >
                  <FontAwesome6 name="triangle-exclamation" size={20} color={COLOR.primary} />
                  <Text style={{ marginLeft: 10, fontSize: 16 }}>Thông báo sự cố</Text>
                </TouchableOpacity>
              </View>
            </View> */}
            <View>
              <TouchableOpacity onPress={() => auth.logout()}>
                <Text style={styles.btn}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  info: {
    marginTop: 10,
  },

  infoInput: {
    borderBottomWidth: 0.5,
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
});

export default LessorUserScreen;
