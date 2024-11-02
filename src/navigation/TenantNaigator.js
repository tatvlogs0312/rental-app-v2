import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "../screen/common/UserScreen";
import { createStackNavigator } from "@react-navigation/stack";
import PostScreen from "../screen/tenant/PostScreen";
import PostDetailScreen from "../screen/tenant/PostDetailScreen";
import TenantBookScreen from "../screen/tenant/book/TenantBookScreen";

const Tab = createBottomTabNavigator();

const PostStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Post">
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Post" component={PostScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ headerShown: true }}>
        <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: "Chi tiết" }} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const BookStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="TenantBook">
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TenantBook" component={TenantBookScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const TenantNaigator = () => {
  return (
    <Tab.Navigator initialRouteName="Post" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Post" component={PostStack} options={{ title: "Bài đăng" }} />
      <Tab.Screen name="TenantBook" component={BookStack} options={{ title: "Lịch xem phòng" }} />
      <Tab.Screen name="User" component={UserScreen} options={{ title: "Cài đặt" }} />
    </Tab.Navigator>
  );
};

export default TenantNaigator;
  