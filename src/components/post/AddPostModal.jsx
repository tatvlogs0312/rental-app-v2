import { Input } from "@rneui/themed";
import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../../hook/AuthProvider";
import { useLoading } from "../../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";
import { post } from "../../api/ApiManager";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const AddPostModal = ({ roomId, onCancel, onSubmit }) => {
  const auth = useAuth();
  const load = useLoading();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addPost = async () => {
    load.isLoading();
    try {
      const res = await post(
        "/post/create",
        {
          roomId: roomId,
          title: title,
          content: content,
        },
        auth.token,
      );
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Đăng bài thành công",
        title: "Thông báo",
      });

      onSubmit();
    } catch (error) {
      console.log(error);
    }
    load.nonLoading();
  };

  return (
    <View>
      <LoadingModal modalVisible={load.isLoading} />
      <View>
        <Text style={{ textAlign: "center", marginBottom: 20, fontSize: 25 }}>Đăng bài</Text>
      </View>
      <View>
        <Input label="Tiêu đề" onChangeText={setTitle} value={title} />
        <Input label="Nội dung" onChangeText={setContent} value={content} multiline inputStyle={{ minHeight: 200, textAlignVertical: "top" }} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accessButton} onPress={addPost}>
          <Text style={styles.cancelText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
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
});

export default AddPostModal;
