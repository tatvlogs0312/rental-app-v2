import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "./../screen/common/UserScreen";
import RoomNavigator from "./room/RoomNavigation";

const Tab = createBottomTabNavigator();

const LessorNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="RoomNavigator" screenOptions={{headerShown: false}}>
      <Tab.Screen name="RoomNavigator" component={RoomNavigator} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
};

export default LessorNavigator;
