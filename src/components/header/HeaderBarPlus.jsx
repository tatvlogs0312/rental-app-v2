import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../constants/COLORS";

const HeaderBarPlus = ({ title, back, plus }) => {
  return (
    <View style={{ padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <View style={{ flexDirection: "row" }}>
        <Pressable style={styles.icon} onPress={back}>
          <FontAwesome6 name="angle-left" size={25} color={COLOR.white} />
        </Pressable>
        <Text style={{ fontSize: 25, marginLeft: 5 }}>{title}</Text>
      </View>
      <Pressable
        style={styles.icon}
        onPress={plus}
      >
        <FontAwesome6 name="plus" size={25} color={COLOR.white} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 5,
    backgroundColor: COLOR.black,
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HeaderBarPlus;
