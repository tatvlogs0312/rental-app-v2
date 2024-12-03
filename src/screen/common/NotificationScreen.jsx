import React, { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../hook/AuthProvider";
import { useLoading } from "../../hook/LoadingProvider";
import { get, post } from "../../api/ApiManager";
import { COLOR } from "../../constants/COLORS";
import LoadingModal from "react-native-loading-modal";
import { useFcm } from "../../hook/FcmProvider";
import { TimeAgo } from "../../utils/Utils";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const NotificationScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();
  const { minusUnRead } = useFcm();

  const [notifications, setNotifications] = useState([]);
  const [totalPage, setTotalPage] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = async () => {
    try {
      load.isLoading();
      const res = await get("/rental-service/fcm/search", { page: 0, size: size }, auth.token);
      setNotifications(res.data);
      setTotalPage(res.totalPage);
      setPage(0);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const getMoreNotification = async () => {
    try {
      if (totalPage !== null && page + 1 < totalPage) {
        try {
          load.isLoading();
          const response = await get("/rental-service/fcm/search", { page: page + 1, size: size }, auth.token);
          const newData = response.data || [];
          setNotifications([...notifications, ...newData]);
          setPage(page + 1);
        } catch (error) {
          console.log(error);
        } finally {
          load.nonLoading();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const read = async (id, data) => {
    // Cập nhật trạng thái thông báo
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)));

    try {
      const res = await get("/rental-service/fcm/read/" + id, {}, auth.token);
      minusUnRead();

      // Parse dữ liệu từ chuỗi JSON
      const dataObj = JSON.parse(data);
      console.log(dataObj);

      // Kiểm tra loại thông báo và điều hướng phù hợp
      if (dataObj.type === "CONTRACT") {
        console.log("CONTRACT");
        navigation.navigate("TenantContractDetail", { contractId: dataObj.id });
      }

      if (dataObj.type === "BILL") {
        console.log("BILL");
        navigation.navigate("TenantBillDetail", { billId: dataObj.id });
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingModal modalVisible={load.loading} />
      <View style={{ padding: 20, backgroundColor: COLOR.white }}>
        <Text style={{ fontSize: 20, color: COLOR.primary }}>Thông báo</Text>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={load.loading} onRefresh={getNotification} />}
          onEndReached={getMoreNotification}
          onEndReachedThreshold={0}
          data={notifications}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: item.isRead ? COLOR.white : COLOR.primary,
                marginHorizontal: 10,
                marginVertical: 5,
                padding: 10,
                borderRadius: 10,
                elevation: 5,
              }}
            >
              <Pressable onPress={() => read(item.id, item.data)}>
                <View>
                  <Text style={{ marginBottom: 5, color: item.isRead ? COLOR.primary : COLOR.white, fontSize: 17, fontWeight: "bold" }}>{item.title}</Text>
                </View>
                <View>
                  <Text style={{ color: item.isRead ? COLOR.black : COLOR.white }}>{item.content}</Text>
                </View>
                <View>
                  <Text style={{ textAlign: "right" }}>
                    <FontAwesome6Icon name="clock" />
                    {" " + TimeAgo(item.timeSend)}
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default NotificationScreen;
