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
import { apiCall } from "../api/ApiManager";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useLoading } from "../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";
import { validPassword } from "../utils/Utils";

const RegisterScreen = ({ navigation }) => {
  const load = useLoading();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("TENANT");

  const [lessorCheck, setLessorCheck] = useState(false);
  const [tenantCheck, setTenantCheck] = useState(true);

  const [msgUsername, setMsgUsername] = useState("");
  const [msgPassword, setMsgPassword] = useState("");
  const [msgConfirmPassword, setMsgConfirmPassword] = useState("");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {});
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {});

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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

  const checkRole = (role) => {
    setRole(role);
    if (role === "LESSOR") {
      setLessorCheck(true);
      setTenantCheck(false);
    } else if (role === "TENANT") {
      setLessorCheck(false);
      setTenantCheck(true);
    }
  };

  const registerApp = async () => {
    if (validateInput() === true) {
      load.isLoading();
      try {
        var data = await apiCall("/rental-service/auth/register", "POST", { username: username, password: password, role: role }, {}, null);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          textBody: "Đăng ký tài khoản thành công",
          title: "Thông báo",
        });
        navigation.navigate("Login");
      } catch (error) {
        console.log(error);
      } finally {
        load.nonLoading();
      }
    }
  };

  const validateInput = () => {
    let isValid = true;
    if (username === "" || username === null) {
      isValid = false;
      setMsgUsername("Vui lòng nhập tài khoản");
    }

    if (password === "" || password === null) {
      isValid = false;
      setMsgPassword("Vui lòng nhập mật khẩu");
    }

    if (!validPassword(password)) {
      isValid = false;
      setMsgPassword("Mật khẩu không đúng định dạng");
    }

    if (confirmPassword === "" || confirmPassword === null) {
      isValid = false;
      setMsgConfirmPassword("Vui lòng nhập lại mật khẩu");
    }

    if (password !== confirmPassword) {
      isValid = false;
      setMsgConfirmPassword("Mật khẩu không trùng khớp");
    }

    return isValid;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <LoadingModal modalVisible={load.loading} />
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

          <View>
            <Text style={{ fontSize: 12 }}>
              <Text style={{ color: "red" }}>* </Text>
              <Text>Mật khẩu tối thiểu 8 ký tự</Text>
            </Text>
            <Text style={{ fontSize: 12 }}>
              <Text style={{ color: "red" }}>* </Text>
              <Text>Chứa 1 ký tự in hoa, 1 số, 1 ký tự đặc biệt</Text>
            </Text>
          </View>

          <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text>Bạn là: </Text>
            <CheckBox title={"Khách thuê"} checked={tenantCheck} onPress={() => checkRole("TENANT")} />
            <CheckBox title={"Chủ trọ"} checked={lessorCheck} onPress={() => checkRole("LESSOR")} />
          </View>
        </View>

        <TouchableOpacity style={styles.btnLogin} onPress={registerApp}>
          <View>
            <Text style={{ color: COLOR.white, fontSize: 17, fontWeight: "600" }}>Đăng ký</Text>
          </View>
        </TouchableOpacity>

        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
          <Text>Bạn đã có tài khoản? </Text>
          <Text
            style={{ color: COLOR.primary }}
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
    color: COLOR.primary,
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
    borderColor: COLOR.primary,
    backgroundColor: COLOR.primary,
    borderWidth: 2,
  },

  or: {
    textAlign: "center",
    marginVertical: 30,
  },
});

export default RegisterScreen;
