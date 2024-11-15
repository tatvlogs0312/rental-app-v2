import React from "react";
import { StyleSheet, Text, View } from "react-native";

const NoData = ({ message }) => {
  return (
    <View>
      <Text style={{ textAlign: "center", fontStyle: "italic" }}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default NoData;
