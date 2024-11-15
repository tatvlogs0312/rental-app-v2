import React, { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { get } from "../../../api/ApiManager";
import { COLOR } from "../../../constants/COLORS";
import HeaderBarPlus from "../../../components/header/HeaderBarPlus";
import NoData from "../../../components/NoData";
import { TouchableOpacity } from "react-native";

const HouseListScreen = ({ navigation }) => {
  const auth = useAuth();
  const load = useLoading();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [houses, setHouses] = useState([]);

  useEffect(() => {
    getHouse();
  }, [page, size, auth.token]);

  const getHouse = async () => {
    load.isLoading();
    try {
      const res = await get("/house/search", { page: page, size: size }, auth.token);
      setHouses(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <HeaderBarPlus title={"Nhà"} back={() => navigation.goBack()} plus={() => navigation.navigate("AddHouse")} />
      <View>
        {houses.length > 0 ? (
          <View style={{ padding: 10 }}>
            <FlatList
              refreshControl={<RefreshControl refreshing={load.loading} onRefresh={getHouse} />}
              data={houses}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.card}
                  onPress={() => {
                    navigation.navigate("RoomList", {
                      houseId: item.id,
                      houseName: item.houseName,
                    });
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLOR.black,
                      position: "absolute",
                      top: 5,
                      right: 5,
                      width: 25,
                      height: 25,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 20,
                    }}
                  >
                    <FontAwesome6 name="x" size={10} color={COLOR.white} />
                  </TouchableOpacity>
                  <View>
                    <Text style={{ fontSize: 20, fontWeight: "bold", paddingBottom: 1, borderBottomWidth: 0.5 }}>{item.houseName}</Text>
                    <Text style={{ marginTop: 10 }}>
                      <FontAwesome6 name="location-dot" />
                      {` ${item.positionDetail} - ${item.ward} - ${item.district} - ${item.province}`}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          </View>
        ) : (
          <NoData message={"Không có dữ liệu"} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    // Thiết lập đổ bóng cho iOS
    shadowColor: "#000",
    shadowRadius: 20,
    // Thiết lập đổ bóng cho Android
    elevation: 5,
  },
});

export default HouseListScreen;
