import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const InputField = ({ ...props }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
      }}
    >
      <TextInput {...props} style={{ flex: 1, paddingVertical: 0 }} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default InputField;
