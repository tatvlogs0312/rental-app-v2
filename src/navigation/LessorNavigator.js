import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { createStackNavigator } from "@react-navigation/stack";
import LessorBookScreen from "../screen/lessor/book/LessorBookScreen";
import LessorDashboradScreen from "../screen/lessor/dashboard/LessorDashboradScreen";
import LessorPostListScreen from "../screen/lessor/post/LessorPostListScreen";
import LessorAddPostScreen from "../screen/lessor/post/LessorAddPostScreen";
import HouseListScreen from "../screen/lessor/house/HouseListScreen";
import AddHouseScreen from "../screen/lessor/house/AddHouseScreen";
import RoomListScreen from "../screen/lessor/room/RoomListScreen";
import LessorPostDetailScreen from "../screen/lessor/post/LessorPostDetailScreen";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LessorUserScreen from "../screen/lessor/user/LessorUserScreen";
import { COLOR } from "../constants/COLORS";
import LessorContractListScreen from "../screen/lessor/contract/LessorContractListScreen";
import LessorContractDetailScreen from "../screen/lessor/contract/LessorContractDetailScreen";
import LessorContractCreateScreen from "../screen/lessor/contract/LessorContractCreateScreen";
import SignSuccessScreen from "../screen/common/SignSuccessScreen";

import LessorBillDetailScreen from "../screen/lessor/bill/LessorBillDetailScreen";
import LessorBillListScreen from "../screen/lessor/bill/LessorBillListScreen";
import LessorBillCreateScreen from "../screen/lessor/bill/LessorBillCreateScreen";
import LessorNotificationScreen from "../screen/lessor/notification/LessorNotificationScreen";
import ChangePasswordScreen from "../screen/common/ChangePasswordScreen";
import TenantRentedScreen from "../screen/lessor/tenant/TenantRentedScreen";
import { useState } from "react";
import { useFcm } from "../hook/FcmProvider";
import LessorWarningListScreen from "./../screen/lessor/warning/LessorWarningListScreen";
import LessorWarningDetailScreen from "./../screen/lessor/warning/LessorWarningDetailScreen";
import UserInfomationScreen from "../screen/common/UserInfomationScreen";
import StatisticalScreen from "../screen/lessor/statistical/StatisticalScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTab = () => {
  const { unRead } = useFcm();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "house"; // Icon cho trang Home
          } else if (route.name === "Notification") {
            iconName = "bell"; // Icon cho thông báo
          } else if (route.name === "User") {
            iconName = "user"; // Icon cho cài đặt
          }

          return (
            <View style={{ position: "relative" }}>
              <FontAwesome6 name={iconName} size={18} color={focused ? COLOR.primary : COLOR.grey} solid />
              {route.name === "Notification" && (
                <Text
                  style={{
                    position: "absolute",
                    top: -5,
                    left: 10,
                    backgroundColor: "red",
                    borderRadius: 10,
                    color: "white",
                    fontSize: 10,
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                  }}
                >
                  {unRead}
                </Text>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: COLOR.primary,
        tabBarInactiveTintColor: COLOR.grey,
      })}
    >
      <Tab.Screen name="Home" component={LessorDashboradScreen} options={{ title: "Trang chủ" }} />
      <Tab.Screen name="Notification" component={LessorNotificationScreen} options={{ title: "Thông báo" }} />
      <Tab.Screen name="User" component={LessorUserScreen} options={{ title: "Tôi" }} />
    </Tab.Navigator>
  );
};

const LessorNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MainTab" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTab" component={MainTab} />
      <Stack.Screen name="LessorBook" component={LessorBookScreen} />
      <Stack.Screen name="LessorPostList" component={LessorPostListScreen} />
      <Stack.Screen name="LessorAddPost" component={LessorAddPostScreen} />
      <Stack.Screen name="HouseList" component={HouseListScreen} />
      <Stack.Screen name="AddHouse" component={AddHouseScreen} />
      <Stack.Screen name="RoomList" component={RoomListScreen} />
      <Stack.Screen name="LessorPostDetail" component={LessorPostDetailScreen} />
      <Stack.Screen name="LessorContractList" component={LessorContractListScreen} />
      <Stack.Screen name="LessorContractDetail" component={LessorContractDetailScreen} />
      <Stack.Screen name="LessorContractCreate" component={LessorContractCreateScreen} />
      <Stack.Screen name="SignSuccess" component={SignSuccessScreen} />
      <Stack.Screen name="LessorBillCreate" component={LessorBillCreateScreen} />
      <Stack.Screen name="LessorBillDetail" component={LessorBillDetailScreen} />
      <Stack.Screen name="LessorBillList" component={LessorBillListScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="TenantRented" component={TenantRentedScreen} />
      <Stack.Screen name="LessorWarningList" component={LessorWarningListScreen} />
      <Stack.Screen name="LessorWarningDetail" component={LessorWarningDetailScreen} />
      <Stack.Screen name="UserInfomation" component={UserInfomationScreen} />
      <Stack.Screen name="Statistical" component={StatisticalScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  customButtonContainer: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  customButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#6a5acd",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default LessorNavigator;
