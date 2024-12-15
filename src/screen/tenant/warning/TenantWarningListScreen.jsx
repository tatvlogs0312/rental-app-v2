import React, { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import HeaderBarPlus from "./../../../components/header/HeaderBarPlus";
import { get } from "../../../api/ApiManager";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";
import { TimeAgo } from "../../../utils/Utils";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import NoData from "../../../components/NoData";
import { COLOR } from "../../../constants/COLORS";
import { Text } from "react-native";

const TenantWarningListScreen = ({ navigation, route }) => {
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
        "/rental-service/malfunction-warning/search-for-tenant",
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
            "/rental-service/malfunction-warning/search-for-tenant",
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
      <HeaderBarPlus title={"Sự cố"} plus={() => navigation.navigate("TenantWarningCreate")} back={() => navigation.goBack()} />
      <View style={{ backgroundColor: COLOR.white, flexDirection: "row" }}>
        <Pressable style={[styles.button, status === "PENDING" && styles.selectedButton]} onPress={() => setStatus("PENDING")}>
          <Text style={[styles.text, status === "PENDING" && styles.selectedText]}>Chờ giải quyết</Text>
        </Pressable>

        <Pressable style={[styles.button, status === "COMPLETE" && styles.selectedButton]} onPress={() => setStatus("COMPLETE")}>
          <Text style={[styles.text, status === "COMPLETE" && styles.selectedText]}>Đã giải quyết</Text>
        </Pressable>

        <Pressable style={[styles.button, status === "CANCEL" && styles.selectedButton]} onPress={() => setStatus("CANCEL")}>
          <Text style={[styles.text, status === "CANCEL" && styles.selectedText]}>Hủy</Text>
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
                    <Text style={{ fontSize: 20, color: COLOR.primary, fontWeight: "bold" }}>{item.title}</Text>
                  </View>

                  <View style={{ marginTop: 10, flexDirection: "row" }}>
                    <Text style={{ minWidth: "49%" }}>
                      <Text style={{ fontSize: 14, color: COLOR.grey }}>Nhà: </Text>
                      <Text style={{ fontWeight: "bold" }}>{item.houseName}</Text>
                    </Text>

                    <Text style={{ marginLeft: 5 }}>
                      <Text style={{ fontSize: 14, color: COLOR.grey }}>Phòng: </Text>
                      <Text style={{ fontWeight: "bold" }}>{item.roomName}</Text>
                    </Text>
                  </View>

                  <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome6Icon name="user" size={14} color={COLOR.yellow} solid />
                    <Text style={{ marginLeft: 5 }}>
                      <Text style={{ fontSize: 14, color: COLOR.grey }}>Người xử lý: </Text>
                      <Text style={{ fontWeight: "bold" }}>{item.lessorFullName}</Text>
                    </Text>
                  </View>

                  <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome6Icon name="phone" size={14} color={COLOR.green} />
                    <Text style={{ marginLeft: 5 }}>
                      <Text style={{ fontSize: 14, color: COLOR.grey }}>Liên hệ: </Text>
                      <Text style={{ fontWeight: "bold" }}>{item.lessorPhoneNumber}</Text>
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 15 }}>
                    <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                      <FontAwesome6Icon name="clock" size={14} color={COLOR.black} />
                      <Text style={{ fontWeight: "bold", marginLeft: 5 }}>{TimeAgo(item.createTimeV2)}</Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        navigation.navigate("TenantWarningDetail", {
                          id: item.id,
                        });
                      }}
                    >
                      <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>
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
    width: "33%",
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

export default TenantWarningListScreen;
