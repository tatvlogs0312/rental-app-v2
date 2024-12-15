import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { get, post } from "../../../api/ApiManager";
import { COLOR } from "../../../constants/COLORS";
import LoadingModal from "react-native-loading-modal";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { IMAGE_DOMAIN } from "../../../constants/URL";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { getUUID } from "../../../utils/Utils";

const TenantWarningDetailScreen = ({ navigation, route }) => {
  const id = route.params.id;

  const auth = useAuth();
  const load = useLoading();

  const [warning, setWarning] = useState(null);

  useEffect(() => {
    if (auth.token !== "") {
      getWarning();
    }

    return () => {
      console.log("CLEAN UP");
    };
  }, [auth.token, route.params?.id]);

  const getWarning = async () => {
    try {
      load.isLoading();
      const res = await get("/rental-service/malfunction-warning/detail/" + id, {}, auth.token);
      setWarning(res);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const cancel = async () => {
    try {
      load.isLoading();
      await post("/rental-service/malfunction-warning/cancel/" + id, {}, auth.token);

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Hủy sự cố thành công",
        title: "Thông báo",
      });
      navigation.navigate("TenantWarningList", {
        refresh: getUUID(),
      });
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingModal modalVisible={load.loading} />
      <HeaderBarNoPlus title={"Quay lại"} back={() => navigation.goBack()} />
      <View style={{ flex: 1, padding: 5, margin: 5, backgroundColor: COLOR.white }}>
        {warning && (
          <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
              <View>
                <View>
                  <View>
                    <Text style={styles.label}>Sự cố:</Text>
                    <Text style={{ fontSize: 19, fontWeight: "bold" }}>{warning.title}</Text>
                  </View>

                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Chi tiết sự cố:</Text>
                    <Text>{warning.content}</Text>
                  </View>

                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Chủ trọ - Người xử lý:</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <FontAwesome6Icon name="user" solid />
                      <Text style={{ marginLeft: 5 }}>{warning.lessorFullName}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <FontAwesome6Icon name="phone" />
                      <Text style={{ marginLeft: 5 }}>{warning.lessorPhoneNumber}</Text>
                    </View>
                  </View>

                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.label}>Phòng gặp sự cố:</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <FontAwesome6Icon name="house" />
                      <Text style={{ marginLeft: 5 }}>{warning.houseName + " - " + warning.roomName}</Text>
                    </View>
                  </View>
                </View>

                <View>
                  {warning.images.length > 0 && (
                    <View style={{ marginTop: 10 }}>
                      <Text style={styles.label}>Hình ảnh sự cố:</Text>
                      <View>
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          showsVerticalScrollIndicator={false}
                          numColumns={2}
                          data={warning.images}
                          renderItem={({ item, index }) => (
                            <Pressable style={{ flex: 1, marginBottom: 10 }}>
                              <Image source={{ uri: `${IMAGE_DOMAIN}/${item}` }} style={{ width: 180, height: 150, objectFit: "cover", borderRadius: 5 }} />
                            </Pressable>
                          )}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
            <View>
              {/* Nút cập nhật */}
              {warning.status === "PENDING" && (
                <TouchableOpacity onPress={cancel}>
                  <Text style={styles.btn}>Hủy sự cố</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginVertical: 20,
    textAlign: "center",
    width: "100%",
    margin: "auto",
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLOR.primary,
    color: COLOR.white,
    fontWeight: "bold",
    fontSize: 18,
  },

  label: {
    color: COLOR.primary,
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 5,
  },
});

export default TenantWarningDetailScreen;
