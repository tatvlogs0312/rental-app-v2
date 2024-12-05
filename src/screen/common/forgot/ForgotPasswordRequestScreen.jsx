import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import HeaderBarNoPlus from "./../../../components/header/HeaderBarNoPlus";
import { COLOR } from "../../../constants/COLORS";
import { TouchableOpacity } from "react-native";
import { useLoading } from "../../../hook/LoadingProvider";
import { get } from "../../../api/ApiManager";

const ForgotPasswordRequestScreen = ({ navigation, route }) => {
  const load = useLoading();

  const [username, setUsername] = useState(null);
  const [usernameMsg, setUsernameMsg] = useState(null);

  const setInputUsername = (text) => {
    setUsername(text);
    setUsernameMsg(null);
  };

  const getUser = async () => {
    if (checkValid() === true) {
      try {
        load.isLoading();
        const res = await get("/rental-service/user-profile/get/" + username, {}, null);
        if (res) {
          navigation.navigate("ForgotPasswordOtp", { username: username });
          // navigation.navigate("ForgotPasswordChange", { username: username });
        }
      } catch (error) {
        console.log(error);
      } finally {
        load.nonLoading();
      }
    }
  };

  const checkValid = () => {
    let isValid = true;
    if (username === "" || username === null) {
      setUsernameMsg("Vui lòng nhập tài khoản của bạn");
      isValid = false;
    }

    return isValid;
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderBarNoPlus title={"Quay lại"} back={() => navigation.goBack()} />
      <View style={{ flex: 1, margin: 5, padding: 10, backgroundColor: COLOR.white }}>
        <View style={{ marginBottom: 20, marginTop: 25 }}>
          <Text>
            <Text style={{ color: COLOR.red }}>* </Text>
            <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Tài khoản đăng nhập</Text>
          </Text>
          <TextInput style={styles.input} placeholder="Nhập tài khoản đăng nhập" value={username} onChangeText={(t) => setInputUsername(t)} />
          {usernameMsg !== null && <Text style={{ color: "red", fontSize: 12, textAlign: "left" }}>{usernameMsg}</Text>}
        </View>
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity onPress={getUser}>
            <Text style={styles.btn}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

  btn: {
    marginTop: 20,
    textAlign: "center",
    width: "100%",
    margin: "auto",
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLOR.primary,
    color: COLOR.white,
    fontWeight: "bold",
    fontSize: 17,
  },
});

export default ForgotPasswordRequestScreen;
