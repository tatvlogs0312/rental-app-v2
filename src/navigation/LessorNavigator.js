import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "./../screen/common/UserScreen";
import { createStackNavigator } from "@react-navigation/stack";
import RoomScreen from "../screen/lessor/RoomScreen";
import RoomAddScreen from "../screen/lessor/RoomAddScreen";
import RoomDetailScreen from "../screen/lessor/room_detail/RoomDetailScreen";
import LessorBookScreen from "../screen/lessor/book/LessorBookScreen";
import NotificationScreen from "../screen/common/NotificationScreen";
import LessorDashboradScreen from "../screen/lessor/dashboard/LessorDashboradScreen";
import LessorPostListScreen from "../screen/lessor/post/LessorPostListScreen";
import LessorAddPostScreen from "../screen/lessor/post/LessorAddPostScreen";
import HouseListScreen from "../screen/lessor/house/HouseListScreen";
import AddHouseScreen from "../screen/lessor/house/AddHouseScreen";
import RoomListScreen from "../screen/lessor/room/RoomListScreen";

const Tab = createBottomTabNavigator();

const HomeStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="HouseList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LessorDashboard" component={LessorDashboradScreen} />
      <Stack.Screen name="Room" component={RoomScreen} />
      <Stack.Screen name="RoomAdd" component={RoomAddScreen} />
      <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
      <Stack.Screen name="LessorBook" component={LessorBookScreen} />
      <Stack.Screen name="LessorPostList" component={LessorPostListScreen} />
      <Stack.Screen name="LessorAddPost" component={LessorAddPostScreen} />
      <Stack.Screen name="HouseList" component={HouseListScreen} />
      <Stack.Screen name="AddHouse" component={AddHouseScreen} />
      <Stack.Screen name="RoomList" component={RoomListScreen} />
    </Stack.Navigator>
  );
};

const BookStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="LessorBook">
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LessorBook" component={LessorBookScreen} />
      </Stack.Group>
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

const LessorNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeStack} options={{ title: "Trang chủ" }} />
      <Tab.Screen name="Notification" component={NotificationStack} options={{ title: "Thông báo" }} />
      <Tab.Screen name="User" component={UserScreen} options={{ title: "Cài đặt" }} />
    </Tab.Navigator>
  );
};

export default LessorNavigator;
