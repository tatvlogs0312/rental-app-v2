import { useAuth } from "../hook/AuthProvider";
import LessorNavigator from "./LessorNavigator";
import TenantNaigator from "./TenantNaigator";

export const AppStack = () => {
  const auth = useAuth();

  return auth.user.role === "LESSOR" ? <LessorNavigator /> : <TenantNaigator />;
};
