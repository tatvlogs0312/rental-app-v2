import React from "react";
import { StyleSheet, View } from "react-native";
import HeaderBarNoPlus from "../../components/header/HeaderBarNoPlus";

const ChangePasswordScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <HeaderBarNoPlus title={"Đổi mật khẩu"} back={() => navigation.goBack()} />
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ChangePasswordScreen;
