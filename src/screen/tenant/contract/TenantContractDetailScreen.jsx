import React, { useEffect } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { COLOR } from "../../../constants/COLORS";
import { useState } from "react";
import { get, post } from "../../../api/ApiManager";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { TouchableOpacity } from "react-native";
import LoadingModal from "react-native-loading-modal";
import { ConvertMoneyV3, getUUID } from "../../../utils/Utils";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const TenantContractDetailScreen = ({ navigation, route }) => {
  console.log(route.params);

  const auth = useAuth();
  const load = useLoading();

  const contractId = route.params?.contractId;
  const stackNavigate = route.params?.stack || null;
  const screenNavigate = route.params?.screen || null;

  const [contract, setContract] = useState(null);

  const [reason, setReason] = useState(null);

  const [reasonMsg, setReasonMsg] = useState(null);

  const [rejectVisiable, setRejectVisiable] = useState(false);

  useEffect(() => {
    if (auth.token !== "") {
      getContract();
    }
  }, [auth.token]);

  const getContract = async () => {
    try {
      const res = await get("/rental-service/contract/detail/" + contractId, null, auth.token);
      setContract(res);
    } catch (error) {
      console.log(error);
    }
  };

  const reject = async () => {
    if (handleInputReject()) {
      try {
        load.isLoading();
        const res = await post(
          "/rental-service/contract/reject",
          {
            id: contractId,
            message: reason,
          },
          auth.token,
        );

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          textBody: "Từ chối hợp đồng thành công",
          title: "Thông báo",
        });

        navigation.navigate("TenantContractList", {
          refresh: getUUID(),
        });
      } catch (error) {
        console.log(error);
      } finally {
        load.nonLoading();
        setRejectVisiable(false);
        setReason(null);
      }
    }
  };

  const setInputReason = (text) => {
    setReason(text);
    setReasonMsg("");
  };

  const handleInputReject = () => {
    if (reason === null || reason === "") {
      console.log("====================================");
      console.log(reason);
      console.log("====================================");
      setReasonMsg("Vui lòng nhập lý do từ chối");
      return false;
    }

    return true;
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
      <LoadingModal modalVisible={load.loading} />
      <HeaderBarNoPlus title={"Quay lại"} back={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 10, flex: 1 }}>
          {contract !== null && (
            <View>
              <View>
                {(contract.contractStatusCode === "REJECT" || contract.contractStatusCode === "CANCEL") && (
                  <View
                    style={{
                      paddingHorizontal: 5,
                      paddingVertical: 10,
                      backgroundColor: "rgba(253, 121, 168, 0.5)",
                      borderRadius: 10,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ marginHorizontal: 10 }}>
                      <FontAwesome6Icon name="triangle-exclamation" color={COLOR.red} light size={20} />
                    </View>
                    <View>
                      <Text style={{ color: COLOR.red }}>Hợp đồng bị hủy/từ chối</Text>
                      {contract.statusMessage !== null && (
                        <Text>
                          Lý do: <Text>{contract.statusMessage}</Text>
                        </Text>
                      )}
                    </View>
                  </View>
                )}
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
                      <Row title={"Tiền phòng hàng tháng:"} value={ConvertMoneyV3(contract.price)} />
                    </View>
                    {contract.utilities.map((item, index) => (
                      <View
                        style={
                          index === contract.utilities.length - 1
                            ? { borderColor: COLOR.grey, marginHorizontal: 15 }
                            : { borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }
                        }
                      >
                        <Row title={item.utilityName + ":"} value={ConvertMoneyV3(item.utilityPrice) + "/" + item.utilityUnit} />
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
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <TouchableOpacity style={{ width: "49%", backgroundColor: COLOR.primary, borderRadius: 10 }} onPress={() => setRejectVisiable(true)}>
                    <Text style={{ textAlign: "center", padding: 15, color: COLOR.white, fontWeight: "bold" }}>Từ chối</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ width: "49%", backgroundColor: COLOR.primary, borderRadius: 10 }}
                    onPress={() =>
                      navigation.navigate("TenantContractSign", {
                        id: contractId,
                      })
                    }
                  >
                    <Text style={{ textAlign: "center", padding: 15, color: COLOR.white, fontWeight: "bold" }}>Ký hợp đồng</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={rejectVisiable} transparent={true} animationType="slide" onRequestClose={() => setRejectVisiable(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", backgroundColor: "white", borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Từ chối hợp đồng</Text>
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: COLOR.primary, fontWeight: "bold", fontSize: 15 }}>* Nhập lý do từ chối:</Text>
              <TextInput
                style={styles.inputMutiline}
                placeholder="Nhập lý do từ chối của bạn"
                multiline
                onChangeText={(t) => setInputReason(t)}
                value={reason}
              />
              <Text style={{ color: COLOR.red, fontSize: 13 }}>{reasonMsg}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setRejectVisiable(false);
                  setReasonMsg(null);
                }}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accessButton} onPress={reject}>
                <Text style={styles.cancelText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    marginTop: 10,
    marginHorizontal: 4,
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 5,
    width: 100,
  },

  accessButton: {
    marginTop: 10,
    marginHorizontal: 4,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    width: 100,
  },

  cancelText: {
    color: "white",
    textAlign: "center",
  },

  inputMutiline: {
    color: COLOR.black,
    textAlignVertical: "top",
    marginVertical: 10,
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 10,
    backgroundColor: COLOR.white,
    // Đổ bóng
    shadowColor: "#000", // Màu đổ bóng
    shadowOffset: { width: 0, height: 5 }, // Vị trí bóng đổ
    shadowOpacity: 0.2, // Độ mờ của bóng
    shadowRadius: 3.5, // Độ lan của bóng
    elevation: 5, // Đổ bóng cho Android
  },
});

export default TenantContractDetailScreen;
