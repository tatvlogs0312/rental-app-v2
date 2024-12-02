import React, { useEffect, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { DOMAIN, IMAGE_DOMAIN } from "../../../constants/URL";
import { get, post } from "../../../api/ApiManager";
import { COLOR } from "../../../constants/COLORS";
import { useAuth } from "../../../hook/AuthProvider";

const LessorUserScreen = ({ navigation }) => {
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

  const logout = async () => {
    const unSubrile = await post("/rental-service/fcm/unsubscribe/" + fcm.deviceId, {}, auth.token);
    auth.logout();
  };

  return (
    <>
      {user && (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.white }}>
          <View>
            <View
              style={{
                padding: 20,
                flexDirection: "row",
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderColor: COLOR.primary,
                backgroundColor: COLOR.primary,
              }}
            >
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
            <View style={{ margin: 10, backgroundColor: COLOR.white, elevation: 5, borderRadius: 5 }}>
              <TouchableOpacity style={styles.menu}>
                <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome6 name="user" size={16} color={COLOR.primary} />
                </View>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Thông tin cá nhân</Text>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", padding: 5 }}>
                    <FontAwesome6 name="angle-right" size={15} color={COLOR.primary} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate("ChangePassword")}>
                <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome6 name="retweet" size={16} color={COLOR.primary} />
                </View>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Đổi mật khẩu</Text>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", padding: 5 }}>
                    <FontAwesome6 name="angle-right" size={15} color={COLOR.primary} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menu}>
                <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome6 name="book" size={16} color={COLOR.primary} />
                </View>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Điều khoản và chính sách</Text>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", padding: 5 }}>
                    <FontAwesome6 name="angle-right" size={15} color={COLOR.primary} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ margin: 10 }}>
              <TouchableOpacity onPress={logout}>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  btn: {
    marginTop: 20,
    width: "100%",
    textAlign: "center",
    margin: "auto",
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLOR.lightOrange,
    color: COLOR.primary,
    fontWeight: "bold",
    fontSize: 17,
  },

  menu: {
    padding: 10,
    marginVertical: 3,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLOR.grey,
  },
});

export default LessorUserScreen;
