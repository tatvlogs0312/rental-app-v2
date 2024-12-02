import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { COLOR } from "../../../constants/COLORS";
import { ConvertMoneyV3 } from "../../../utils/Utils";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { get } from "../../../api/ApiManager";

const TenantBillDetailScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const billId = route.params.billId;

  const [bill, setBill] = useState(null);

  useEffect(() => {
    if (auth.token !== "") {
      getBill();
    }
  }, [auth.token]);

  const getBill = async () => {
    try {
      const res = await get("/rental-service/bill/detail/" + billId, {}, auth.token);
      setBill(res);
    } catch (error) {
      console.log(error);
    }
  };

  const Row = ({ title, value }) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 15 }}>
        <View>
          <Text style={{ color: COLOR.grey }}>{title}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold" }}>{value}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <HeaderBarNoPlus title={"Quay lại"} back={() => navigation.goBack()} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: 10, flex: 1 }}>
            {bill !== null && (
              <View>
                <View>
                  <View style={{ marginBottom: 15 }}>
                    <Text style={{ fontSize: 16, padding: 5, color: COLOR.primary }}>Thông tin hóa đơn</Text>
                    <View style={{ backgroundColor: COLOR.white, borderRadius: 10 }}>
                      <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                        <Row title={"Mã hóa đơn:"} value={bill.billCode} />
                      </View>
                      <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                        <Row title={"Nhà:"} value={bill.houseName} />
                      </View>
                      <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                        <Row title={"Phòng:"} value={bill.roomName} />
                      </View>
                      <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                        <Row title={"Tháng:"} value={bill.month} />
                      </View>
                      <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                        <Row title={"Năm:"} value={bill.year} />
                      </View>
                      <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                        <Row title={"Thời gian tạo:"} value={bill.createDate} />
                      </View>
                      <View style={{ marginHorizontal: 15 }}>
                        <Row title={"Thời gian thanh toán:"} value={bill.paymentDate} />
                      </View>
                    </View>
                  </View>

                  <View style={{ marginBottom: 15 }}>
                    <Text style={{ fontSize: 16, padding: 5, color: COLOR.primary }}>Chi tiết hóa đơn</Text>
                    <View style={{ backgroundColor: COLOR.white, borderRadius: 10 }}>
                      <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                        <Row title={"Tiền phòng tháng sau:"} value={ConvertMoneyV3(bill.rentPriceNextMonth)} />
                      </View>

                      <FlatList
                        data={bill.details}
                        renderItem={({ item }) => (
                          <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                            <Row title={item.utilityName} value={`${item.numberUsed} ${item.utilityUnit} x ${ConvertMoneyV3(item.utilityPrice)}`} />
                          </View>
                        )}
                      />

                      <View style={{ marginHorizontal: 15 }}>
                        <Row title={"Tổng hóa đơn:"} value={ConvertMoneyV3(bill.moneyPayment)} />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({});

export default TenantBillDetailScreen;
