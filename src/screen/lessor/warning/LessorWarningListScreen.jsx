import React, { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { useAuth } from "./../../../hook/AuthProvider";
import { useLoading } from "./../../../hook/LoadingProvider";
import { COLOR } from "../../../constants/COLORS";
import { get, post } from "../../../api/ApiManager";
import LoadingModal from "react-native-loading-modal";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import NoData from "../../../components/NoData";
import { TimeAgo } from "../../../utils/Utils";

const LessorWarningListScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [warnings, setWarnings] = useState([]);
  const [totalPage, setTotalPage] = useState(null);

  const [status, setStatus] = useState("PENDING");
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (auth.token !== "") {
      getWarning();
    }
  }, [auth.token, route.params?.refresh]);

  useEffect(() => {
    getWarning();
  }, [status]);

  const getWarning = async () => {
    try {
      load.isLoading();
      const res = await get(
        "/rental-service/malfunction-warning/search-for-lessor",
        {
          page: 0,
          size: 10,
          status: status,
        },
        auth.token,
      );
      setWarnings(res.data);
      setTotalPage(res.totalPage);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const getMoreWarning = async () => {
    try {
      if (totalPage !== null && page + 1 < totalPage) {
        try {
          const response = await get(
            "/rental-service/malfunction-warning/search-for-lessor",
            {
              page: page + 1,
              size: 10,
              status: status,
            },
            auth.token,
          );
          const newData = response.data || [];
          setWarnings([...warnings, ...newData]);
          setPage(page + 1);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingModal modalVisible={load.loading} />
      <HeaderBarNoPlus title={"Sự cố"} back={() => navigation.goBack()} />
      <View style={{ backgroundColor: COLOR.white, flexDirection: "row" }}>
        <Pressable style={[styles.button, status === "PENDING" && styles.selectedButton]} onPress={() => setStatus("PENDING")}>
          <Text style={[styles.text, status === "PENDING" && styles.selectedText]}>Chờ giải quyết</Text>
        </Pressable>

        <Pressable style={[styles.button, status === "COMPLETE" && styles.selectedButton]} onPress={() => setStatus("COMPLETE")}>
          <Text style={[styles.text, status === "COMPLETE" && styles.selectedText]}>Đã giải quyết</Text>
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>
        {warnings.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={warnings}
            refreshControl={<RefreshControl refreshing={load.loading} onRefresh={getWarning} />}
            onEndReached={getMoreWarning}
            onEndReachedThreshold={0}
            renderItem={({ item }) => (
              <View style={{ margin: 10, padding: 15, backgroundColor: COLOR.white, borderRadius: 10, elevation: 5 }}>
                <Pressable>
                  <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey }}>
                    <Text style={{ fontSize: 20, color: COLOR.primary }}>{item.title}</Text>
                  </View>
                  <View style={{ marginTop: 10, flexDirection: "row" }}>
                    <Text style={{ minWidth: "50%" }}>
                      <Text style={{ fontSize: 14, color: COLOR.grey }}>Nhà: </Text>
                      <Text style={{ fontWeight: "bold" }}>{item.houseName}</Text>
                    </Text>
                    <Text>
                      <Text style={{ fontSize: 14, color: COLOR.grey }}>Phòng: </Text>
                      <Text style={{ fontWeight: "bold" }}>{item.roomName}</Text>
                    </Text>
                  </View>
                  <View style={{ marginTop: 10, flexDirection: "row" }}>
                    <Text>
                      <Text style={{ fontSize: 14, color: COLOR.grey }}>Người thông báo: </Text>
                      <Text style={{ fontWeight: "bold" }}>{item.tenantFullName}</Text>
                    </Text>
                  </View>
                  <View style={{ marginTop: 10, flexDirection: "row" }}>
                    <Text>
                      <Text style={{ fontSize: 14, color: COLOR.grey }}>Thời gian tạo: </Text>
                      <Text style={{ fontWeight: "bold" }}>{TimeAgo(item.createTimeV2)}</Text>
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end", marginTop: 15 }}>
                    <Pressable
                      onPress={() => {
                        navigation.navigate("LessorWarningDetail", {
                          id: item.id,
                        });
                      }}
                    >
                      <Text style={{ color: COLOR.primary }}>
                        {"Chi tiết  "}
                        <FontAwesome6Icon name="angle-right" />
                      </Text>
                    </Pressable>
                  </View>
                </Pressable>
              </View>
            )}
          />
        ) : (
          <View style={{ marginTop: 20 }}>
            <NoData message={"Chưa có sự cố nào"} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "50%",
    padding: 10,
  },
  selectedButton: {
    borderBottomWidth: 2, // Đường viền dưới
    borderBottomColor: COLOR.primary, // Màu của đường viền
  },
  text: {
    textAlign: "center",
    color: "#000", // Màu chữ mặc định
  },
  selectedText: {
    color: COLOR.primary, // Màu chữ của nút được chọn
    fontWeight: "bold", // Chữ đậm cho nút được chọn
  },
});

export default LessorWarningListScreen;
