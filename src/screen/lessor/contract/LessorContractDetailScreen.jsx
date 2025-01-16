import React, { useEffect } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { COLOR } from "../../../constants/COLORS";
import { useState } from "react";
import { get, post } from "../../../api/ApiManager";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { TouchableOpacity } from "react-native";
import LoadingModal from "react-native-loading-modal";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { convertDate, ConvertMoneyV3, getUUID } from "../../../utils/Utils";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { Calendar } from "react-native-calendars";

const LessorContractDetailScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const contractId = route.params?.contractId;

  const [contract, setContract] = useState(null);

  const [dateEnd, setDateEnd] = useState(null);
  const [dateEndMsg, setDateEndMsg] = useState(null);

  const [endVisiable, setEndVisiable] = useState(false);
  const [dateVisiable, setDateVisiable] = useState(false);

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

  const sendUser = async () => {
    try {
      load.isLoading();
      const res = await post("/rental-service/contract/send-user/" + contractId, {}, auth.token);

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Gửi ký hợp đồng thành công",
        title: "Thông báo",
      });

      navigation.navigate("LessorContractList", {
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
      const res = await post(
        "/rental-service/contract/cancel",
        {
          id: contractId,
        },
        auth.token,
      );

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Hủy hợp đồng thành công",
        title: "Thông báo",
      });

      navigation.navigate("LessorContractList", {
        refresh: getUUID(),
      });
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const handleInputEnd = () => {
    let isValid = true;
    if (dateEnd === null || dateEnd === "") {
      setDateEndMsg("Vui lòng chọn ngày trả phòng");
      isValid = false;
    }

    return isValid;
  };

  const requestEnd = async () => {
    if (handleInputEnd()) {
      try {
        load.isLoading();
        await post(
          "/rental-service/contract/end-contract",
          {
            contractId: contractId,
            endDate: dateEnd,
          },
          auth.token,
        );

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          textBody: "Kết thúc hợp đồng thành công",
          title: "Thông báo",
        });

        navigation.navigate("LessorContractList", {
          refresh: getUUID(),
        });
      } catch (error) {
        console.log(error);
      } finally {
        load.nonLoading();
        setEndVisiable(false);
        setReason(null);
        setDateEnd(null);
      }
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
                {contract.contractStatusCode === "END" && (
                  <View
                    style={{
                      paddingHorizontal: 5,
                      paddingVertical: 10,
                      backgroundColor: "rgba(220, 221, 134, 0.5)",
                      borderRadius: 10,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ marginHorizontal: 10 }}>
                      <FontAwesome6Icon name="triangle-exclamation" color={COLOR.orange} light size={20} />
                    </View>
                    <View>
                      <Text style={{ color: COLOR.orange }}>Hợp đồng đã kết thúc</Text>
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
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Mã hợp đồng:"} value={contract.contractCode} />
                    </View>
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Thời gian tạo:"} value={contract.createdTime} />
                    </View>
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Ngày hiệu lực:"} value={contract.startDate} />
                    </View>
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
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
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Tiền phòng hàng tháng:"} value={ConvertMoneyV3(contract.price)} />
                    </View>
                    {contract.utilities.map((item, index) => (
                      <View
                        style={
                          index === contract.utilities.length - 1
                            ? { borderColor: COLOR.grey, marginHorizontal: 15 }
                            : { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }
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
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
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
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
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
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Nhà:"} value={contract.houseName} />
                    </View>
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Phòng:"} value={contract.roomName} />
                    </View>
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Địa chỉ:"} value={contract.position.detail} />
                    </View>
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Xã/Phường:"} value={contract.position.ward} />
                    </View>
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                      <Row title={"Quận/Huyện:"} value={contract.position.district} />
                    </View>
                    <View style={{ marginHorizontal: 15 }}>
                      <Row title={"Tỉnh/Thành phố:"} value={contract.position.province} />
                    </View>
                  </View>
                </View>
              </View>

              {contract.contractStatusCode === "DRAFT" && (
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <TouchableOpacity style={{ width: "49%", backgroundColor: COLOR.primary, borderRadius: 10 }} onPress={cancel}>
                    <Text style={{ textAlign: "center", padding: 15, color: COLOR.white, fontWeight: "bold" }}>Hủy hợp đồng</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ width: "49%", backgroundColor: COLOR.primary, borderRadius: 10 }} onPress={sendUser}>
                    <Text style={{ textAlign: "center", padding: 15, color: COLOR.white, fontWeight: "bold" }}>Gửi khách thuê ký</Text>
                  </TouchableOpacity>
                </View>
              )}

              {contract.contractStatusCode === "PENDING_SIGNED" && (
                <View style={{ marginVertical: 10 }}>
                  <TouchableOpacity style={{ backgroundColor: COLOR.primary, borderRadius: 10 }} onPress={sendUser}>
                    <Text style={{ textAlign: "center", padding: 15, color: COLOR.white, fontWeight: "bold" }}>Gửi lại khách thuê ký</Text>
                  </TouchableOpacity>
                </View>
              )}

              {contract.contractStatusCode === "SIGNED" && (
                <View style={{ marginVertical: 10 }}>
                  <TouchableOpacity style={{ backgroundColor: COLOR.primary, borderRadius: 10 }} onPress={() => setEndVisiable(true)}>
                    <Text style={{ textAlign: "center", padding: 15, color: COLOR.white, fontWeight: "bold" }}>Kết thúc hợp đồng</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={endVisiable} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", backgroundColor: "white", borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Kết thúc hợp đồng</Text>
            <View>
              <Text style={{ color: COLOR.primary, fontWeight: "bold", fontSize: 15 }}>* Ngày trả phòng:</Text>
              <Pressable onPress={() => setDateVisiable(true)} style={{ zIndex: 10 }}>
                <TextInput placeholder="Chọn ngày trả phòng" readOnly style={styles.input} value={convertDate(dateEnd, "DD/MM/YYYY")} />
                {(dateEndMsg !== "" || dateEndMsg !== null) && <Text style={{ color: COLOR.red, fontSize: 13 }}>{dateEndMsg}</Text>}
              </Pressable>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEndVisiable(false);
                  setDateEndMsg(null);
                }}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accessButton} onPress={requestEnd}>
                <Text style={styles.cancelText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={dateVisiable} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", backgroundColor: "white", borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Chọn ngày hiệu lực:</Text>
            <View>
              <Calendar
                onDayPress={(day) => {
                  setDateEnd(day.dateString);
                  setDateEndMsg(null);
                  setDateVisiable(false);
                }}
              />
            </View>
            <TouchableOpacity onPress={() => setDateVisiable(false)} style={{ padding: 10, marginTop: 10 }}>
              <Text style={{ color: "red", textAlign: "center" }}>Đóng</Text>
            </TouchableOpacity>
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

  input: {
    color: COLOR.black,
    marginVertical: 10,
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

export default LessorContractDetailScreen;
