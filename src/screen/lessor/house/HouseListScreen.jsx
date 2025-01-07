import React, { useEffect, useState } from "react";
import { FlatList, Image, Modal, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { get, post } from "../../../api/ApiManager";
import { COLOR } from "../../../constants/COLORS";
import HeaderBarPlus from "../../../components/header/HeaderBarPlus";
import NoData from "../../../components/NoData";
import { TouchableOpacity } from "react-native";
import ConfirmPopup from "../../../components/ConfirmPopup";
import LoadingModal from "react-native-loading-modal";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { IMAGE_DOMAIN } from "../../../constants/URL";

const HouseListScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [houses, setHouses] = useState([]);

  const [houseId, setHouseId] = useState(null);

  const [deleteVisiable, setDeleteVisiable] = useState(false);

  useEffect(() => {
    getHouse();
  }, [auth.token, route.params?.refresh]);

  const getHouse = async () => {
    load.isLoading();
    try {
      const res = await get("/rental-service/house/search", { page: page, size: size }, auth.token);
      setHouses(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const deleteHouse = async () => {
    try {
      load.isLoading();
      const res = await post(`/rental-service/house/delete/${houseId}`, null, auth.token);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Xóa nhà thành công",
        title: "Thông báo",
      });
      getHouse();
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
      setDeleteVisiable(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingModal modalVisible={load.loading} />
      <HeaderBarPlus title={"Nhà"} back={() => navigation.goBack()} plus={() => navigation.navigate("AddHouse")} />
      <View style={{ flex: 1 }}>
        {houses.length > 0 ? (
          <View style={{ padding: 5, flex: 1 }}>
            <FlatList
              scrollEnabled
              showsVerticalScrollIndicator={false}
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
                      backgroundColor: COLOR.white,
                      position: "absolute",
                      top: 5,
                      right: 5,
                      width: 25,
                      height: 25,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 20,
                      zIndex: 10,
                    }}
                    onPress={() => {
                      setHouseId(item.id);
                      setDeleteVisiable(true);
                    }}
                  >
                    <FontAwesome6 name="x" size={13} color={COLOR.red}/>
                  </TouchableOpacity>
                  <View>
                    <Image source={{ uri: IMAGE_DOMAIN + "/" + item.image }} style={styles.cardNewImg} />
                    <Text style={{ fontSize: 20, fontWeight: "bold", paddingBottom: 1, borderBottomWidth: StyleSheet.hairlineWidth, color: COLOR.primary }}>
                      {item.houseName}
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                      <FontAwesome6 name="house" />
                      {` ${item.totalEmptyRoom} phòng trống/${item.totalRoom} phòng`}
                    </Text>
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

      <Modal visible={deleteVisiable} transparent animationType="slide">
        <ConfirmPopup
          title={"Bạn có muốn xóa nhà này"}
          onCancel={() => {
            setDeleteVisiable(false);
            setHouseId(null);
          }}
          onSubmit={() => {
            deleteHouse();
          }}
        />
      </Modal>
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

  cardNewImg: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 10,
  },
});

export default HouseListScreen;
