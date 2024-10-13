import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, Dimensions, StatusBar, StyleSheet, Text, View, ScrollView } from "react-native";
import { DOMAIN, IMAGE_DOMAIN } from "../../constants/URL";
import { ConvertToMoney } from "../../utils/Utils";
import { Button } from "@rneui/base";

const PostDetailScreen = ({ navigation, route }) => {
  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  useEffect(() => {
    axios
      .get(DOMAIN + "/post/" + route.params.id)
      .then((res) => {
        console.log(res.data);
        setPost(res.data);
        setImages(res.data.image);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    post && (
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
              <Text style={{ fontSize: 22, fontWeight: "600" }}>{post.title}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>Mô tả</Text>
              <Text>{post.content}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>Thông tin phòng</Text>
              <Text>{"Diện tích: " + post.acreage + "m2"}</Text>
              <Text>{"Số phòng: " + post.numberOfRoom}</Text>
              <Text>{"Giá cho thuê: " + ConvertToMoney(post.price)}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>Địa chỉ</Text>
              <Text>{post.position.detail + " - " + post.position.ward + " - " + post.position.district + " - " + post.position.province}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>Dịch vụ</Text>
              {post.utility.map((item) => (
                <View>
                  <Text>{item.utilityName + ": " + ConvertToMoney(item.utilityPrice) + "/" + item.utilityUnit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>Liên hệ</Text>
              <Text>{"Chủ trọ: " + post.lessorName}</Text>
              <Text>{"Số điện thoại liên hệ: " + post.lessorNumber}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 5 }}>
          <Button title={"Liên hệ"} containerStyle={{ width: 200, marginHorizontal: 5, borderRadius: 20 }} size="lg" />
          <Button title={"Đặt xem"} containerStyle={{ width: 200, marginHorizontal: 5, borderRadius: 20 }} size="lg" />
        </View>
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
});

export default PostDetailScreen;
