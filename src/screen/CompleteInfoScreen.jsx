import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { COLOR } from "../constants/COLORS";
import InputField from "../components/InputField";
import { TouchableOpacity } from "react-native";
import { useLoading } from "../hook/LoadingProvider";
import { useAuth } from "../hook/AuthProvider";
import LoadingModal from "react-native-loading-modal";
import { post } from "../api/ApiManager";
import { validateEmail } from "../utils/Utils";

const CompleteInfoScreen = ({ navigation, route }) => {
  const user = route.params.user;

  const load = useLoading();
  const auth = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [msgFirstName, setMsgFirstName] = useState("");
  const [msgLastName, setMsgLastName] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [msgPhoneNumber, setMsgPhoneNumber] = useState("");

  const setInputFirstName = (text) => {
    setFirstName(text);
    setMsgFirstName("");
  };

  const setInputLastName = (text) => {
    setLastName(text);
    setMsgLastName("");
  };

  const setInputEmail = (text) => {
    setEmail(text);
    setMsgEmail("");
  };

  const setInputPhoneNumber = (text) => {
    setPhoneNumber(text);
    setMsgPhoneNumber("");
  };

  const validateInput = () => {
    console.log("Start input");

    let isPass = true;
    if (firstName === "") {
      setMsgFirstName("Họ không được để trống");
      isPass = false;
    }

    if (lastName === "") {
      setMsgLastName("Tên không được để trống");
      isPass = false;
    }

    if (email === "") {
      setMsgEmail("Email không được để trống");
      isPass = false;
    }

    if (phoneNumber === "") {
      setMsgPhoneNumber("Số điện thoại không được để trống");
      isPass = false;
    }

    if (email !== "" && !validateEmail(email)) {
      setMsgEmail("Email không đúng định dạng");
      isPass = false;
    }

    console.log(isPass);

    return isPass;
  };

  const completeInfo = () => {
    if (validateInput()) {
      try {
        const res = post(
          "/rental-service/user-profile/complete-information",
          {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
          },
          user.token,
        );
        if (res) {
          auth.login(user);
        }
      } catch (error) {
        console.log(error);
      }
    }
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
      <Text style={styles.loginTxt}>Hoàn thiện thông tin</Text>
      <View style={styles.form}>
        <View>
          <View style={styles.textInput}>
            <InputField value={firstName} onChangeText={(text) => setInputFirstName(text)} placeholder={"Họ"} />
            {msgFirstName !== "" && <Text style={{ color: "red", fontSize: 12, textAlign: "left" }}>{msgFirstName}</Text>}
          </View>

          <View style={styles.textInput}>
            <InputField value={lastName} onChangeText={(text) => setInputLastName(text)} placeholder={"Tên"} />
            {msgLastName !== "" && <Text style={{ color: "red", fontSize: 12, textAlign: "left" }}>{msgLastName}</Text>}
          </View>

          <View style={styles.textInput}>
            <InputField value={email} onChangeText={(text) => setInputEmail(text)} placeholder={"Email"} keyboardType="email-address" />
            {msgEmail !== "" && <Text style={{ color: "red", fontSize: 12, textAlign: "left" }}>{msgEmail}</Text>}
          </View>

          <View style={styles.textInput}>
            <InputField value={phoneNumber} onChangeText={(text) => setInputPhoneNumber(text)} placeholder={"Số điện thoại"} keyboardType="phone-pad" />
            {msgPhoneNumber !== "" && <Text style={{ color: "red", fontSize: 12, textAlign: "left" }}>{msgPhoneNumber}</Text>}
          </View>
        </View>

        <TouchableOpacity style={styles.btnLogin} onPress={completeInfo}>
          <View>
            <Text style={{ color: COLOR.lightBlue, fontSize: 17, fontWeight: "600" }}>Cập nhật thông tin</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginTxt: {
    textAlign: "center",
    fontSize: 30,
    color: COLOR.lightBlue,
    fontWeight: "600",
    marginTop: 200,
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
});

export default CompleteInfoScreen;
