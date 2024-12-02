import React, { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../../constants/COLORS";
import { get, post } from "../../../api/ApiManager";
import LoadingModal from "react-native-loading-modal";
import { TouchableOpacity } from "react-native";
import { ConvertMoneyV3, getUUID } from "../../../utils/Utils";
import { CheckBox } from "@rneui/base";
import { MonthList } from "../../../constants/Month";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const LessorBillCreateScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [contracts, setContracts] = useState([]);
  const [contract, setContract] = useState(null);
  const [room, setRoom] = useState(null);

  const [utilities, setUtilities] = useState([]);

  const [contractVisiable, setContractVisiable] = useState(false);
  const [monthVisiable, setMonthVisiable] = useState(false);

  const [isContinue, setIsContinue] = useState(true);

  useEffect(() => {
    if (auth.token !== "") {
      getContracts();
    }
  }, [auth.token]);

  const getContracts = async () => {
    load.isLoading();
    try {
      const response = await get(
        "/rental-service/contract/search-for-lessor",
        {
          status: "SIGNED",
          page: 0,
          size: 10000,
        },
        auth.token,
      );
      setContracts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const getUtility = async (contractId) => {
    try {
      load.isLoading();
      const res = await get("/rental-service/contract/utility/" + contractId, {}, auth.token);
      setUtilities(res);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const createBill = async () => {
    try {
      load.isLoading();
      const res = await post(
        "/rental-service/bill/create",
        {
          contractId: contract.contractId,
          month: month,
          year: year,
          isRentContinue: isContinue,
          details: utilities.map((u) => ({
            utilityId: u.utilityId,
            numberUsed: u.numberUsed,
          })),
        },
        auth.token,
      );

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Tạo hóa đơn thành công",
        title: "Thông báo",
      });

      navigation.navigate("LessorBillList", {
        refresh: getUUID(),
      });
    } catch (error) {
      setUtilities(res);
    } finally {
      load.nonLoading();
    }
  };

  const updateQuantity = (id, type) => {
    setUtilities((prevItems) =>
      prevItems.map((item) =>
        item.utilityId === id
          ? {
              ...item,
              numberUsed: type === "increment" ? Number(item.numberUsed) + 1 : Math.max(Number(item.numberUsed) - 1, 0),
            }
          : item,
      ),
    );
  };

  const enterQuantity = (id, number) => {
    const quantity = parseInt(number) || 0;
    setUtilities((prevItems) =>
      prevItems.map((item) =>
        item.utilityId === id
          ? {
              ...item,
              numberUsed: quantity,
            }
          : item,
      ),
    );
  };

  const getTotal = () => {
    let billTotal = utilities.reduce((total, item) => total + item.utilityPrice * item.numberUsed, 0);
    if (isContinue === true) {
      billTotal += Number(contract.contractPrice);
    }
    return billTotal;
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
        <View style={{ flex: 1 }}>
          <HeaderBarNoPlus title={"Tạo hóa đơn"} back={() => navigation.goBack()} />
          <View style={{ margin: 10, marginTop: 10, backgroundColor: COLOR.white, borderRadius: 10 }}>
            <View style={{ margin: 5 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
                <View style={{ width: "49%" }}>
                  <Text style={styles.inputTitle}>Tháng đóng:</Text>
                  <Pressable onPress={() => setMonthVisiable(true)} style={{ zIndex: 10 }}>
                    <TextInput placeholder="Chọn tháng" readOnly style={styles.input} value={month.toString()} />
                  </Pressable>
                </View>

                <View style={{ width: "49%" }}>
                  <Text style={styles.inputTitle}>Năm đóng:</Text>
                  <TextInput placeholder="Nhập năm" style={styles.input} keyboardType="number-pad" onChangeText={(t) => setYear(t)} value={String(year)} />
                </View>
              </View>

              <Pressable onPress={() => setContractVisiable(true)} style={{ marginTop: 10 }}>
                <Text style={styles.inputTitle}>Phòng:</Text>
                <TextInput placeholder="Chọn phòng" readOnly style={styles.searchInput} value={room} />
              </Pressable>
            </View>
          </View>
          <View style={{ margin: 5, padding: 5, flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {contract !== null && (
                <View>
                  <View style={{ backgroundColor: COLOR.white, padding: 5, marginBottom: 10, borderRadius: 10 }}>
                    <Text style={{ marginBottom: 10, fontSize: 16, color: COLOR.primary, fontWeight: "bold" }}>Thông tin khách thuê</Text>
                    <View style={{ borderColor: COLOR.grey, borderRadius: 10, borderWidth: 0.5 }}>
                      <View style={{ borderBottomWidth: 0.5, borderColor: COLOR.grey, marginHorizontal: 15 }}>
                        <Row title={"Khách thuê:"} value={contract.tenantFirstName + " " + contract.tenantLastName} />
                      </View>
                      <View style={{ borderColor: COLOR.grey, marginHorizontal: 15 }}>
                        <Row title={"Số điện thoại:"} value={String(contract.tenantPhoneNumber)} />
                      </View>
                    </View>
                  </View>

                  <View style={{ backgroundColor: COLOR.white, padding: 5, borderRadius: 10 }}>
                    <Text style={{ marginBottom: 10, fontSize: 16, color: COLOR.primary, fontWeight: "bold" }}>Hóa đơn</Text>
                    <FlatList
                      data={utilities}
                      keyExtractor={(item) => item.utilityId}
                      renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                          <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.utilityName}</Text>
                            <Text style={styles.itemPrice}>{ConvertMoneyV3(item.utilityPrice) + "/" + item.utilityUnit}</Text>
                          </View>

                          <View style={styles.quantityContainer}>
                            <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.utilityId, "decrement")}>
                              <Text style={styles.quantityText}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                              value={item.numberUsed.toString()}
                              style={styles.quantityInput}
                              keyboardType="numeric"
                              onChangeText={(t) => enterQuantity(item.utilityId, t)}
                            />
                            <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.utilityId, "increment")}>
                              <Text style={styles.quantityText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    />

                    <View style={styles.extraServiceContainer}>
                      <View>
                        <Text style={styles.extraServiceText}>Tiếp tục thuê trọ:</Text>
                        <Text style={{}}>({ConvertMoneyV3(contract.contractPrice)})</Text>
                      </View>
                      <CheckBox checked={isContinue} onPress={() => setIsContinue(!isContinue)} />
                    </View>

                    <View style={styles.totalContainer}>
                      <Text style={styles.totalText}>
                        Tổng: <Text style={{ color: COLOR.blue }}>{ConvertMoneyV3(getTotal())}</Text>
                      </Text>
                    </View>
                  </View>

                  <View style={{ padding: 10 }}>
                    <TouchableOpacity onPress={createBill }>
                      <Text style={styles.btn}>Tạo hóa đơn</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>

      <Modal visible={contractVisiable} animationType="slide">
        <View style={{ padding: 10, flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Chọn phòng</Text>
            <Pressable
              style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center", borderRadius: 10 }}
              onPress={() => setContractVisiable(false)}
            >
              <FontAwesome6Icon name="x" color={COLOR.red} size={20} />
            </Pressable>
          </View>
          <View style={{ flex: 1, marginTop: 10 }}>
            <FlatList
              data={contracts}
              renderItem={({ item }) => (
                <View>
                  <Pressable
                    onPress={() => {
                      setContract(item);
                      getUtility(item.contractId);
                      setContractVisiable(false);
                      setRoom(`${item.houseName} - ${item.roomName}`);
                    }}
                  >
                    <View style={{ borderBottomWidth: 0.5, paddingHorizontal: 10, paddingVertical: 15, borderColor: COLOR.grey }}>
                      <Text style={{ fontSize: 16 }}>{`${item.houseName} - ${item.roomName}`}</Text>
                    </View>
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

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
  searchInput: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    color: COLOR.black,
    fontWeight: "bold",
    borderWidth: 0.5,
  },

  input: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 0.5,
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

  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 18,
    color: "#333333",
  },
  quantityNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },

  quantityInput: {
    width: 40,
    height: 30,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginHorizontal: 5,
    borderRadius: 5,
    fontSize: 16,
    color: "#333333",
  },

  extraServiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: "#E0E0E0",
  },
  extraServiceText: {
    fontSize: 16,
    color: "#333333",
  },

  totalContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    color: "#333333",
  },

  btn: {
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLOR.primary,
    color: COLOR.white,
    fontWeight: "bold",
    fontSize: 17,
  },
});

export default LessorBillCreateScreen;
