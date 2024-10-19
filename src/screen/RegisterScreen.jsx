import React, { useEffect, useState } from "react";
import { Keyboard, TouchableOpacity } from "react-native";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { COLOR } from "../constants/COLORS";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import GoogleSVG from "../../assets/svg/google.svg";
import Facebook from "../../assets/svg/facebook.svg";
import TwitterSVG from "../../assets/svg/twitter.svg";
import InputField from "../components/InputField";
import { CheckBox } from "@rneui/themed";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [msgUsername, setMsgUsername] = useState("");
  const [msgPassword, setMsgPassword] = useState("");
  const [msgConfirmPassword, setMsgConfirmPassword] = useState("");

  const setInputUsername = (text) => {
    setUsername(text);
    setMsgUsername("");
  };

  const setInputPassword = (text) => {
    setPassword(text);
    setMsgPassword("");
  };

  const setInputConfirmPassword = (text) => {
    setConfirmPassword(text);
    setMsgConfirmPassword("");
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {});
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {});

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text style={styles.loginTxt}>Đăng ký tài khoản</Text>
      <View style={styles.form}>
        <View>
          <View style={styles.textInput}>
            <InputField value={username} onChangeText={(text) => setInputUsername(text)} placeholder={"Tài khoản"} onSubmitEditing={Keyboard.dismiss} />
            {msgUsername !== "" && <Text style={{ color: "red", fontSize: 12, textAlign: "left" }}>{msgUsername}</Text>}
          </View>

          <View style={styles.textInput}>
            <InputField value={password} onChangeText={(text) => setInputPassword(text)} placeholder={"Mật khẩu"} secureTextEntry={true} />
            {msgPassword !== "" && <Text style={{ color: "red", fontSize: 12, textAlign: "left" }}>{msgPassword}</Text>}
          </View>

          <View style={styles.textInput}>
            <InputField
              value={confirmPassword}
              onChangeText={(text) => setInputConfirmPassword(text)}
              placeholder={"Xác nhận mật khẩu"}
              secureTextEntry={true}
            />
            {msgConfirmPassword !== "" && <Text style={{ color: "red", fontSize: 12, textAlign: "left" }}>{msgConfirmPassword}</Text>}
          </View>

          <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text>Bạn là: </Text>
            <CheckBox title={"Chủ trọ"} />
            <CheckBox title={"Khách thuê"} />
          </View>
        </View>

        <TouchableOpacity style={styles.btnLogin}>
          <View>
            <Text style={{ color: COLOR.lightBlue, fontSize: 17, fontWeight: "600" }}>Đăng ký</Text>
          </View>
        </TouchableOpacity>

        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
          <Text>Bạn đã có tài khoản? </Text>
          <Text
            style={{ color: COLOR.lightBlue }}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            {" "}
            Đăng nhập ngay.
          </Text>
        </View>
      </View>

      <HideWithKeyboard>
        <View>
          <Text style={styles.or}>---- OR ----</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
            width: 300,
            margin: "auto",
          }}
        >
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: "#ddd",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <GoogleSVG height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: "#ddd",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <Facebook height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: "#ddd",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <TwitterSVG height={24} width={24} />
          </TouchableOpacity>
        </View>
      </HideWithKeyboard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginTxt: {
    textAlign: "center",
    fontSize: 30,
    color: COLOR.lightBlue,
    fontWeight: "600",
    // marginTop: 100,
  },

  textInput: {
    width: 330,
    marginTop: 40,
    marginBottom: 10,
    zIndex: 100,
  },

  form: {
    padding: 30,
    alignItems: "center",
  },

  btnLogin: {
    width: 300,
    padding: 15,
    marginTop: 50,
    alignItems: "center",
    borderRadius: 20,
    borderColor: COLOR.lightBlue,
    borderWidth: 2,
  },

  or: {
    textAlign: "center",
    marginVertical: 30,
  },
});

export default RegisterScreen;
