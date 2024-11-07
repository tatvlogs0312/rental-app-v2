import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useAuth } from "../../hook/AuthProvider";
import { apiCall } from "../../api/ApiManager";
import { COLOR } from "../../constants/COLORS";
import { heighScreen, witdhScreen } from "../../utils/Utils";
import { useLoading } from "../../hook/LoadingProvider";
import axios from "axios";
import { DOMAIN } from "../../constants/URL";
import Modal, { ModalContent } from "react-native-modals";
import AddPostModal from "../../components/post/AddPostModal";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native";

const RoomScreen = ({ navigation }) => {
  const auth = useAuth();
  const loading = useLoading();

  const [rooms, setRooms] = useState([]);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(7);

  const [refreshing, setRefreshing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [postVisiable, setPostVisiable] = useState(false);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    fetchDataV2();
  }, [auth.token]);

  const loadMoreItem = () => {
    fetchData();
    setPage(page + 1);
  };

  const fetchData = () => {
    setIsLoading(true);

    axios
      .post(
        DOMAIN + "/room/search",
        {
          status: "",
          roomTypeId: "",
          position: "",
          ward: "",
          district: "",
          province: "",
          page: page + 1,
          size: size,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        },
      )
      .then((res) => setRooms([...rooms, ...res.data.data]))
      .catch((error) => console.log(error));

    setIsLoading(false);
  };

  const fetchDataV2 = () => {
    if (!auth.token) return;

    axios
      .post(
        DOMAIN + "/room/search",
        {
          status: "",
          roomTypeId: "",
          position: "",
          ward: "",
          district: "",
          province: "",
          page: 0,
          size: size,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        },
      )
      .then((res) => {
        console.log(res.data);
        setRooms(res.data.data);
      })
      .catch((error) => console.log(error));
  };

  const refresh = () => {
    setRefreshing(true);
    fetchDataV2();
    setRefreshing(false);
    setPage(0);
  };

  const renderLoader = () => {
    return isLoading ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ backgroundColor: COLOR.white, marginVertical: 5, padding: 10, borderRadius: 20, elevation: 2 }}>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "grey", flexDirection: "row" }}>
          <Text style={{ color: "white", backgroundColor: "#079992", padding: 5, borderRadius: 10, marginBottom: 5, fontWeight: "600" }}>
            {item.typeName + " - " + item.roomCode}
          </Text>
          <Text style={{ color: "white", backgroundColor: "#0a3d62", padding: 5, borderRadius: 10, marginBottom: 5, marginLeft: 2, fontWeight: "600" }}>{`${
            item.roomStatus.trim() === "EMPTY" ? "Còn trống" : "Đã cho thuê"
          }`}</Text>
        </View>
        <View>
          <View>
            <Text style={{ marginVertical: 3, fontSize: 15 }}>
              <FontAwesome6 name="location-dot" size={15} />
              {` ${item.positionDetail} - ${item.ward} - ${item.district} - ${item.province}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const SeachBar = () => {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => navigation.goBack()} style={{ marginHorizontal: 5 }}>
            <FontAwesome6 name="arrow-left" size={20} color="#7e8c99" />
          </Pressable>
          <Text style={{ marginLeft: 10, fontSize: 18 }}>Danh sách phòng</Text>
        </View>
        <TouchableOpacity
          style={{ alignItems: "center", padding: 6, backgroundColor: "black", flexDirection: "row", borderRadius: 15 }}
          onPress={() => navigation.navigate("RoomAdd")}
        >
          <FontAwesome6 name="plus" size={20} color="white" style={{ marginRight: 5 }} />
          <Text style={{ color: "white" }}>Thêm phòng</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={{ marginHorizontal: 0, marginTop: 0, marginBottom: 150, height: heighScreen - 130 }}>
        <SeachBar />
        <View style={{ flexDirection: "column", justifyContent: "space-between", paddingHorizontal: 10, marginTop: 15 }}>
          {/* <View>
            <Text style={{ fontSize: 22, textAlign: "center", marginBottom: 10, fontWeight: "800", color: COLOR.lightBlue }}>Danh sách phòng của bạn</Text>
          </View> */}
          <FlatList
            showsVerticalScrollIndicator={false}
            data={rooms}
            renderItem={renderItem}
            keyExtractor={(item) => item.roomId}
            ListFooterComponent={renderLoader}
            onEndReached={loadMoreItem}
            onEndReachedThreshold={0}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          />
        </View>
      </SafeAreaView>
      <Modal
        style={{ justifyContent: "flex-end" }}
        visible={postVisiable}
        onTouchOutside={() => {
          setPostVisiable(false);
          setRoomId(null);
        }}
      >
        <ModalContent style={{ width: witdhScreen }}>
          <AddPostModal
            roomId={roomId}
            onCancel={() => {
              setRoomId(null);
              setPostVisiable(false);
            }}
            onSubmit={() => {
              setRoomId(null);
              setPostVisiable(false);
            }}
          />
        </ModalContent>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  itemStyle: {
    borderWidth: 2,
    borderColor: COLOR.lightBlue,
    padding: 7,
    marginVertical: 10,
    borderRadius: 5,
  },
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f1f1f5",
    padding: 10,
    // borderRadius: 15,
    // margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default RoomScreen;
