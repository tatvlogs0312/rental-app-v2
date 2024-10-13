import React from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../hook/AuthProvider";

const UserScreen = () => {
  const auth = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View>
        <View>
          <Button title="Đăng xuất" onPress={() => auth.logout()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default UserScreen;
