import React from "react";
import { TouchableOpacity } from "react-native";
import { Image, StyleSheet, Text, View } from "react-native";
import { COLOR } from "../../constants/COLORS";

const SignSuccessScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <View style={{ flex: 1, padding: 20, flexDirection: "column", justifyContent: "space-between" }}>
        <View style={{ alignItems: "center", marginTop: 100 }}>
          <Image source={require("../../../assets/success.png")} style={{ width: 200, height: 200, objectFit: "cover" }} />
          <Text style={{ marginTop: 20, fontSize: 20, color: COLOR.primary, fontWeight: "bold" }}>Ký hợp đồng thành công</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("TenantUser")}>
            <Text
              style={{
                textAlign: "center",
                marginBottom: 20,
                padding: 10,
                backgroundColor: COLOR.primary,
                color: COLOR.white,
                fontWeight: "bold",
                borderRadius: 10,
              }}
            >
              Quay về trang chủ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default SignSuccessScreen;
