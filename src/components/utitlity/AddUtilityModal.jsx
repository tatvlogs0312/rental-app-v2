import { Input } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { post } from "../../api/ApiManager";
import { useAuth } from "../../hook/AuthProvider";
import { useLoading } from "../../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";

const AddUtilityModal = ({ roomId, onsubmit, onCancel }) => {
  const auth = useAuth();
  const loading = useLoading();

  const [utitlity, setUtitlity] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState(0);
  const [utilities, setUtilities] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await post("/utility/search", {}, null);
        setUtilities(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const addUtility = async () => {
    loading.isLoading();
    try {
      console.log(utitlity);

      const res = await post("/room-utility/add", { roomId: roomId, utilityId: utitlity, price: price, unit: type }, auth.token);
      onsubmit(res);
    } catch (error) {
      console.log(error);
    }
    loading.nonLoading();
  };

  return (
    <>
      <LoadingModal modalVisible={loading.loading} />
      <View style={{ padding: 20, backgroundColor: "white" }}>
        <View>
          <Text style={{ textAlign: "center", marginBottom: 10, fontSize: 20, color: "blue" }}>Thêm dịch vụ</Text>
        </View>
        <View>
          {utilities && (
            <View>
              <SelectList
                setSelected={(val) => {
                  setUtitlity(val);
                }}
                data={utilities.map(({ id, name }) => ({ key: id, value: name }))}
                save="key"
                placeholder="Loại dịch vụ"
              />
              <TextInput
                style={{ borderWidth: 1, height: 50, paddingVertical: 5, paddingHorizontal: 20, marginVertical: 10, borderRadius: 10 }}
                placeholder="Đơn giá"
                inputMode="numeric"
                value={String(price)}
                onChangeText={(val) => setPrice(val)}
              />
              <SelectList
                setSelected={(val) => setType(val)}
                data={[
                  { key: 1, value: "Người" },
                  { key: 2, value: "Phòng" },
                  { key: 3, value: "Số" },
                  { key: 4, value: "Khối" },
                ]}
                save="value"
                placeholder="Đơn vị tính"
              />
            </View>
          )}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.accessButton} onPress={addUtility}>
              <Text style={styles.cancelText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
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
});

export default AddUtilityModal;
