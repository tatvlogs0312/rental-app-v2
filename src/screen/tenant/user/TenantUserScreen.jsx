import React, { useEffect, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native";
import { DOMAIN, IMAGE_DOMAIN } from "../../../constants/URL";
import { get, post } from "../../../api/ApiManager";
import { COLOR } from "../../../constants/COLORS";
import { useAuth } from "../../../hook/AuthProvider";
import { useFcm } from "../../../hook/FcmProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";

const TenantUserScreen = ({ navigation }) => {
  const auth = useAuth();
  const fcm = useFcm();
  const load = useLoading();

  const [user, setUser] = useState(auth.info);

  useEffect(() => {
    if (auth.token !== "") {
      // getUser();
    }
  }, [auth.token]);

  const logout = async () => {
    try {
      console.log("logout");
      load.isLoading();
      await post("/rental-service/fcm/unsubscribe/" + fcm.deviceId, {}, auth.token);
      auth.logout();
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  return (
    <>
      <LoadingModal modalVisible={load.loading} />
      {user !== null && (
        <ScrollView style={{ flex: 1, backgroundColor: COLOR.white }} showsVerticalScrollIndicator={false}>
          <View>
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: `${IMAGE_DOMAIN}/${auth.info.avatar}` }} // Avatar Image
                style={styles.avatar}
              />
              <Text style={styles.name}>{auth.info.firstName + " " + auth.info.lastName}</Text>
              <Text style={styles.email}>{auth.info.email}</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ marginHorizontal: 20, backgroundColor: COLOR.white, elevation: 5, borderRadius: 10 }}>
              <TouchableOpacity
                style={styles.menu}
                onPress={() => {
                  navigation.navigate("RoomRented");
                }}
              >
                <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome6 name="house" size={16} color={COLOR.primary} />
                </View>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Phòng</Text>
                    <Text style={{ fontSize: 14, color: COLOR.grey }}>Danh sách phòng bạn đang thuê</Text>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", padding: 5 }}>
                    <FontAwesome6 name="angle-right" size={15} color={COLOR.primary} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menu}
                onPress={() => {
                  navigation.navigate("TenantContractList");
                }}
              >
                <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome6 name="file-contract" size={16} color={COLOR.primary} />
                </View>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Hợp đồng</Text>
                    <Text style={{ fontSize: 14, color: COLOR.grey }}>Danh sách các hợp đồng đợi ký, đã ký của bạn</Text>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", padding: 5 }}>
                    <FontAwesome6 name="angle-right" size={15} color={COLOR.primary} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menu}
                onPress={() => {
                  navigation.navigate("TenantBillList");
                }}
              >
                <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome6 name="money-bill-wave" size={16} color={COLOR.primary} />
                </View>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Hóa đơn</Text>
                    <Text style={{ fontSize: 14, color: COLOR.grey }}>Danh sách hóa đơn hàng tháng của bạn</Text>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", padding: 5 }}>
                    <FontAwesome6 name="angle-right" size={15} color={COLOR.primary} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ padding: 12, marginVertical: 3, borderRadius: 10, flexDirection: "row", justifyContent: "flex-start", alignContent: "center" }}
                onPress={() => navigation.navigate("TenantWarningList")}
              >
                <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome6 name="triangle-exclamation" size={16} color={COLOR.primary} />
                </View>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Báo cáo sự cố</Text>
                    <Text style={{ fontSize: 14, color: COLOR.grey }}>Thông báo sự cố đến chủ trọ</Text>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", padding: 5 }}>
                    <FontAwesome6 name="angle-right" size={15} color={COLOR.primary} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ margin: 20, backgroundColor: COLOR.white, elevation: 5, borderRadius: 10 }}>
              <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate("UserInfomation")}>
                <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome6 name="user" size={16} color={COLOR.primary} />
                </View>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Thông tin cá nhân</Text>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", padding: 5 }}>
                    <FontAwesome6 name="angle-right" size={15} color={COLOR.primary} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate("ChangePassword")}>
                <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome6 name="retweet" size={16} color={COLOR.primary} />
                </View>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Đổi mật khẩu</Text>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", padding: 5 }}>
                    <FontAwesome6 name="angle-right" size={15} color={COLOR.primary} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menu}>
                <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome6 name="book" size={16} color={COLOR.primary} />
                </View>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Điều khoản và chính sách</Text>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", padding: 5 }}>
                    <FontAwesome6 name="angle-right" size={15} color={COLOR.primary} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 12,
                  marginVertical: 3,
                  borderRadius: 10,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignContent: "center",
                }}
                onPress={logout}
              >
                <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                  <FontAwesome6 name="right-from-bracket" size={16} color={COLOR.primary} />
                </View>
                <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Đăng xuất</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  info: {
    marginTop: 10,
  },

  infoInput: {
    borderBottomWidth: 0.5,
  },

  btn: {
    marginTop: 20,
    width: "100%",
    textAlign: "center",
    margin: "auto",
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLOR.lightOrange,
    color: COLOR.primary,
    fontWeight: "bold",
    fontSize: 17,
  },

  menu: {
    padding: 12,
    marginVertical: 3,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLOR.grey,
  },

  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#888",
  },
  editButton: {
    marginTop: 20,
    backgroundColor: COLOR.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default TenantUserScreen;
