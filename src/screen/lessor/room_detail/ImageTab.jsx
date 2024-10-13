import { Button, Icon } from "@rneui/themed";
import React, { useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DOMAIN, IMAGE_DOMAIN } from "../../../constants/URL";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { COLOR } from "../../../constants/COLORS";
import LoadingModal from "react-native-loading-modal";
import { post } from "../../../api/ApiManager";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ImageTab = ({ room }) => {
  const auth = useAuth();
  const loading = useLoading();

  const [images, setImages] = useState([...room.image]);
  const [imageUpload, setImageUpload] = useState(null);
  const [isVisiable, setIsVisiable] = useState(false);

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [6, 4],
    });

    console.log("====================================");
    console.log(result);
    console.log("====================================");

    if (result.assets !== null) {
      setImageUpload(result.assets[0]);
      setIsVisiable(true);
    }
  };

  const handleUpload = async () => {
    loading.isLoading();
    const formData = new FormData();
    formData.append("image", {
      uri: imageUpload.uri,
      type: "image/jpeg", // hoặc định dạng phù hợp với ảnh của bạn
      name: "photo.jpg",
    });
    formData.append("roomId", room.roomId);

    try {
      const response = await axios.post(DOMAIN + "/room-image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: auth.token,
        },
      });
      console.log("Upload success:", response.data);
      setIsVisiable(false);
      setImages([...images, response.data]); // Tải lại danh sách ảnh sau khi upload thành công
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");

      Toast.show({
        type: ALERT_TYPE.DANGER,
        textBody: error.response.message,
        title: "Lỗi",
      });
    } finally {
      loading.nonLoading();
    }
  };

  const deleteImage = async (fileName) => {
    loading.isLoading();
    try {
      const response = await post(
        "/room-image/delete",
        {
          fileName: fileName,
        },
        auth.token,
      );
      console.log("====================================");
      console.log(response);
      console.log("====================================");

      setImages(images.filter((x) => x !== fileName));
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
    loading.nonLoading();
  };

  return (
    <>
      <LoadingModal modalVisible={loading.loading} />
      <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between", backgroundColor: "#fff" }}>
        <ScrollView>
          {images.map((item, index) => (
            <View style={{ position: "relative" }} key={index}>
              <Image
                source={{
                  uri: IMAGE_DOMAIN + "/" + item,
                }}
                style={{
                  height: 300,
                  borderRadius: 10,
                  objectFit: "cover",
                  margin: 5,
                }}
              />
              <Pressable
                style={{
                  borderRadius: 25,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  width: 25,
                  height: 25,
                  position: "absolute",
                  top: 13,
                  right: 13,
                }}
                onPress={() => deleteImage(item)}
              >
                <Text style={{ margin: "auto", fontWeight: "600", color: "white" }}>X</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        <View>
          <Button title={"Thêm ảnh"} onPress={selectImage} />
        </View>
      </View>

      <Modal visible={isVisiable} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {imageUpload && <Image source={{ uri: imageUpload.uri }} style={styles.previewImage} />}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  setIsVisiable(false);
                  setImageUpload(null);
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.accessButton} onPress={handleUpload}>
                <Text style={styles.cancelText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  previewImage: {
    width: 300,
    height: 200,
    marginBottom: 20,
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

export default ImageTab;
