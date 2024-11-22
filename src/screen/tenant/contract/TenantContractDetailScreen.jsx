import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { COLOR } from "../../../constants/COLORS";
import { useState } from "react";
import { get } from "../../../api/ApiManager";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { TouchableOpacity } from "react-native";

const TenantContractDetailScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const contractId = route.params?.contractId;

  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (auth.token !== "") {
      getContract();
    }
  }, [auth.token]);

  const getContract = async () => {
    try {
      const res = await get("/contract/detail/" + contractId, null, auth.token);
      setContract(res);
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
    <View style={{ flex: 1 }}>
      <HeaderBarNoPlus title={"BACK"} back={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 10, flex: 1 }}>
          {contract !== null && (
            <View>
              <View>
                <View style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 16, padding: 5, color: COLOR.primary }}>Thông tin hợp đồng</Text>
                  <View style={{ backgroundColor: COLOR.white, borderRadius: 10 }}>
                    <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Mã hợp đồng:"} value={contract.contractCode} />
                    </View>
                    <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Thời gian tạo:"} value={contract.createdTime} />
                    </View>
                    <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Ngày hiệu lực:"} value={contract.startDate} />
                    </View>
                    <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Ngày kết thúc:"} value={contract.endDate} />
                    </View>
                    <View style={{ marginHorizontal: 15 }}>
                      <Row title={"Thời gian ký:"} value={contract.signTime} />
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 16, padding: 5, color: COLOR.primary }}>Giá thuê phòng & dịch vụ</Text>
                  <View style={{ backgroundColor: COLOR.white, borderRadius: 10 }}>
                    <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Tiền phòng hàng tháng:"} value={contract.contractCode} />
                    </View>
                    {contract.utilities.map((item, index) => (
                      <View
                        style={
                          index === contract.utilities.length - 1
                            ? { borderColor: COLOR.grey, marginHorizontal: 15 }
                            : { borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }
                        }
                      >
                        <Row title={item.utilityName + ":"} value={item.utilityPrice + "/" + item.utilityUnit} />
                      </View>
                    ))}
                  </View>
                </View>

                <View style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 16, padding: 5, color: COLOR.primary }}>Thông tin chủ trọ</Text>
                  <View style={{ backgroundColor: COLOR.white, borderRadius: 10 }}>
                    <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Họ tên:"} value={contract.lessorFirstName + " " + contract.lessorLastName} />
                    </View>
                    <View style={{ marginHorizontal: 15 }}>
                      <Row title={"Số điện thoại:"} value={contract.lessorPhoneNumber} />
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 16, padding: 5, color: COLOR.primary }}>Thông tin khách thuê</Text>
                  <View style={{ backgroundColor: COLOR.white, borderRadius: 10 }}>
                    <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Họ tên:"} value={contract.tenantFirstName + " " + contract.tenantLastName} />
                    </View>
                    <View style={{ marginHorizontal: 15 }}>
                      <Row title={"Số điện thoại:"} value={contract.tenantPhoneNumber} />
                    </View>
                  </View>
                </View>

                <View style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 16, padding: 5, color: COLOR.primary }}>Thông tin phòng</Text>
                  <View style={{ backgroundColor: COLOR.white, borderRadius: 10 }}>
                    <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Nhà:"} value={contract.houseName} />
                    </View>
                    <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Phòng:"} value={contract.roomName} />
                    </View>
                    <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Địa chỉ:"} value={contract.position.detail} />
                    </View>
                    <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Xã/Phường:"} value={contract.position.ward} />
                    </View>
                    <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Quận/Huyện:"} value={contract.position.district} />
                    </View>
                    <View style={{ marginHorizontal: 15 }}>
                      <Row title={"Tỉnh/Thành phố:"} value={contract.position.province} />
                    </View>
                  </View>
                </View>
              </View>

              {contract.contractStatusCode === "PENDING_SIGNED" && (
                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, marginBottom: 20 }}>
                  <TouchableOpacity style={{ width: "45%", backgroundColor: COLOR.primary, borderRadius: 20 }}>
                    <Text style={{ textAlign: "center", padding: 15, color: COLOR.white, fontWeight: "bold" }}>Từ chối</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ width: "45%", backgroundColor: COLOR.primary, borderRadius: 20 }}>
                    <Text style={{ textAlign: "center", padding: 15, color: COLOR.white, fontWeight: "bold" }}>Ký hợp đồng</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default TenantContractDetailScreen;
