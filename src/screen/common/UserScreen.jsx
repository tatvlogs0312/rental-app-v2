import React, { useEffect, useState } from "react";
import { Button, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../hook/AuthProvider";
import { get, post } from "../../api/ApiManager";
import { COLOR } from "../../constants/COLORS";
import { DOMAIN, IMAGE_DOMAIN } from "../../constants/URL";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const UserScreen = () => {
  const auth = useAuth();

  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("edf593c8-9666-4a55-b25e-5fa833bb10d2.png");

  useEffect(() => {
    if (auth.token !== "") {
      getUser();
    }
  }, [auth.token]);

  const getUser = async () => {
    try {
      const data = await get("/user-profile/get-information", null, auth.token);
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
        .post(DOMAIN + "/user-profile/upload-avatar", formData, {
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
          <View style={{ padding: 10, flexDirection: "row", borderBottomWidth: 0.5, borderColor: COLOR.black }}>
            <View style={{ position: "relative" }}>
              <Image source={{ uri: `${IMAGE_DOMAIN}/${avatar}` }} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 100 }} />
              <Pressable
                style={{ position: "absolute", right: 0, bottom: 0, padding: 5, backgroundColor: COLOR.white, borderRadius: 100 }}
                onPress={uploadAvatar}
              >
                <FontAwesome6 name="camera" size={20} />
              </Pressable>
            </View>
            <View style={{ flexDirection: "column", justifyContent: "flex-end", marginLeft: 10 }}>
              <Text style={{ fontSize: 18 }}>{user.role === "LESSOR" ? "Chủ trọ" : "Khách thuê"}</Text>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user.firstName + " " + user.lastName}</Text>
            </View>
          </View>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
              <View>
                <Text>Thông tin cá nhân:</Text>
              </View>
              <View>
                {/* <View
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text>Căn cước công dân/Chứng minh nhân dân:</Text>
                  <View>
                    <Image
                      source={{ uri: `${IMAGE_DOMAIN}/${"8a926c62-07fa-46eb-ba3c-a854ec9e310e.png"}` }}
                      style={{ width: "auto", height: 210, objectFit: "cover", borderRadius: 10 }}
                    />
                  </View>
                </View> */}
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
    backgroundColor: COLOR.black,
    color: COLOR.white,
    fontWeight: "bold",
    fontSize: 17,
  },
});

export default UserScreen;
