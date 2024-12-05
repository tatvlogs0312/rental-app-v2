import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { useLoading } from "../../../hook/LoadingProvider";
import { COLOR } from "../../../constants/COLORS";
import LoadingModal from "react-native-loading-modal";
import { TouchableOpacity } from "react-native";
import { post } from "../../../api/ApiManager";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const ForgotPasswordChangeScreen = ({ navigation, route }) => {
  const username = route.params.username;

  const load = useLoading();

  const [newPassword, setNewPassword] = useState(null);
  const [confirmNewPassword, setConfirmNewPassword] = useState(null);

  const [newPasswordMsg, setNewPasswordMsg] = useState(null);
  const [confirmNewPasswordMsg, setConfirmNewPasswordMsg] = useState(null);

  const setInputNewPassword = (text) => {
    setNewPassword(text);
    setNewPasswordMsg(null);
  };

  const setInputConfirmNewPassword = (text) => {
    setConfirmNewPassword(text);
    setConfirmNewPasswordMsg(null);
  };

  const changePassword = async () => {
    try {
      if (validate() === true) {
        load.isLoading();
        await post(
          "/rental-service/auth/forgot-password",
          {
            username: username,
            newPassword: newPassword,
          },
          null,
        );

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          textBody: "Đổi mật khẩu thành công, vui lòng đăng nhập lại",
          title: "Thông báo",
        });

        navigation.navigate("Login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const validate = () => {
    let isValid = true;

    if (newPassword === "" || newPassword === null) {
      setNewPasswordMsg("Vui lòng nhập mật khẩu mới");
      isValid = false;
    }

    if (confirmNewPassword === "" || confirmNewPassword === null) {
      setConfirmNewPasswordMsg("Vui lòng nhập lại mật khẩu mới");
      isValid = false;
    }

    if (confirmNewPassword !== "" && confirmNewPassword !== null && confirmNewPassword !== newPassword) {
      setConfirmNewPasswordMsg("Mật khẩu mới không trùng khớp");
      isValid = false;
    }

    return isValid;
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingModal modalVisible={load.loading} />
      <HeaderBarNoPlus title="Quay lại" back={() => navigation.navigate("ForgotPasswordRequest")} />
      <View style={{ flex: 1, backgroundColor: COLOR.white, padding: 10, margin: 5, borderRadius: 5, justifyContent: "space-between" }}>
        <View style={{ marginTop: 25 }}>
          <View style={{ marginBottom: 10 }}>
            <Text>
              <Text style={{ color: COLOR.red }}>* </Text>
              <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Mật khẩu mới</Text>
            </Text>
            <TextInput style={styles.input} placeholder="Nhập mật khẩu mới" value={newPassword} secureTextEntry onChangeText={(t) => setInputNewPassword(t)} />
            {newPasswordMsg !== "" && <Text style={{ color: "red", fontSize: 12, textAlign: "left" }}>{newPasswordMsg}</Text>}
          </View>
          <View>
            <Text>
              <Text style={{ color: COLOR.red }}>* </Text>
              <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Nhập lại mật khẩu mới</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu mới"
              value={confirmNewPassword}
              secureTextEntry
              onChangeText={(t) => setInputConfirmNewPassword(t)}
            />
            {confirmNewPasswordMsg !== "" && <Text style={{ color: "red", fontSize: 12, textAlign: "left" }}>{confirmNewPasswordMsg}</Text>}
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity onPress={changePassword}>
            <Text style={styles.btn}>Đổi mật khẩu</Text>
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

export default ForgotPasswordChangeScreen;
