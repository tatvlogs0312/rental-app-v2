import React, { useEffect, useState } from "react";
import { Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import InputField from "../components/InputField";
import { COLOR } from "../constants/COLORS";
import GoogleSVG from "../../assets/svg/google.svg";
import Facebook from "../../assets/svg/facebook.svg";
import TwitterSVG from "../../assets/svg/twitter.svg";
import { useAuth } from "../hook/AuthProvider";
import { apiCall } from "../api/ApiManager";
import { useLoading } from "../hook/LoadingProvider";

const LoginScreen = ({ navigation }) => {
  const auth = useAuth();
  const load = useLoading();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [msgUsername, setMsgUsername] = useState("");
  const [msgPassword, setMsgPassword] = useState("");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {});
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {});

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const loginApp = async () => {
    if (username === "") {
      setMsgUsername("Vui lòng nhập tài khoản");
    }

    if (password === "") {
      setMsgPassword("Vui lòng nhập mật khẩu");
    }

    if (username !== "" && password !== "") {
      try {
        var data = await apiCall("/auth/login", "POST", { username: username, password: password }, {}, auth.token);
        if (data.status === "ACTIVE") {
          auth.login(data);
        } else {
          navigation.navigate("CompleteInfo", {
            user: data,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const setInputUsername = (text) => {
    setUsername(text);
    setMsgUsername("");
  };

  const setInputPassword = (text) => {
    setPassword(text);
    setMsgPassword("");
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
      <Text style={styles.loginTxt}>Đăng nhập</Text>
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

          <Text style={{ textAlign: "right", fontWeight: "500", color: COLOR.lightBlue }}>Quên mật khẩu?</Text>
        </View>

        <Pressable onPress={loginApp} style={styles.btnLogin}>
          <View>
            <Text>Đăng nhập</Text>
          </View>
        </Pressable>
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

        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Text>Bạn chưa có tài khoản? </Text>
          <Text
            style={{ color: COLOR.lightBlue }}
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            {" "}
            Tạo tài khoản mới.
          </Text>
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
    backgroundColor: COLOR.lightBlue,
    padding: 15,
    marginTop: 50,
    alignItems: "center",
    borderRadius: 20,
  },

  or: {
    textAlign: "center",
    marginVertical: 30,
  },
});

export default LoginScreen;
