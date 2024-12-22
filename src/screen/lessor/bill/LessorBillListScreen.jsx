import React, { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import HeaderBarPlus from "../../../components/header/HeaderBarPlus";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { COLOR } from "../../../constants/COLORS";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native";
import { post } from "../../../api/ApiManager";
import { MonthList } from "../../../constants/Month";
import { ConvertMoneyV3 } from "../../../utils/Utils";
import LoadingModal from "react-native-loading-modal";
import NoData from "../../../components/NoData";

const LessorBillListScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [status, setStatus] = useState(route.params?.status || "DRAFT");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [bills, setBills] = useState([]);
  const [totalPage, setTotalPage] = useState(null);

  const [monthVisiable, setMonthVisiable] = useState(false);

  useEffect(() => {
    if (auth.token !== "") {
      getBill();
    }
  }, [auth.token, route.params?.refresh]);

  useEffect(() => {
    getBill();
  }, [status]);

  const getBill = async () => {
    try {
      load.isLoading();
      const res = await post(
        "/rental-service/bill/search-for-lessor",
        {
          page: 0,
          size: 10,
          status: status,
          month: month,
          year: year,
        },
        auth.token,
      );
      setBills(res.data);
      setTotalPage(res.totalPage);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const getMoreBill = async () => {
    try {
      if (totalPage !== null && page + 1 < totalPage) {
        try {
          const response = await post(
            "/rental-service/bill/search-for-lessor",
            {
              page: page + 1,
              size: 10,
              status: status,
              month: month,
              year: year,
            },
            auth.token,
          );
          const newData = response.data || [];
          setBills([...bills, ...newData]);
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
    <>
      <LoadingModal modalVisible={load.loading} />
      <View style={{ flex: 1 }}>
        <HeaderBarPlus title={"Hóa đơn"} plus={() => navigation.navigate("LessorBillCreate")} back={() => navigation.goBack()} />
        <View style={{ backgroundColor: COLOR.white, flexDirection: "row" }}>
          <Pressable style={[styles.button, status === "DRAFT" && styles.selectedButton]} onPress={() => setStatus("DRAFT")}>
            <Text style={[styles.text, status === "DRAFT" && styles.selectedText]}>Nháp</Text>
          </Pressable>

          <Pressable style={[styles.button, status === "PENDING" && styles.selectedButton]} onPress={() => setStatus("PENDING")}>
            <Text style={[styles.text, status === "PENDING" && styles.selectedText]}>Chờ thanh toán</Text>
          </Pressable>

          <Pressable style={[styles.button, status === "PAYED" && styles.selectedButton]} onPress={() => setStatus("PAYED")}>
            <Text style={[styles.text, status === "PAYED" && styles.selectedText]}>Đã thanh toán</Text>
          </Pressable>
        </View>
        <View style={{ margin: 10, flex: 1 }}>
          <View style={{ backgroundColor: COLOR.white, padding: 10, borderRadius: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
              <View style={{ width: 140 }}>
                <Text style={styles.inputTitle}>Tháng:</Text>
                <Pressable onPress={() => setMonthVisiable(true)} style={{ zIndex: 10 }}>
                  <TextInput placeholder="Chọn tháng" readOnly style={styles.input} value={String(month)} />
                </Pressable>
              </View>

              <View style={{ width: 180 }}>
                <Text style={styles.inputTitle}>Năm:</Text>
                <TextInput placeholder="Nhập năm" style={styles.input} keyboardType="number-pad" onChangeText={(t) => setYear(t)} value={String(year)} />
              </View>

              <TouchableOpacity
                style={{ backgroundColor: COLOR.primary, width: 40, height: 40, justifyContent: "center", alignItems: "center", borderRadius: 10 }}
                onPress={getBill}
              >
                <FontAwesome6Icon name="magnifying-glass" size={20} color={COLOR.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            {bills.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={bills}
                refreshControl={<RefreshControl refreshing={load.loading} onRefresh={getBill} />}
                onEndReached={getMoreBill}
                onEndReachedThreshold={0}
                renderItem={({ item }) => (
                  <View style={{ marginVertical: 10, padding: 15, backgroundColor: COLOR.white, borderRadius: 10 }}>
                    <Pressable>
                      <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey }}>
                        <Text style={{ fontSize: 20, color: COLOR.primary }}>{item.houseName + "/" + item.roomName}</Text>
                        <View style={{ marginVertical: 5, flexDirection: "row", justifyContent: "space-between" }}>
                          <Text style={{ fontSize: 14, color: COLOR.grey }}>
                            <FontAwesome6Icon name="calendar" />
                            {" Tháng " + item.month + " - Năm " + item.year}
                          </Text>
                          <Text style={{ fontSize: 14, color: COLOR.grey }}>
                            <FontAwesome6Icon name="clock" />
                            {" " + item.createDate}
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <Text>
                          <Text style={{ fontSize: 14, color: COLOR.grey }}>Mã hóa đơn: </Text>
                          <Text style={{ fontWeight: "bold" }}>{item.billCode}</Text>
                        </Text>
                        <Text style={{ marginVertical: 5 }}>
                          <Text style={{ fontSize: 14, color: COLOR.grey }}>Số tiền trả: </Text>
                          <Text style={{ fontWeight: "bold" }}>{ConvertMoneyV3(item.price)}</Text>
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 15 }}>
                        <View>
                          <Text
                            style={{
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              backgroundColor: COLOR.lightYellow,
                              fontWeight: "bold",
                              color: COLOR.primary,
                              borderRadius: 5,
                            }}
                          >
                            <FontAwesome6Icon name="tag" size={15} />
                            {"  " + item.statusName}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => {
                            navigation.navigate("LessorBillDetail", {
                              billId: item.billId,
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
                <NoData message={"Chưa có hóa đơn nào"} />
              </View>
            )}
          </View>
        </View>
      </View>

      <Modal visible={monthVisiable} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", height: 400, backgroundColor: "white", borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Chọn tháng:</Text>
            <FlatList
              scrollEnabled
              showsVerticalScrollIndicator={false}
              data={MonthList}
              renderItem={({ index, item }) => (
                <TouchableOpacity
                  key={index}
                  style={{ padding: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLOR.grey }}
                  onPress={() => {
                    setMonth(item.key);
                    setMonthVisiable(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item.value}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setMonthVisiable(false)} style={{ padding: 10, marginTop: 10 }}>
              <Text style={{ color: "red", textAlign: "center" }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    color: COLOR.black,
    borderColor: COLOR.grey,
    fontWeight: "bold",
  },

  inputTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLOR.grey,
    marginTop: 10,
    marginBottom: 5,
  },

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

export default LessorBillListScreen;
