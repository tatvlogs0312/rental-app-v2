import React, { useEffect, useState } from "react";
import { FlatList, Linking, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "./../../../hook/LoadingProvider";
import { get } from "./../../../api/ApiManager";
import HeaderBarNoPlus from "./../../../components/header/HeaderBarNoPlus";
import LoadingModal from "react-native-loading-modal";
import { COLOR } from "../../../constants/COLORS";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native";

const TenantRentedScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    if (auth.token !== "") {
      getTenant();
    }
  }, [auth.token]);

  const getTenant = async () => {
    try {
      load.isLoading();
      const res = await get("/rental-service/room/get-tenant-rented", {}, auth.token);
      setTenants(res);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingModal modalVisible={load.loading} />
      <HeaderBarNoPlus title={"Danh sách khách thuê"} back={() => navigation.goBack()} />
      <View style={{ flex: 1 }}>
        <FlatList
          scrollEnabled
          showsVerticalScrollIndicator={false}
          data={tenants}
          refreshControl={<RefreshControl refreshing={load.loading} onRefresh={getTenant} />}
          renderItem={({ item }) => (
            <View style={{ margin: 10, padding: 15, backgroundColor: COLOR.white, elevation: 5, borderRadius: 10, position: "relative" }}>
              <View style={{ paddingBottom: 5, borderBottomWidth: 0.5 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: COLOR.primary }}>{`${item.houseName} - ${item.roomName}`}</Text>
                <View style={{ marginTop: 5 }}>
                  <Text style={{ color: COLOR.grey }}>
                    <FontAwesome6Icon name="location-dot" />
                    {` ${item.housePositionDetail}`}
                  </Text>
                  <Text style={{ color: COLOR.grey }}>{`${item.houseWard} - ${item.houseDistrict} - ${item.houseProvince}`}</Text>
                </View>
              </View>
              <View style={{ paddingTop: 5, flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <Text style={{ fontWeight: "600" }}>Khách thuê:</Text>
                  <Text style={{ color: COLOR.primary, fontSize: 16, fontWeight: "500" }}>{item.tenantFullName}</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={{ fontWeight: "600" }}>Liên hệ:</Text>
                  <Text style={{ color: COLOR.primary, fontSize: 16, fontWeight: "500" }}>{item.tenantPhoneNumber}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: COLOR.green,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 100,
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
                onPress={() => {
                  Linking.openURL(`tel:$${item.tenantPhoneNumber}`);
                }}
              >
                <FontAwesome6Icon name="phone" color={COLOR.white} size={20} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default TenantRentedScreen;
