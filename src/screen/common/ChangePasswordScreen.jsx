import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import HeaderBarNoPlus from "../../components/header/HeaderBarNoPlus";
import { COLOR } from "../../constants/COLORS";
import { TouchableOpacity } from "react-native";
import LoadingModal from "react-native-loading-modal";
import { useAuth } from "./../../hook/AuthProvider";
import { useLoading } from "../../hook/LoadingProvider";
import { post } from "../../api/ApiManager";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const ChangePasswordScreen = ({ navigation }) => {
  const auth = useAuth();
  const load = useLoading();

  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmNewPassword, setConfirmNewPassword] = useState(null);

  const [oldPasswordMsg, setOldPasswordMsg] = useState("");
  const [newPasswordMsg, setNewPasswordMsg] = useState("");
  const [confirmNewPasswordMsg, setConfirmNewPasswordMsg] = useState("");

  const setInputOldPassword = (text) => {
    setOldPassword(text);
    setOldPasswordMsg("");
  };

  const setInputNewPassword = (text) => {
    setNewPassword(text);
    setNewPasswordMsg("");
  };

  const setInputConfirmNewPassword = (text) => {
    setConfirmNewPassword(text);
    setConfirmNewPasswordMsg("");
  };

  const changePassword = async () => {
    try {
      if (validate() === true) {
        load.isLoading();
        await post(
          "/rental-service/auth/update-password",
          {
            oldPassword: oldPassword,
            newPassword: newPassword,
          },
          auth.token,
        );
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          textBody: "Đổi mật khẩu thành công, vui lòng đăng nhập lại",
          title: "Thông báo",
        });
        auth.logout();
      }
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const validate = () => {
    let isValid = true;
    if (oldPassword === "" || oldPassword === null) {
      setOldPasswordMsg("Vui lòng nhập mật khẩu cũ");
      isValid = false;
    }

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
      <HeaderBarNoPlus title={"Đổi mật khẩu"} back={() => navigation.goBack()} />
      <View style={{ flex: 1, backgroundColor: COLOR.white, padding: 10, margin: 10, borderRadius: 5, justifyContent: "space-between" }}>
        <View>
          <View style={{ marginBottom: 20 }}>
            <Text>
              <Text style={{ color: COLOR.red }}>* </Text>
              <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>Mật khẩu cũ</Text>
            </Text>
            <TextInput style={styles.input} placeholder="Nhập mật khẩu cũ" value={oldPassword} secureTextEntry onChangeText={(t) => setInputOldPassword(t)} />
            {oldPasswordMsg !== "" && <Text style={{ color: "red", fontSize: 12, textAlign: "left" }}>{oldPasswordMsg}</Text>}
          </View>
          <View style={{ marginBottom: 20 }}>
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

export default ChangePasswordScreen;
