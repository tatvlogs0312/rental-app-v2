import { Button, Input } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { COLOR } from "../../../constants/COLORS";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";
import { post } from "../../../api/ApiManager";
import ConfirmPopup from "../../../components/ConfirmPopup";

const InfoTab = ({ room }) => {
  const auth = useAuth();
  const loading = useLoading();

  const [isUpdate, setIsUpdate] = useState(false);
  const [roomCode, setRoomCode] = useState(room.roomCode);
  const [status, setStatus] = useState(room.status === "EMPTY" ? "Còn trống" : "Đã cho thuê");
  const [acreage, setAcreage] = useState(room.acreage);
  const [numberOfRoom, setNumberOfRoom] = useState(room.numberOfRoom);
  const [price, setPrice] = useState(room.price);

  const [isConfirmVisible, setConfirmVisible] = useState(false);

  const handleCancel = () => {
    setIsUpdate(false);
    setConfirmVisible(false);
    setAcreage(room.acreage);
    setNumberOfRoom(room.numberOfRoom);
    setPrice(room.price);
  };

  const updateRoom = async () => {
    loading.isLoading();
    try {
      const res = post(
        "/room/update",
        {
          id: room.roomId,
          price: price,
          acreage: acreage,
          numberOfRoom: numberOfRoom,
        },
        auth.token,
      );
      setIsUpdate(false);
      setConfirmVisible(false);
    } catch (error) {
      console.log(error);
      handleCancel();
    } finally {
      loading.nonLoading();
    }
  };

  return (
    <>
      <LoadingModal modalVisible={loading.loading} />
      <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between", backgroundColor: "#fff" }}>
        <ScrollView>
          <View style={styles.viewInfo}>
            <Input
              label="Mã phòng"
              disabled={true}
              containerStyle={styles.viewInputContainer}
              style={styles.viewInput}
              labelStyle={styles.viewInputLabel}
              value={roomCode}
            />
          </View>
          <View style={styles.viewInfo}>
            <Input
              label="Trạng thái"
              disabled={true}
              containerStyle={styles.viewInputContainer}
              style={styles.viewInput}
              labelStyle={styles.viewInputLabel}
              value={status}
            />
          </View>
          <View style={styles.viewInfo}>
            <Input
              label="Diện tích"
              disabled={!isUpdate}
              containerStyle={styles.viewInputContainer}
              labelStyle={styles.viewInputLabel}
              style={styles.viewInput}
              keyboardType="numeric"
              value={String(acreage)}
              onChangeText={setAcreage}
            />
          </View>
          <View style={styles.viewInfo}>
            <Input
              label="Số phòng ngủ"
              disabled={!isUpdate}
              containerStyle={styles.viewInputContainer}
              labelStyle={styles.viewInputLabel}
              style={styles.viewInput}
              keyboardType="numeric"
              value={String(numberOfRoom)}
              onChangeText={setNumberOfRoom}
            />
          </View>
          <View style={styles.viewInfo}>
            <Input
              label="Số tiền cho thuê"
              disabled={!isUpdate}
              containerStyle={styles.viewInputContainer}
              labelStyle={styles.viewInputLabel}
              style={styles.viewInput}
              keyboardType="numeric"
              value={String(price)}
              onChangeText={setPrice}
            />
          </View>

          <View style={styles.viewInfo}>
            <View>
              <Text style={{ fontSize: 20, marginLeft: 10, marginBottom: 5 }}>Địa chỉ</Text>
            </View>
            <Input
              label="Địa chỉ chi tiết(Số nhà, ngõ, đường, ...)"
              disabled={!isUpdate}
              containerStyle={styles.viewInputContainer}
              labelStyle={styles.viewInputLabel}
              style={styles.viewInput}
              value={room.position.detail}
              // onChangeText={setPrice}
            />

            <Input
              label="Xã/Phường"
              disabled={!isUpdate}
              containerStyle={styles.viewInputContainer}
              labelStyle={styles.viewInputLabel}
              style={styles.viewInput}
              value={room.position.ward}
              // onChangeText={setPrice}
            />

            <Input
              label="Quận/Huyện"
              disabled={!isUpdate}
              containerStyle={styles.viewInputContainer}
              labelStyle={styles.viewInputLabel}
              style={styles.viewInput}
              value={room.position.district}
              // onChangeText={setPrice}
            />

            <Input
              label="Tỉnh/Thành phố"
              disabled={!isUpdate}
              containerStyle={styles.viewInputContainer}
              labelStyle={styles.viewInputLabel}
              style={styles.viewInput}
              value={room.position.province}
              onChangeText={setPrice}
            />
          </View>
        </ScrollView>
        <View>
          {isUpdate === true ? (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button containerStyle={{ width: "45%" }} title={"Hủy"} onPress={handleCancel} />
              <Button containerStyle={{ width: "45%" }} title={"Lưu"} onPress={() => setConfirmVisible(true)} />
            </View>
          ) : (
            <View>
              <Button title={"Cập nhật"} onPress={() => setIsUpdate(true)} />
            </View>
          )}
        </View>
      </View>
      <Modal transparent animationType="fade" visible={isConfirmVisible}>
        <ConfirmPopup title={"Bạn có muốn cập nhật thông tin phòng không?"} onCancel={() => setConfirmVisible(false)} onSubmit={updateRoom} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  viewInfo: {
    backgroundColor: "rgba(116, 185, 255, 0.3)",
    margin: 5,
    borderRadius: 5,
  },

  viewInputContainer: {
    paddingTop: 5,
    paddingHorizontal: 10,
  },

  viewInput: {
    color: "black",
    fontWeight: "700",
    backgroundColor: "white",
    padding: 5,
  },

  viewInputLabel: {
    color: "black",
    marginBottom: 5,
  },
});

export default InfoTab;
