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
import ChangePasswordScreen from "../screen/common/ChangePasswordScreen";
import RoomRentedScreen from "../screen/tenant/room/RoomRentedScreen";
import TenantDashboardScreen from "../screen/tenant/dashboard/TenantDashboardScreen";
import { NavigationContainer } from "@react-navigation/native";
import { useFcm } from "../hook/FcmProvider";
import { View } from "react-native";
import { Text } from "react-native";
import TenantWarningListScreen from './../screen/tenant/warning/TenantWarningListScreen';
import TenantWarningDetailScreen from './../screen/tenant/warning/TenantWarningDetailScreen';
import TenantWaringCreateScreen from './../screen/tenant/warning/TenantWaringCreateScreen';
import UserInfomationScreen from "../screen/common/UserInfomationScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTab = () => {
  const { unRead } = useFcm();
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
      <Tab.Screen name="Post" component={TenantDashboardScreen} options={{ title: "Bài đăng" }} />
      <Tab.Screen name="Notification" component={NotificationScreen} options={{ title: "Thông báo" }} />
      <Tab.Screen name="User" component={TenantUserScreen} options={{ title: "Tôi" }} />
    </Tab.Navigator>
  );
};

const TenantNaigator = () => {
  return (
    <Stack.Navigator initialRouteName="MainTab" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTab" component={MainTab} />
      <Stack.Screen name="TenantPostList" component={TenantPostListScreen} />
      <Stack.Screen name="TenantPostDetail" component={TenantPostDetailScreen} />
      <Stack.Screen name="SignSuccess" component={SignSuccessScreen} />
      <Stack.Screen name="TenantContractList" component={TenantContractListScreen} />
      <Stack.Screen name="TenantContractDetail" component={TenantContractDetailScreen} />
      <Stack.Screen name="TenantContractSign" component={TenantContractSignScreen} />
      <Stack.Screen name="TenantBillList" component={TenantBillListScreen} />
      <Stack.Screen name="TenantBillDetail" component={TenantBillDetailScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="RoomRented" component={RoomRentedScreen} />
      <Stack.Screen name="TenantWarningList" component={TenantWarningListScreen} />
      <Stack.Screen name="TenantWarningDetail" component={TenantWarningDetailScreen} />
      <Stack.Screen name="TenantWaringCreate" component={TenantWaringCreateScreen} />
      <Stack.Screen name="UserInfomation" component={UserInfomationScreen} />
    </Stack.Navigator>
  );
};

export default TenantNaigator;
