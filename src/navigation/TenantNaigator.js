import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import TenantBookScreen from "../screen/tenant/book/TenantBookScreen";
import TenantDarshboardScreen from "../screen/tenant/dashboard/TenantDashboardScreen";
import TenantPostListScreen from "../screen/tenant/post/TenantPostListScreen";
import TenantPostDetailScreen from "../screen/tenant/post/TenantPostDetailScreen";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import TenantUserScreen from "../screen/tenant/user/TenantUserScreen";
import { COLOR } from "../constants/COLORS";
import TenantContractListScreen from "../screen/tenant/contract/TenantContractListScreen";
import TenantContractDetailScreen from "../screen/tenant/contract/TenantContractDetailScreen";
import TenantContractSignScreen from "../screen/tenant/contract/TenantContractSignScreen";
import SignSuccessScreen from "../screen/common/SignSuccessScreen";
import NotificationScreen from "../screen/common/NotificationScreen";
import TenantBillListScreen from "../screen/tenant/bill/TenantBillListScreen";
import TenantBillDetailScreen from "../screen/tenant/bill/TenantBillDetailScreen";

const Tab = createBottomTabNavigator();

const NotificationStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Notification" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notification" component={NotificationScreen} />

      <Stack.Screen name="TenantPostList" component={TenantPostListScreen} />
      <Stack.Screen name="TenantPostDetail" component={TenantPostDetailScreen} />
      <Stack.Screen name="SignSuccess" component={SignSuccessScreen} />
      <Stack.Screen name="TenantContractList" component={TenantContractListScreen} />
      <Stack.Screen name="TenantContractDetail" component={TenantContractDetailScreen} />
      <Stack.Screen name="TenantContractSign" component={TenantContractSignScreen} />

      <Stack.Screen name="TenantBillList" component={TenantBillListScreen} />
      <Stack.Screen name="TenantBillDetail" component={TenantBillDetailScreen} />
    </Stack.Navigator>
  );
};

const PostStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="TenantDashboard" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TenantDashboard" component={TenantDarshboardScreen} />

      <Stack.Screen name="TenantPostList" component={TenantPostListScreen} />
      <Stack.Screen name="TenantPostDetail" component={TenantPostDetailScreen} />
      <Stack.Screen name="SignSuccess" component={SignSuccessScreen} />
      <Stack.Screen name="TenantContractList" component={TenantContractListScreen} />
      <Stack.Screen name="TenantContractDetail" component={TenantContractDetailScreen} />
      <Stack.Screen name="TenantContractSign" component={TenantContractSignScreen} />

      <Stack.Screen name="TenantBillList" component={TenantBillListScreen} />
      <Stack.Screen name="TenantBillDetail" component={TenantBillDetailScreen} />
    </Stack.Navigator>
  );
};

const UserStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="TenantUser" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TenantUser" component={TenantUserScreen} />

      <Stack.Screen name="TenantPostList" component={TenantPostListScreen} />
      <Stack.Screen name="TenantPostDetail" component={TenantPostDetailScreen} />
      <Stack.Screen name="SignSuccess" component={SignSuccessScreen} />
      <Stack.Screen name="TenantContractList" component={TenantContractListScreen} />
      <Stack.Screen name="TenantContractDetail" component={TenantContractDetailScreen} />
      <Stack.Screen name="TenantContractSign" component={TenantContractSignScreen} />

      <Stack.Screen name="TenantBillList" component={TenantBillListScreen} />
      <Stack.Screen name="TenantBillDetail" component={TenantBillDetailScreen} />
    </Stack.Navigator>
  );
};

const TenantNaigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Post"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Post") {
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
      <Tab.Screen name="Post" component={PostStack} options={{ title: "Bài đăng" }} />
      <Tab.Screen name="Notification" component={NotificationStack} options={{ title: "Thông báo" }} />
      <Tab.Screen name="User" component={UserStack} options={{ title: "Cài đặt" }} />
    </Tab.Navigator>
  );
};

export default TenantNaigator;
