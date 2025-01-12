import React, { useEffect, useState } from "react";
import { Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hook/AuthProvider";
import { useLoading } from "../../hook/LoadingProvider";
import { get, post } from "../../api/ApiManager";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { DOMAIN, IMAGE_DOMAIN } from "../../constants/URL";
import { convertDate } from "./../../utils/Utils";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import LoadingModal from "react-native-loading-modal";
import { COLOR } from "./../../constants/COLORS";
import DateTimePicker from "@react-native-community/datetimepicker";

const UserInfomationScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [user, setUser] = useState(auth.info);

  const [birthDate, setBirthDate] = useState(auth.info.birthDate);
  const [gender, setGender] = useState(auth.info.gender);
  const [identityNumber, setIdentityNumber] = useState(auth.info.identityNumber);
  const [phoneNumber, setPhoneNumber] = useState(auth.info.phoneNumber);
  const [email, setEmail] = useState(auth.info.email);

  const [modalVisible, setModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [numberModalVisible, setNumberModalVisible] = useState(false);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (auth.token !== "") {
      // getUser();
    }
  }, [auth.token]);

  const getUser = async () => {
    try {
      const data = await get("/rental-service/user-profile/get-information", null, auth.token);
      auth.setInfoApp(data);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.assets !== null) {
      const file = result.assets[0];
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: "image/jpeg", // hoặc định dạng phù hợp với ảnh của bạn
        name: "photo.jpg",
      });
      load.isLoading();
      axios
        .post(DOMAIN + "/rental-service/user-profile/upload-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: auth.token,
          },
        })
        .then(async (res) => {
          await getUser();
        })
        .catch((err) => console.log(JSON.stringify(err)))
        .finally(() => {
          load.nonLoading();
        });
    }
  };

  const updateGender = async (gender) => {
    setGender(gender);
    setModalVisible(false);
    await updateInfo();
  };

  const updateInfo = async () => {
    try {
      load.isLoading();
      await post(
        "/rental-service/user-profile/update-information",
        {
          gender: gender,
          phoneNumber: phoneNumber,
          email: email,
        },
        auth.token,
      );

      await getUser();
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const updateBirthDate = async (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    await updateInfo();
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingModal modalVisible={load.loading} />
      {user !== null && (
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome6Icon name="angle-left" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Avatar Section */}
          <TouchableOpacity style={styles.avatarSection} onPress={uploadAvatar}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: `${IMAGE_DOMAIN}/${user.avatar}` }} style={styles.avatar} />
              <View style={styles.cameraIcon}>
                <FontAwesome6Icon name="camera" size={20} color="#fff" />
              </View>
            </View>
            <Text style={styles.avatarText}>Thay đổi ảnh</Text>
          </TouchableOpacity>

          {/* Profile Fields */}
          <View style={styles.section}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Họ</Text>
              <TouchableOpacity>
                <Text style={styles.fieldValue}>{user.firstName}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Tên</Text>
              <View>
                <Text style={styles.fieldValue}>{user.lastName}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.field} onPress={() => setShow(false)}>
              <Text style={styles.fieldLabel}>Ngày sinh</Text>
              <View>
                <Text style={styles.fieldValue}>{convertDate(birthDate, "DD/MM/YYYY")}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.field} onPress={() => setModalVisible(false)}>
              <Text style={styles.fieldLabel}>Giới tính</Text>
              <View>
                <Text style={styles.fieldValue}>{gender || ""}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.field} onPress={() => setNumberModalVisible(true)}>
              <Text style={styles.fieldLabel}>Số điện thoại</Text>
              <View>
                <Text style={styles.fieldValue}>{user.phoneNumber}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.field} onPress={() => setEmailModalVisible(true)}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View>
                <Text style={styles.fieldValue}>{user.email}</Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.field}>
              <Text style={styles.fieldLabel}>Số CMND/CCCD</Text>
              <View>
                <Text style={styles.fieldValue}>{user.identityNumber || ""}</Text>
              </View>
            </TouchableOpacity> */}
          </View>

          {/* <View style={styles.section}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Liên kết</Text>
              <TouchableOpacity>
                <Text style={styles.fieldPlaceholder}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </ScrollView>
      )}

      <Modal visible={show} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ alignItems: "center", width: "100%" }}>
              <Text style={styles.modalTitle}>Chọn ngày sinh</Text>
              <DateTimePicker
                value={birthDate === null ? new Date() : new Date(birthDate)}
                mode="date" // 'date', 'time', hoặc 'datetime'
                display="inline" // 'default', 'spinner', 'calendar', hoặc 'clock'
                onChange={updateBirthDate}
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <TouchableOpacity onPress={() => setShow(false)}>
                <Text style={{ color: COLOR.red }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ alignItems: "center", width: "100%" }}>
              <Text style={styles.modalTitle}>Chọn giới tính</Text>
              <TouchableOpacity style={{ width: "100%" }} onPress={() => updateGender("Nam")}>
                <Text style={{ paddingVertical: 10, fontSize: 16 }}>Nam</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: "100%" }} onPress={() => updateGender("Nữ")}>
                <Text style={{ paddingVertical: 10, fontSize: 16 }}>Nữ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: "100%" }} onPress={() => updateGender("Khác")}>
                <Text style={{ paddingVertical: 10, fontSize: 16 }}>Khác</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: COLOR.red }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={emailModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ alignItems: "center", width: "100%" }}>
              <Text style={styles.modalTitle}>Cập nhật email</Text>
              <TextInput style={{ width: "100%", padding: 2, borderBottomWidth: 0.5, marginVertical: 10 }} value={email} onChangeText={setEmail} />
            </View>

            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEmail(auth.info.email);
                  setEmailModalVisible(false);
                }}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accessButton} onPress={updateInfo}>
                <Text style={styles.cancelText}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={numberModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ alignItems: "center", width: "100%" }}>
              <Text style={styles.modalTitle}>Cập nhật số điện thoại</Text>
              <TextInput
                style={{ width: "100%", padding: 2, borderBottomWidth: 0.5, marginVertical: 10 }}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setPhoneNumber(auth.info.phoneNumber);
                  setNumberModalVisible(false);
                }}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accessButton} onPress={updateInfo}>
                <Text style={styles.cancelText}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    borderRadius: 15,
    padding: 5,
  },
  avatarText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  section: {
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
  },
  field: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  fieldLabel: {
    fontSize: 16,
    color: "#333",
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  fieldLink: {
    fontSize: 14,
    color: "#666",
  },
  fieldPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

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

export default UserInfomationScreen;
