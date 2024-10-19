import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
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

const RoomScreen = ({ navigation }) => {
  const auth = useAuth();
  const loading = useLoading();

  const [rooms, setRooms] = useState([]);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);

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
      <View style={styles.itemStyle} key={item.roomId}>
        <Text style={{ fontSize: 17, fontWeight: "600", color: COLOR.lightBlue }}>{item.roomCode + " - " + item.typeName}</Text>
        <Text style={{ marginVertical: 3 }}>{`${item.positionDetail} - ${item.ward} - ${item.district} - ${item.province}`}</Text>
        <Text style={{}}>{`Trạng thái: ${item.roomStatus.trim() === "EMPTY" ? "Còn trống" : "Đã cho thuê"}`}</Text>
        <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-end", alignContent: "flex-end" }}>
          <Pressable
            onPress={() => {
              setPostVisiable(true);
              setRoomId(item.roomId);
            }}
          >
            <Text style={{ marginRight: 15, color: COLOR.lightBlue }}>Đăng bài</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("RoomDetail", {
                id: item.roomId,
              });
            }}
          >
            <Text style={{ color: COLOR.lightBlue }}>Xem chi tiết</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={{ marginHorizontal: 0, marginTop: 0, marginBottom: 150, height: heighScreen - 130 }}>
        <View style={{ flexDirection: "column", justifyContent: "space-between", marginHorizontal: 10, marginTop: 15 }}>
          <View>
            <Text style={{ fontSize: 22, textAlign: "center", marginBottom: 10, fontWeight: "800", color: COLOR.lightBlue }}>Danh sách phòng của bạn</Text>
          </View>
          <FlatList
            data={rooms}
            renderItem={renderItem}
            keyExtractor={(item) => item.roomId}
            ListFooterComponent={renderLoader}
            onEndReached={loadMoreItem}
            onEndReachedThreshold={0}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          />
        </View>
        <View>
          <Button
            title={"Thêm phòng"}
            onPress={() => {
              navigation.navigate("RoomAdd");
            }}
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
});

export default RoomScreen;
