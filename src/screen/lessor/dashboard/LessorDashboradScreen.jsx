import React, { useEffect } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../../constants/COLORS";
import { TouchableOpacity } from "react-native";

const features = [
  { id: "1", icon: "plus", title: "Nhà", color: "#007bff", navigate: "HouseList" },
  { id: "2", icon: "pen-to-square", title: "Bài đăng", color: "#f1c40f", navigate: "LessorPostList" },
  { id: "3", icon: "file-signature", title: "Hợp đồng", color: "#6F1E51", navigate: "LessorContractList" },
  { id: "4", icon: "file-invoice-dollar", title: "Hóa đơn", color: "#00a34c", navigate: "Room" },
  { id: "5", icon: "calendar", title: "Lịch xem phòng", color: "#9d76e6", navigate: "LessorBook" },
];

const LessorDashboradScreen = ({ navigation }) => {
  const auth = useAuth();

  useEffect(() => {}, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: COLOR.primary, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, padding: 20, elevation: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 20, color: COLOR.white }}>Xin chào,</Text>
            <Text style={{ fontSize: 35, fontWeight: "600", color: COLOR.white }}>Tuấn</Text>
          </View>
          <View>
            <Image source={require("../../../../assets/favicon.png")} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "25%",
    alignItems: "center",
    marginBottom: 10,
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
});

export default LessorDashboradScreen;
