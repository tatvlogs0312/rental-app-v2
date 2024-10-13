import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import PostScreen from "../../screen/tenant/PostScreen";
import PostDetailScreen from "../../screen/tenant/PostDetailScreen";

const Stack = createStackNavigator();

const PostNavigator = () => {
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

export default PostNavigator;
