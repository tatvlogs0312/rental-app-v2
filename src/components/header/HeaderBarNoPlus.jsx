import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../constants/COLORS";

const HeaderBarNoPlus = ({ title, back }) => {
  return (
    <View style={styles.background}>
      <Pressable style={styles.icon} onPress={back}>
        <FontAwesome6 name="angle-left" size={20} color={COLOR.primary}/>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
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
    marginLeft: 10,
    fontWeight: "bold",
    color: COLOR.primary,
  },

  background: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.white,
  },
});

export default HeaderBarNoPlus;
