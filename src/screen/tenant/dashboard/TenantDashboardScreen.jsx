import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { COLOR } from "../../../constants/COLORS";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useAuth } from "../../../hook/AuthProvider";
import { post } from "../../../api/ApiManager";
import { IMAGE_DOMAIN } from "../../../constants/URL";
import { ConvertToMoneyV2 } from "../../../utils/Utils";

const TenantDashboardScreen = ({ navigation }) => {
  const auth = useAuth();

  const [news, setNews] = useState([]);
  const [recommends, setRecommends] = useState([]);

  useEffect(() => {
    getNews();
    getRecommends();
  }, []);

  const getNews = async () => {
    try {
      const res = await post("/post/search", { page: 0, size: 4 }, auth.token);
      setNews(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecommends = async () => {
    try {
      const res = await post("/post/search-recommend", { page: 0, size: 4 }, auth.token);
      setRecommends(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <View style={styles.hearder}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Xin chào,</Text>
          <Text style={{ fontSize: 21, fontWeight: "800" }}>Trần Anh Tuấn</Text>
        </View>
        <View>
          <Image source={require("../../../../assets/favicon.png")} />
        </View>
      </View>
      <View style={{ padding: 10, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#F5F5F5",
            borderRadius: 10,
            padding: 10,
            margin: 10,
          }}
        >
          <TextInput style={styles.searchInput} placeholder="Search Places" placeholderTextColor="#A9A9A9" />
          <Pressable style={{ height: 50, width: 50, backgroundColor: "black", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
            <FontAwesome6 name="sliders" color={COLOR.white} size={20} />
          </Pressable>
        </View>

        <ScrollView style={{ flex: 1, padding: 5, marginTop: 10 }}>
          <View style={{ marginBottom: 10 }}>
            <View style={{ padding: 5, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 17, fontWeight: "500" }}>Đăng gần đây</Text>
              <Pressable>
                <Text>Xem thêm</Text>
              </Pressable>
            </View>
            <ScrollView horizontal style={{ marginVertical: 10 }} showsHorizontalScrollIndicator={false}>
              {news &&
                news.map((item) => (
                  <Pressable
                    style={styles.cardNew}
                    onPress={() =>
                      navigation.navigate("PostDetail", {
                        id: item.postId,
                      })
                    }
                  >
                    <View style={{ position: "relative" }}>
                      <Image source={{ uri: IMAGE_DOMAIN + "/" + item.firstImage }} style={styles.cardNewImg} />
                      <Text style={styles.txtPrice1}>{ConvertToMoneyV2(item.price) + "/tháng"}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardNewPosition}>{item.title}</Text>
                      <View>
                        <Text>
                          <FontAwesome6 name="location-dot" /> {`${item.positionDetail} - ${item.ward} - ${item.district} - ${item.province}`}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
            </ScrollView>
          </View>

          <View>
            <View style={{ padding: 5, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 17, fontWeight: "500" }}>Đề xuất</Text>
              <Pressable>
                <Text>Xem thêm</Text>
              </Pressable>
            </View>
            <ScrollView horizontal style={{ marginVertical: 10 }} showsHorizontalScrollIndicator={false}>
              {recommends &&
                recommends.map((item) => (
                  <Pressable style={styles.cardNew}>
                    <View style={{ position: "relative" }}>
                      <Image source={{ uri: IMAGE_DOMAIN + "/" + item.firstImage }} style={styles.cardNewImg} />
                      <Text style={styles.txtPrice1}>{ConvertToMoneyV2(item.price) + "/tháng"}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardNewPosition}>{item.title}</Text>
                      <View>
                        <Text>
                          <FontAwesome6 name="location-dot" /> {`${item.positionDetail} - ${item.ward} - ${item.district} - ${item.province}`}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hearder: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },

  searchInput: {
    height: 40,
    width: 270,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },

  cardNew: {
    width: 250,
    padding: 10,
    backgroundColor: COLOR.light,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  cardNewPosition: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: "600",
  },

  cardNewImg: {
    width: "auto",
    height: 150,
    objectFit: "cover",
    borderRadius: 10,
  },

  txtPrice1: {
    padding: 5,
    backgroundColor: COLOR.white,
    color: COLOR.black,
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 10,
  },
});

export default TenantDashboardScreen;
