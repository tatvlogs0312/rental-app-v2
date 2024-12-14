import React from "react";
import { StyleSheet, Text, View } from "react-native";

const MsgInputError = ({ msg }) => {
  return <Text style={{ color: "red", fontSize: 12, textAlign: "left" }}>{msg}</Text>;
};

const styles = StyleSheet.create({});

export default MsgInputError;
