import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../../constants/COLORS";
import { TouchableOpacity } from "react-native";
import { IMAGE_DOMAIN } from "../../../constants/URL";
import { useLoading } from "./../../../hook/LoadingProvider";
import { get } from "../../../api/ApiManager";

const features = [
  { id: "1", icon: "house", title: "Nhà", color: "#007bff", navigate: "HouseList" },
  { id: "2", icon: "pen-to-square", title: "Bài đăng", color: "#f1c40f", navigate: "LessorPostList" },
  { id: "3", icon: "file-signature", title: "Hợp đồng", color: "#6F1E51", navigate: "LessorContractList" },
  { id: "4", icon: "file-invoice-dollar", title: "Hóa đơn", color: "#00a34c", navigate: "LessorBillList" },
  { id: "5", icon: "triangle-exclamation", title: "Sự cố", color: "#8c7ae6", navigate: "LessorWarningList" },
  { id: "6", icon: "user", title: "Khách thuê", color: "#c23616", navigate: "TenantRented" },
];

const LessorDashboradScreen = ({ navigation }) => {
  const auth = useAuth();
  const load = useLoading();

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    if (auth.token !== "") {
      getDashboard();
    }
  }, [auth.token]);

  const getDashboard = async () => {
    try {
      load.isLoading();
      console.log("get dashboard");
      const res = await get("/rental-service/dashboard/lessor", {}, auth.token);
      setDashboard(res);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={load.loading} onRefresh={getDashboard} />}>
      <View style={{ backgroundColor: COLOR.primary, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, padding: 20, elevation: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
          <View style={{}}>
            <Text style={{ fontSize: 18, color: COLOR.white }}>Xin chào,</Text>
            <Text style={{ fontSize: 25, fontWeight: "600", color: COLOR.white }}>{auth.info.firstName + " " + auth.info.lastName}</Text>
          </View>
          <View>
            <Image source={{ uri: `${IMAGE_DOMAIN}/${auth.info.avatar}` }} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 100 }} />
          </View>
        </View>
        <View style={{ backgroundColor: COLOR.white, padding: 20, borderRadius: 20, flexDirection: "row", elevation: 10 }}>
          <FlatList
            data={features}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(item.navigate)}>
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <FontAwesome6 name={item.icon} size={20} color="white" />
                </View>
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            numColumns={4}
          />
        </View>
      </View>

      <View style={{ marginTop: 20, backgroundColor: COLOR.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
        {dashboard !== null && (
          <View style={{ margin: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", flexWrap: "wrap" }}>
              <TouchableOpacity
                style={{ width: "50%", height: 150, marginBottom: 20 }}
                onPress={() => navigation.navigate("LessorContractList", { status: 0 })}
              >
                <View style={[styles.card, { backgroundColor: COLOR.lightGreen }]}>
                  <View>
                    <Text style={styles.icon}>🗒️</Text>
                  </View>
                  <View>
                    <Text style={styles.title2}>Hợp đồng chưa gửi</Text>
                    <Text style={styles.count}>{dashboard.contractDraft}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ width: "50%", height: 150, marginBottom: 20 }}
                onPress={() => navigation.navigate("LessorContractList", { status: 1 })}
              >
                <View style={[styles.card, { backgroundColor: COLOR.lightRed }]}>
                  <View>
                    <Text style={styles.icon}>📝</Text>
                  </View>
                  <View>
                    <Text style={styles.title2}>Hợp đồng chờ ký</Text>
                    <Text style={styles.count}>{dashboard.contractPending}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ width: "50%", height: 150, marginBottom: 20 }}
                onPress={() => navigation.navigate("LessorBillList", { status: "DRAFT" })}
              >
                <View style={[styles.card, { backgroundColor: COLOR.lightYellow }]}>
                  <View>
                    <Text style={styles.icon}>💵</Text>
                  </View>
                  <View>
                    <Text style={styles.date}>12/2024</Text>
                    <Text style={styles.title2}>Hóa đơn chưa gửi</Text>
                    <Text style={styles.count}>{dashboard.billDraft}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ width: "50%", height: 150, marginBottom: 20 }}
                onPress={() => navigation.navigate("LessorBillList", { status: "PENDING" })}
              >
                <View style={[styles.card, { backgroundColor: COLOR.lightBlue }]}>
                  <View>
                    <Text style={styles.icon}>💴</Text>
                  </View>
                  <View>
                    <Text style={styles.date}>12/2024</Text>
                    <Text style={styles.title2}>Hóa đơn chờ thanh toán</Text>
                    <Text style={styles.count}>{dashboard.billPending}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ width: "50%", height: 150, marginBottom: 20 }} onPress={() => navigation.navigate("LessorWarningList")}>
                <View style={[styles.card, { backgroundColor: COLOR.lightPuple }]}>
                  <View>
                    <Text style={styles.icon}>⚠️</Text>
                  </View>
                  <View>
                    <Text style={styles.title2}>Sự cố chưa xử lý</Text>
                    <Text style={styles.count}>{dashboard.warningPending}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "25%",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
  },

  title2: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: COLOR.black,
  },

  count: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "600",
    color: COLOR.black,
  },

  box: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 10,
    width: 140,
    height: 180,
    marginHorizontal: "auto",
    marginVertical: 10,
    elevation: 10,
  },

  icon: {
    fontSize: 40,
    textAlign: "center",
  },

  card: {
    margin: "auto",
    width: "93%",
    height: "100%",
    borderRadius: 20,
    padding: 10,
    justifyContent: "space-between",
  },

  date: {
    fontSize: 14,
    textAlign: "center",
  },
  title2: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    textAlign: "center",
  },
  count: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LessorDashboradScreen;
