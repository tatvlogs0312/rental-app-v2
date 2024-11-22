import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../constants/COLORS";

const HeaderBarSliderPlus = ({ title, back, plus }) => {
  return (
    <View style={styles.background}>
      <View style={{ flexDirection: "row" }}>
        <Pressable style={styles.icon} onPress={back}>
          <FontAwesome6 name="angle-left" size={20} color={COLOR.white} />
          <Text style={styles.title}>{title}</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Pressable style={[styles.icon, { marginRight: 15 }]} onPress={plus}>
          <FontAwesome6 name="sliders" size={25} color={COLOR.white} />
        </Pressable>
        <Pressable style={styles.icon} onPress={plus}>
          <FontAwesome6 name="plus" size={25} color={COLOR.white} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    // padding: 5,
    // width: 35,
    // height: 35,
    // borderRadius: 10,
    // alignItems: "center",
    // justifyContent: "center",
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    marginLeft: 5,
    fontWeight: "bold",
    color: COLOR.white,
  },

  background: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLOR.primary,
  },
});

export default HeaderBarSliderPlus;
