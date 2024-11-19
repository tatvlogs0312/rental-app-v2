import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { createStackNavigator } from "@react-navigation/stack";
import LessorBookScreen from "../screen/lessor/book/LessorBookScreen";
import NotificationScreen from "../screen/common/NotificationScreen";
import LessorDashboradScreen from "../screen/lessor/dashboard/LessorDashboradScreen";
import LessorPostListScreen from "../screen/lessor/post/LessorPostListScreen";
import LessorAddPostScreen from "../screen/lessor/post/LessorAddPostScreen";
import HouseListScreen from "../screen/lessor/house/HouseListScreen";
import AddHouseScreen from "../screen/lessor/house/AddHouseScreen";
import RoomListScreen from "../screen/lessor/room/RoomListScreen";
import LessorPostDetailScreen from "../screen/lessor/post/LessorPostDetailScreen";
import { StyleSheet, TouchableOpacity } from "react-native";
import LessorUserScreen from "../screen/lessor/user/LessorUserScreen";
import { COLOR } from "../constants/COLORS";

const Tab = createBottomTabNavigator();

const HomeStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="LessorDashboard" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LessorDashboard" component={LessorDashboradScreen} />
      <Stack.Screen name="LessorBook" component={LessorBookScreen} />
      <Stack.Screen name="LessorPostList" component={LessorPostListScreen} />
      <Stack.Screen name="LessorAddPost" component={LessorAddPostScreen} />
      <Stack.Screen name="HouseList" component={HouseListScreen} />
      <Stack.Screen name="AddHouse" component={AddHouseScreen} />
      <Stack.Screen name="RoomList" component={RoomListScreen} />
      <Stack.Screen name="LessorPostDetail" component={LessorPostDetailScreen} />
    </Stack.Navigator>
  );
};

const NotificationStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Notification">
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Notification" component={NotificationScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const UserStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="LessorUser" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LessorUser" component={LessorUserScreen} />
    </Stack.Navigator>
  );
};

const LessorNavigator = () => {
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

          // Trả về biểu tượng FontAwesome
          return <FontAwesome6 name={iconName} size={18} color={focused ? COLOR.primary : COLOR.grey} solid />;
        },
        tabBarActiveTintColor: COLOR.primary,
        tabBarInactiveTintColor: COLOR.grey,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: "Trang chủ" }} />
      <Tab.Screen name="Notification" component={NotificationStack} options={{ title: "Thông báo" }} />
      <Tab.Screen name="User" component={UserStack} options={{ title: "Tôi" }} />
    </Tab.Navigator>
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
