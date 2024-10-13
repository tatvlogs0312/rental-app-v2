import { Button } from "@rneui/themed";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import AddUtilityModal from "../../../components/utitlity/AddUtilityModal";
import { Row, Table } from "react-native-reanimated-table";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { post } from "../../../api/ApiManager";
import LoadingModal from "react-native-loading-modal";

const UtilityTab = ({ room }) => {
  const auth = useAuth();
  const loading = useLoading();

  const [utilities, setUtilities] = useState(room.utility);
  const [isVisiable, setIsVisiable] = useState(false);

  const deleteU = async (id) => {
    loading.isLoading();
    try {
      const res = await post("/room-utility/inactive", { id: id }, auth.token);
      setUtilities(utilities.filter((x) => x.utilityId !== id));
    } catch (error) {
      console.log(error);
    }
    loading.nonLoading();
  };

  return (
    <>
      <LoadingModal modalVisible={loading.loading} />
      <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between", backgroundColor: "#fff" }}>
        <View style={{ padding: 16, paddingTop: 30, backgroundColor: "#fff" }}>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row data={["STT", "Tên dịch vụ", "Đơn giá", ""]} style={styles.head} textStyle={styles.text} widthArr={[40, 80, 180, 80]} />
            {utilities.map((u, i) => (
              <Row
                key={i}
                data={[
                  i + 1,
                  u.utilityName,
                  u.utilityPrice + "/" + u.utilityUnit,
                  <Pressable onPress={() => deleteU(u.utilityId)}>
                    <Text style={{ textAlign: "center" }}>Xóa</Text>
                  </Pressable>,
                ]}
                style={{ height: 35 }}
                textStyle={styles.text}
                widthArr={[40, 80, 180, 80]}
              />
            ))}
          </Table>
        </View>
        <View>
          <Button title={"Thêm dịch vụ"} onPress={() => setIsVisiable(true)} />
        </View>
      </View>

      <Modal visible={isVisiable} transparent animationType="slide">
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", flex: 1 }}>
          <AddUtilityModal
            roomId={room.roomId}
            onCancel={() => setIsVisiable(false)}
            onsubmit={(newU) => {
              console.log(newU);
              setIsVisiable(false);
              setUtilities([...utilities, newU]);
            }}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 50, backgroundColor: "#f1f8ff" },
  text: { textAlign: "center" },
});

export default UtilityTab;
