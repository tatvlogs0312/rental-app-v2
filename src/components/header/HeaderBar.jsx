import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

const HeaderBar = ({ back, title }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable onPress={back} style={{ marginHorizontal: 5 }}>
          <FontAwesome6 name="arrow-left" size={20} color="#7e8c99" />
        </Pressable>
        <Text style={{ marginLeft: 10, fontSize: 18 }}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f1f1f5",
    padding: 10,
    // borderRadius: 15,
    // margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default HeaderBar;
