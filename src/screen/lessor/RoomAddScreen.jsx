import { Input } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { post } from "../../api/ApiManager";
import { dropdownStyle } from "../../css/CssCustom";
import { useAuth } from "../../hook/AuthProvider";
import { useLoading } from "../../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";
import ConfirmPopup from "../../components/ConfirmPopup";

const RoomAddScreen = ({ navigation }) => {
  const auth = useAuth();
  const loading = useLoading();

  const [roomTypes, setRoomTypes] = useState([]);

  const [roomType, setRoomType] = useState(null);
  const [price, setPrice] = useState(null);
  const [number, setNumber] = useState(null);
  const [acreage, setAcreage] = useState(null);
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [detail, setDetail] = useState("");

  const [isConfirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await post("/room-type/search", {}, null);
        setRoomTypes(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const addRoom = async () => {
    loading.isLoading();
    try {
      const res = await post(
        "/room/create",
        {
          roomTypeId: roomType,
          price: Number(price),
          acreage: Number(acreage),
          numberOfRoom: Number(number),
          province: province,
          district: district,
          ward: ward,
          positionDetail: detail,
        },
        auth.token,
      );

      if (res) {
        navigation.navigate("Room");
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.nonLoading();
      setConfirmVisible(false);
    }
  };

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <LoadingModal modalVisible={loading.loading} />
      <KeyboardAvoidingView style={{ height: "100%", justifyContent: "space-between" }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView>
          <View>
            <Text style={{ textAlign: "center", marginTop: 10, fontSize: 20, color: "blue" }}>Thêm phòng</Text>
          </View>
          <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
            <SelectList
              placeholder="Loại phòng"
              data={roomTypes.map(({ id, name }) => ({ key: id, value: name }))}
              save="key"
              setSelected={(val) => setRoomType(val)}
              boxStyles={{ marginBottom: 20 }}
              inputStyles={{}}
              dropdownStyles={dropdownStyle}
            />
            <Input label="Giá cho thuê" keyboardType="numeric" value={price} onChangeText={setPrice} />
            <Input label="Diện tích phòng(m2)" keyboardType="numeric" value={acreage} onChangeText={setAcreage} />
            <Input label="Số phòng" keyboardType="numeric" value={number} onChangeText={setNumber} />
            <Input label="Tỉnh/Thành phố" value={province} onChangeText={setProvince} />
            <Input label="Quận/Huyện" value={district} onChangeText={setDistrict} />
            <Input label="Phường/Xã" value={ward} onChangeText={setWard} />
            <Input label="Số nhà, ngõ, đường,..." value={detail} onChangeText={setDetail} />
          </View>
        </ScrollView>
        <View>
          <Pressable onPress={() => setConfirmVisible(true)}>
            <Text style={{ width: "100%", lineHeight: 50, backgroundColor: "blue", textAlign: "center", color: "white", fontSize: 20 }}>Thêm</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <Modal transparent animationType="fade" visible={isConfirmVisible}>
        <ConfirmPopup title={"Bạn có muốn thêm phòng không?"} onCancel={() => setConfirmVisible(false)} onSubmit={addRoom} />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default RoomAddScreen;
