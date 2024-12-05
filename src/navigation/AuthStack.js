import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screen/LoginScreen";
import RegisterScreen from "../screen/RegisterScreen";
import CompleteInfoScreen from "../screen/CompleteInfoScreen";
import ForgotPasswordRequestScreen from "../screen/common/forgot/ForgotPasswordRequestScreen";
import ForgotPasswordOtpScreen from "../screen/common/forgot/ForgotPasswordOtpScreen";
import ForgotPasswordChangeScreen from "../screen/common/forgot/ForgotPasswordChangeScreen";

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="CompleteInfo" component={CompleteInfoScreen} />
      <Stack.Screen name="ForgotPasswordRequest" component={ForgotPasswordRequestScreen} />
      <Stack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtpScreen} />
      <Stack.Screen name="ForgotPasswordChange" component={ForgotPasswordChangeScreen} />
    </Stack.Navigator>
  );
};
