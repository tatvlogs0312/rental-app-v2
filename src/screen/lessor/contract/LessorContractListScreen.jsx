import React, { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../../constants/COLORS";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { get } from "../../../api/ApiManager";
import HeaderBarPlus from "../../../components/header/HeaderBarPlus";
import LoadingModal from "react-native-loading-modal";
import { TouchableOpacity } from "react-native";
import HeaderBarSliderPlus from "../../../components/header/HeaderBarSliderPlus";

const contractStauts = [
  {
    code: "DRAFT",
    name: "Nháp",
  },

  {
    code: "PENDING_SIGNED",
    name: "Chờ ký",
  },

  {
    code: "SIGNED",
    name: "Đã ký",
  },

  {
    code: "END",
    name: "Kết thúc",
  },

  {
    code: "CANCEL",
    name: "Hủy",
  },

  {
    code: "REJECT",
    name: "Từ chối",
  },
];

const LessorContractListScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [contracts, setContracts] = useState([]);
  const [totalPage, setTotalPage] = useState(null);

  const [statusI, setStatusI] = useState(route.params?.status || 0);

  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    if (auth.token !== "") {
      getContracts(contractStauts[statusI].code);
    }
  }, [auth.token, route.params?.refresh]);

  useEffect(() => {
    setStatus(contractStauts[statusI].code);
  }, [statusI]);

  const getContracts = async (statusReq) => {
    load.isLoading();
    try {
      const response = await get(
        "/rental-service/contract/search-for-lessor",
        {
          status: statusReq,
          page: page,
          size: size,
        },
        auth.token,
      );
      setContracts(response.data);
      setTotalPage(response.totalPage);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const getMoreContracts = async () => {
    try {
      if (totalPage !== null && page + 1 < totalPage) {
        try {
          const response = await post("/rental-service/contract/search-for-lessor", { status: status, page: page + 1, size: size }, auth.token);
          const newData = response.data || [];
          setContracts([...contracts, ...newData]);
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
      <View style={{ backgroundColor: COLOR.white }}>
        <HeaderBarPlus title={"Hợp đồng"} back={() => navigation.goBack()} plus={() => navigation.navigate("LessorContractCreate")} />
        <View style={{ marginTop: 10 }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={contractStauts}
            renderItem={({ item, index }) => (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setStatusI(index);
                    getContracts(contractStauts[index].code);
                  }}
                >
                  <Text
                    style={
                      index === statusI
                        ? {
                            width: 100,
                            padding: 10,
                            borderBottomWidth: 2, // Đường viền dưới
                            borderBottomColor: COLOR.primary,
                            color: COLOR.primary, // Màu chữ của nút được chọn
                            fontWeight: "bold",
                            textAlign: "center",
                          }
                        : {
                            width: 100,
                            padding: 10,
                            textAlign: "center",
                          }
                    }
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
      <View style={{ margin: 5, flex: 1 }}>
        {contracts.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={contracts}
            keyExtractor={(item) => item.contractId}
            refreshControl={<RefreshControl refreshing={load.loading} onRefresh={() => getContracts(contractStauts[statusI].code)} />}
            onEndReached={getMoreContracts}
            onEndReachedThreshold={0}
            renderItem={({ item }) => (
              <View
                style={{
                  marginVertical: 10,
                  marginHorizontal: 5,
                  padding: 15,
                  borderRadius: 10,
                  elevation: 5,
                  backgroundColor: COLOR.white,
                  position: "relative",
                }}
              >
                <Pressable>
                  <View style={{ paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey }}>
                    <Text style={{ fontSize: 17, marginBottom: 5 }}>
                      {/* <Text style={{ color: COLOR.grey }}>Mã hợp đồng: </Text> */}
                      <Text style={{ color: COLOR.primary, fontWeight: "bold" }}>{item.contractCode}</Text>
                    </Text>
                    <Text style={{ color: COLOR.grey }}>
                      <FontAwesome6 name="house" />
                      {" " + item.houseName + " - " + item.roomName}
                    </Text>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: "row", marginBottom: 5 }}>
                      <View style={{ marginRight: 15 }}>
                        <Text>
                          <FontAwesome6 name="user" solid />
                          {" " + item.tenantFirstName + " " + item.tenantLastName}
                        </Text>
                      </View>
                      <View>
                        <Text>
                          <FontAwesome6 name="phone" />
                          {" " + item.tenantPhoneNumber}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ color: COLOR.black }}>
                      <FontAwesome6 name="clock" />
                      {" " + item.createdDate}
                    </Text>
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
                          <FontAwesome6 name="tag" size={15} />
                          {"  " + item.contractStatusName}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          navigation.navigate("LessorContractDetail", {
                            contractId: item.contractId,
                          });
                        }}
                      >
                        <Text style={{ color: COLOR.primary }}>
                          {"Chi tiết  "}
                          <FontAwesome6 name="angle-right" />
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default LessorContractListScreen;
