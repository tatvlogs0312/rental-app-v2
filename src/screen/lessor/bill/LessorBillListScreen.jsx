import React, { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import HeaderBarPlus from "../../../components/header/HeaderBarPlus";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { COLOR } from "../../../constants/COLORS";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native";
import { post } from "../../../api/ApiManager";
import { ConvertMoneyV3 } from "../../../utils/Utils";
import LoadingModal from "react-native-loading-modal";
import NoData from "../../../components/NoData";

const months = [
  { name: "Jan", value: 1 },
  { name: "Feb", value: 2 },
  { name: "Mar", value: 3 },
  { name: "Apr", value: 4 },
  { name: "May", value: 5 },
  { name: "Jun", value: 6 },
  { name: "Jul", value: 7 },
  { name: "Aug", value: 8 },
  { name: "Sep", value: 9 },
  { name: "Oct", value: 10 },
  { name: "Nov", value: 11 },
  { name: "Dec", value: 12 },
];

const LessorBillListScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [status, setStatus] = useState(route.params?.status || "DRAFT");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [bills, setBills] = useState([]);
  const [totalPage, setTotalPage] = useState(null);

  const [monthVisiable, setMonthVisiable] = useState(false);

  const [selectedYear, setSelectedYear] = useState(year);

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

  const getBillWithParams = async (monthReq, yearReq) => {
    try {
      load.isLoading();
      const res = await post(
        "/rental-service/bill/search-for-lessor",
        {
          page: 0,
          size: 10,
          status: status,
          month: monthReq,
          year: yearReq,
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

  const changeYear = (direction) => {
    setSelectedYear(selectedYear + direction);
  };

  const renderMonth = ({ item }) => (
    <TouchableOpacity
      style={styles.monthContainer}
      onPress={async () => {
        setMonth(item.value);
        setYear(selectedYear);
        await getBillWithParams(item.value, selectedYear);
        setMonthVisiable(false);
      }}
    >
      <Text style={styles.monthText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <LoadingModal modalVisible={load.loading} />
      <View style={{ flex: 1 }}>
        <HeaderBarPlus title={"Hóa đơn"} plus={() => navigation.navigate("LessorBillCreate")} back={() => navigation.goBack()} />
        <View style={{ backgroundColor: COLOR.white, flexDirection: "row" }}>
          <Pressable style={[styles.button, status === "DRAFT" && styles.selectedButton]} onPress={() => setStatus("DRAFT")}>
            <Text style={[styles.text, status === "DRAFT" && styles.selectedTextTab]}>Nháp</Text>
          </Pressable>

          <Pressable style={[styles.button, status === "PENDING" && styles.selectedButton]} onPress={() => setStatus("PENDING")}>
            <Text style={[styles.text, status === "PENDING" && styles.selectedTextTab]}>Chờ thanh toán</Text>
          </Pressable>

          <Pressable style={[styles.button, status === "PAYED" && styles.selectedButton]} onPress={() => setStatus("PAYED")}>
            <Text style={[styles.text, status === "PAYED" && styles.selectedTextTab]}>Đã thanh toán</Text>
          </Pressable>
        </View>
        <View style={{ margin: 10, flex: 1 }}>
          <TouchableOpacity
            onPress={() => setMonthVisiable(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ddd",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              width: "100%",
              alignSelf: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ marginRight: 10, backgroundColor: "#FFF5E5", borderRadius: 5, padding: 5 }}>
                <FontAwesome6Icon name="calendar" size={20} color="#FFA500" />
              </View>
              <Text style={{ fontSize: 16, color: "#333", fontWeight: "bold" }}>{`Tháng ${month} - Năm ${year}`}</Text>
            </View>
            <FontAwesome6Icon name="rotate" size={20} color="#FFA500" />
          </TouchableOpacity>

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
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ width: "100%", height: 400, backgroundColor: "white", borderRadius: 8, padding: 20 }}>
            <View>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => changeYear(-1)}>
                  <Text style={styles.arrow}>&lt;</Text>
                </TouchableOpacity>
                <Text style={styles.yearText}>{selectedYear}</Text>
                <TouchableOpacity onPress={() => changeYear(1)}>
                  <Text style={styles.arrow}>&gt;</Text>
                </TouchableOpacity>
              </View>
              {/* Month Grid */}
              <FlatList
                data={months}
                renderItem={renderMonth}
                keyExtractor={(item) => item}
                numColumns={3} // Hiển thị 3 tháng trên mỗi hàng
                contentContainerStyle={styles.grid}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setMonthVisiable(false);
                setSelectedYear(year);
              }}
              style={{ padding: 10, marginTop: 10 }}
            >
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
  selectedTextTab: {
    color: COLOR.primary, // Màu chữ của nút được chọn
    fontWeight: "bold", // Chữ đậm cho nút được chọn
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // width: "60%",
    marginBottom: 20,
  },
  arrow: {
    fontSize: 25,
    padding: 5,
    fontWeight: "bold",
    color: "#333",
  },
  yearText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  monthContainer: {
    flex: 1,
    margin: 5,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    // backgroundColor: "#E0E0E0",
  },
  monthText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default LessorBillListScreen;
