import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLOR } from "../constants/COLORS";

const InputTitleImportant = ({ title }) => {
  return (
    <Text>
      <Text style={{ color: COLOR.red }}>*</Text>
      <Text style={styles.inputTitle}>{" " + title}</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  inputTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default InputTitleImportant;
