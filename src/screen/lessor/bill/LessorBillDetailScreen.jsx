import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { get, post } from "../../../api/ApiManager";
import { COLOR } from "../../../constants/COLORS";
import { ConvertMoneyV3, getUUID } from "../../../utils/Utils";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import LoadingModal from "react-native-loading-modal";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const LessorBillDetailScreen = ({ navigation, route }) => {
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

  const sendUser = async () => {
    try {
      load.isLoading();
      const res = await post("/rental-service/bill/send-user/" + billId, {}, auth.token);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Gửi hóa đơn thành công",
        title: "Thông báo",
      });

      navigation.navigate("LessorBillList", {
        refresh: getUUID(),
      });
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const cancel = async () => {
    try {
      load.isLoading();
      const res = await post("/rental-service/bill/delete/" + billId, {}, auth.token);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Xóa hóa đơn thành công",
        title: "Thông báo",
      });

      navigation.navigate("LessorBillList", {
        refresh: getUUID(),
      });
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const updatePayment = async () => {
    try {
      load.isLoading();
      const res = await post("/rental-service/bill/update-payment/" + billId, {}, auth.token);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Xóa hóa đơn thành công",
        title: "Thông báo",
      });

      navigation.navigate("LessorBillList", {
        refresh: getUUID(),
      });
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
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
      <LoadingModal modalVisible={load.loading} />
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
                        <Row title={"Khách thuê:"} value={bill.tenantFullName} />
                      </View>
                      <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                        <Row title={"Số điện thoại:"} value={bill.tenantPhoneNumber} />
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
                      <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                        <Row title={"Thời gian thanh toán:"} value={bill.paymentDate} />
                      </View>
                      <View style={{ marginHorizontal: 15 }}>
                        <Row title={"Thời gian ký:"} value={bill.billCode} />
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

                <View>
                  {bill.status === "DRAFT" && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <TouchableOpacity style={{ width: "49%", backgroundColor: COLOR.primary, borderRadius: 10 }} onPress={cancel}>
                        <Text style={{ textAlign: "center", padding: 15, color: COLOR.white, fontWeight: "bold" }}>Xóa hóa đơn</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={{ width: "45%", backgroundColor: COLOR.primary, borderRadius: 10 }} onPress={sendUser}>
                        <Text style={{ textAlign: "center", padding: 15, color: COLOR.white, fontWeight: "bold" }}>Gửi khách thuê</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View>
                  {bill.status === "PENDING" && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <TouchableOpacity style={{ width: "100%", backgroundColor: COLOR.primary, borderRadius: 10 }} onPress={updatePayment}>
                        <Text style={{ textAlign: "center", padding: 15, color: COLOR.white, fontWeight: "bold" }}>Khách thuê đã đóng</Text>
                      </TouchableOpacity>
                    </View>
                  )}
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

export default LessorBillDetailScreen;
