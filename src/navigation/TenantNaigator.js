import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "../screen/common/UserScreen";
import PostNavigator from "./post/PostNavigator";

const Tab = createBottomTabNavigator();

const TenantNaigator = () => {
  return (
    <Tab.Navigator initialRouteName="PostNavigator" screenOptions={{headerShown: false}}>
      <Tab.Screen name="PostNavigator" component={PostNavigator} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
};

export default TenantNaigator;
