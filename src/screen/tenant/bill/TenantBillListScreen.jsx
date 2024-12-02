import React, { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { post } from "../../../api/ApiManager";
import LoadingModal from "react-native-loading-modal";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { COLOR } from "../../../constants/COLORS";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { ConvertMoneyV3 } from "../../../utils/Utils";

const TenantBillListScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);

  const [bills, setBills] = useState([]);
  const [totalPage, setTotalPage] = useState(null);

  const [monthVisiable, setMonthVisiable] = useState(false);

  const [selectedButton, setSelectedButton] = useState("PENDING");

  useEffect(() => {
    getBill();
  }, [selectedButton]);

  const getBill = async () => {
    try {
      load.isLoading();
      const res = await post(
        "/rental-service/bill/search-for-tenant",
        {
          page: 0,
          size: 10,
          status: selectedButton,
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
            "/rental-service/bill/search-for-tenant",
            {
              page: page + 1,
              size: 10,
              status: selectedButton,
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
        <HeaderBarNoPlus title={"Hóa đơn"} back={() => navigation.goBack()} />
        <View style={{ backgroundColor: COLOR.white, flexDirection: "row" }}>
          {/* Nút "Chờ thanh toán" */}
          <Pressable style={[styles.button, selectedButton === "PENDING" && styles.selectedButton]} onPress={() => setSelectedButton("PENDING")}>
            <Text style={[styles.text, selectedButton === "PENDING" && styles.selectedText]}>Chờ thanh toán</Text>
          </Pressable>

          {/* Nút "Đã thanh toán" */}
          <Pressable style={[styles.button, selectedButton === "PAYED" && styles.selectedButton]} onPress={() => setSelectedButton("PAYED")}>
            <Text style={[styles.text, selectedButton === "PAYED" && styles.selectedText]}>Đã thanh toán</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1, padding: 10 }}>
          <FlatList
            scrollEnabled
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
                        navigation.navigate("TenantBillDetail", {
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
        </View>
      </View>
    </>
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

export default TenantBillListScreen;
