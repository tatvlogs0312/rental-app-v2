import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import RoomScreen from "../../screen/lessor/RoomScreen";
import RoomAddScreen from "../../screen/lessor/RoomAddScreen";
import RoomDetailScreen from "../../screen/lessor/room_detail/RoomDetailScreen";

const Stack = createStackNavigator();

const RoomNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Room">
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Room" component={RoomScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RoomAdd" component={RoomAddScreen} options={{ title: "Thêm phòng" }} />
        <Stack.Screen name="RoomDetail" component={RoomDetailScreen} options={{ title: "Xem chi tiết" }} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RoomNavigator;
