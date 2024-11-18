import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "../screen/common/UserScreen";
import { createStackNavigator } from "@react-navigation/stack";
import TenantBookScreen from "../screen/tenant/book/TenantBookScreen";
import TenantDarshboardScreen from "../screen/tenant/dashboard/TenantDashboardScreen";
import TenantPostListScreen from "../screen/tenant/post/TenantPostListScreen";
import TenantPostDetailScreen from "../screen/tenant/post/TenantPostDetailScreen";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

const Tab = createBottomTabNavigator();

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

const PostStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="TenantDashboard" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TenantDashboard" component={TenantDarshboardScreen} />
      <Stack.Screen name="TenantPostList" component={TenantPostListScreen} />
      <Stack.Screen name="TenantPostDetail" component={TenantPostDetailScreen} />
    </Stack.Navigator>
  );
};

const TenantNaigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Post"
      screenOptions={({ route }) => ({
        // tabBarStyle: {
        //   position: "absolute",
        //   backgroundColor: "#ffffff",
        //   height: 50,
        //   borderTopLeftRadius: 20,
        //   borderTopRightRadius: 20,
        //   // borderRadius: 20,
        //   // width: "90%",
        //   // alignItems: "center",
        //   // justifyContent: "center",
        // },
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
          return <FontAwesome6 name={iconName} size={18} color={focused ? "tomato" : "gray"} solid />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Post" component={PostStack} options={{ title: "Bài đăng" }} />
      <Tab.Screen name="User" component={UserScreen} options={{ title: "Cài đặt" }} />
    </Tab.Navigator>
  );
};

export default TenantNaigator;
