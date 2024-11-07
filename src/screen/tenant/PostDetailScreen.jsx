import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, Dimensions, StatusBar, StyleSheet, Text, View, ScrollView, Modal } from "react-native";
import { DOMAIN, IMAGE_DOMAIN } from "../../constants/URL";
import { ConvertToMoney } from "../../utils/Utils";
import { Button } from "@rneui/base";
import { useAuth } from "../../hook/AuthProvider";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Input } from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import { post } from "../../api/ApiManager";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import messaging from '@react-native-firebase/messaging';

const PostDetailScreen = ({ navigation, route }) => {
  const auth = useAuth();

  const [postData, setPostData] = useState(null);
  const [images, setImages] = useState([]);

  const [time, setTime] = useState("");

  const [dateTimeVisiable, setDateTimeVisiable] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  
  useEffect(() => {
    axios
      .get(DOMAIN + "/post/" + route.params.id, {
        headers: {
          Authorization: auth.token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setPostData(res.data);
        setImages(res.data.image);
      })
      .catch((err) => console.log(err));
  }, []);

  const bookRoom = async () => {
    try {
      const res = await post("/book/create", { roomId: postData.roomId, dateWatch: time }, auth.token);
      setDateTimeVisiable(false);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Đặt lịch xem phòng thành công",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    postData && (
      <SafeAreaView
        style={{
          marginHorizontal: 10,
          marginTop: 20,
          marginBottom: 10,
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          height: windowHeight,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={images}
              keyExtractor={(post) => post}
              key={(i) => i}
              renderItem={({ index, item }) => (
                <Image
                  key={index}
                  source={{
                    uri: IMAGE_DOMAIN + "/" + item,
                  }}
                  style={{
                    width: windowWidth - 20,
                    height: 300,
                    borderRadius: 10,
                    objectFit: "cover",
                    padding: 20,
                    backgroundColor: "grey",
                    // marginHorizontal: 10,
                    marginRight: index === images.length - 1 ? 0 : 10,
                  }}
                />
              )}
            />

            <View style={styles.info}>
              <Text style={{ fontSize: 22, fontWeight: "600" }}>{postData.title}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>Mô tả</Text>
              <Text>{postData.content}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>Thông tin phòng</Text>
              <Text>{"Diện tích: " + postData.acreage + "m2"}</Text>
              <Text>{"Số phòng: " + postData.numberOfRoom}</Text>
              <Text>{"Giá cho thuê: " + ConvertToMoney(postData.price)}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>Địa chỉ</Text>
              <Text>{postData.position.detail + " - " + postData.position.ward + " - " + postData.position.district + " - " + postData.position.province}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>Dịch vụ</Text>
              {postData.utility.map((item) => (
                <View>
                  <Text>{item.utilityName + ": " + ConvertToMoney(item.utilityPrice) + "/" + item.utilityUnit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>Liên hệ</Text>
              <Text>{"Chủ trọ: " + postData.lessorName}</Text>
              <Text>{"Số điện thoại liên hệ: " + postData.lessorNumber}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 5 }}>
          <Button title={"Liên hệ"} containerStyle={{ width: 200, marginHorizontal: 5, borderRadius: 20 }} size="lg" />
          <Button
            title={"Đặt xem"}
            containerStyle={{ width: 200, marginHorizontal: 5, borderRadius: 20 }}
            size="lg"
            onPress={() => setDateTimeVisiable(true)}
          />
        </View>

        <Modal transparent animationType="slide" visible={dateTimeVisiable}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Input label="Thời gian xem phòng" placeholder="Định dạng HH:MM DD/MM/YYYY" onChangeText={(text) => setTime(text)} value={time} />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    setDateTimeVisiable(false);
                  }}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.accessButton} onPress={bookRoom}>
                  <Text style={styles.cancelText}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  );
};

const styles = StyleSheet.create({
  info: {
    marginTop: 5,
    marginBottom: 10,
  },

  infoTitle: {
    fontSize: 20,
    fontWeight: "500",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
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

export default PostDetailScreen;
