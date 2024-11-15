import React, { useEffect } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../../constants/COLORS";
import { TouchableOpacity } from "react-native";

const features = [
  { id: "1", icon: "plus", title: "Thêm phòng", color: "#007bff", navigate: "RoomAdd" },
  { id: "2", icon: "file-signature", title: "Tạo hợp đồng", color: "#6F1E51", navigate: "Room" },
  { id: "3", icon: "file-invoice-dollar", title: "Hóa đơn", color: "#00a34c", navigate: "Room" },
  { id: "4", icon: "calendar", title: "Lịch xem phòng", color: "#9d76e6", navigate: "LessorBook" },
];

const LessorDashboradScreen = ({ navigation }) => {
  const auth = useAuth();

  useEffect(() => {}, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: COLOR.lightBlue, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, padding: 20, elevation: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: COLOR.white, fontSize: 20 }}>Xin chào,</Text>
            <Text style={{ color: COLOR.white, fontSize: 35, fontWeight: "600" }}>Tuấn</Text>
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
      <View style={{ flex: 1, backgroundColor: "white", marginVertical: 10, borderRadius: 10 }}>
        <Text style={{ marginLeft: 20, fontSize: 25, fontWeight: "700" }}>Danh sách</Text>
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              width: "100%",
              padding: 10,
              marginVertical: 20,
              height: 450,
            }}
          >
            <Pressable style={{ width: "50%" }} onPress={() => navigation.navigate("Room")}>
              <View
                style={[
                  styles.box,
                  {
                    backgroundColor: "#ffeaa7",
                  },
                ]}
              >
                <View style={{ marginTop: 20 }}>
                  <FontAwesome6 name={"house"} size={40} color="white" />
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.title2}>Phòng</Text>
                  <Text style={styles.title2}>(Trống/Tổng)</Text>
                  <Text style={styles.count}>1/10</Text>
                </View>
              </View>
            </Pressable>

            <Pressable style={{ width: "50%" }}>
              <View
                style={[
                  styles.box,
                  {
                    backgroundColor: "#81ecec",
                  },
                ]}
              >
                <View style={{ marginTop: 20 }}>
                  <FontAwesome6 name={"rectangle-list"} size={40} color="white" />
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.title2}>Hợp đồng</Text>
                  <Text style={styles.title2}>(Hiệu lực)</Text>
                  <Text style={styles.count}>10</Text>
                </View>
              </View>
            </Pressable>

            <Pressable style={{ width: "50%" }}>
              <View
                style={[
                  styles.box,
                  {
                    backgroundColor: "#fab1a0",
                  },
                ]}
              >
                <View style={{ marginTop: 20 }}>
                  <FontAwesome6 name={"money-bills"} size={40} color="white" />
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.title2}>Hóa đơn</Text>
                  <Text style={styles.title2}>(Chưa đóng)</Text>
                  <Text style={styles.count}>1</Text>
                </View>
              </View>
            </Pressable>

            <Pressable style={{ width: "50%" }} onPress={() => navigation.navigate("LessorPostList")}>
              <View
                style={[
                  styles.box,
                  {
                    backgroundColor: "#74b9ff",
                  },
                ]}
              >
                <View style={{ marginTop: 20 }}>
                  <FontAwesome6 name={"pen-to-square"} size={40} color="white" />
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.title2}>Bài viết</Text>
                  <Text style={styles.title2}>(Đã đăng)</Text>
                  <Text style={styles.count}>1</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "25%",
    alignItems: "center",
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
