import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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

  const [keyword, setKeyword] = useState(null);

  useEffect(() => {
    getNews();
    getRecommends();
  }, []);

  const getNews = async () => {
    try {
      const res = await post("/rental-service/post/search", { page: 0, size: 4 }, auth.token);
      setNews(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecommends = async () => {
    try {
      const res = await post("/rental-service/post/search-recommend", { page: 0, size: 4 }, auth.token);
      setRecommends(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <View style={styles.hearder}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "600", color: COLOR.primary }}>Xin chào,</Text>
          <Text style={{ fontSize: 21, fontWeight: "800", color: COLOR.primary }}>{auth.info.firstName + " " + auth.info.lastName}</Text>
        </View>
        <View>
          <Image source={{ uri: `${IMAGE_DOMAIN}/${auth.info.avatar}` }} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 100 }} />
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
          <TextInput style={styles.searchInput} placeholder="Tìm kiếm" placeholderTextColor={COLOR.grey} value={keyword} onChangeText={setKeyword} />
          <TouchableOpacity
            style={{ height: 50, width: 50, backgroundColor: COLOR.primary, justifyContent: "center", alignItems: "center", borderRadius: 10 }}
            disabled={keyword === null || keyword === ""}
            onPress={() =>
              navigation.navigate("TenantPostList", {
                type: "NEW",
                keyword: keyword,
              })
            }
          >
            <FontAwesome6 name="magnifying-glass" color={COLOR.white} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 5, marginTop: 10 }} showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 10 }}>
            <View style={{ padding: 5, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 17, fontWeight: "500", color: COLOR.primary }}>Đăng gần đây</Text>
              <Pressable
                onPress={() =>
                  navigation.navigate("TenantPostList", {
                    type: "NEW",
                  })
                }
              >
                <Text style={{ color: COLOR.primary }}>Xem thêm</Text>
              </Pressable>
            </View>
            <ScrollView horizontal style={{ marginVertical: 10 }} showsHorizontalScrollIndicator={false}>
              {news &&
                news.map((item) => (
                  <Pressable
                    style={styles.cardNew}
                    onPress={() =>
                      navigation.navigate("TenantPostDetail", {
                        id: item.postId,
                      })
                    }
                  >
                    <View style={{ position: "relative" }}>
                      <Image source={{ uri: IMAGE_DOMAIN + "/" + item.firstImage }} style={styles.cardNewImg} />
                      <Text style={styles.txtPrice1}>{ConvertToMoneyV2(item.price) + "/tháng"}</Text>
                      <Text
                        style={{ padding: 5, backgroundColor: COLOR.white, color: COLOR.primary, position: "absolute", bottom: 5, left: 5, borderRadius: 10 }}
                      >
                        {item.typeName}
                      </Text>
                    </View>
                    <View>
                      <Text numberOfLines={1} style={styles.cardNewPosition}>
                        {item.title}
                      </Text>
                      <View>
                        <Text style={{ color: COLOR.grey }}>
                          <FontAwesome6 name="location-dot" color={COLOR.primary} size={16} />{" "}
                          {`${item.positionDetail} - ${item.ward} - ${item.district} - ${item.province}`}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
            </ScrollView>
          </View>

          <View>
            <View style={{ padding: 5, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 17, fontWeight: "500", color: COLOR.primary }}>Đề xuất</Text>
              <Pressable
                onPress={() =>
                  navigation.navigate("TenantPostList", {
                    type: "RECOMMENDS",
                  })
                }
              >
                <Text style={{ color: COLOR.primary }}>Xem thêm</Text>
              </Pressable>
            </View>
            <ScrollView horizontal style={{ marginVertical: 10 }} showsHorizontalScrollIndicator={false}>
              {recommends &&
                recommends.map((item) => (
                  <Pressable
                    style={styles.cardNew}
                    onPress={() =>
                      navigation.navigate("TenantPostDetail", {
                        id: item.postId,
                      })
                    }
                  >
                    <View style={{ position: "relative" }}>
                      <Image source={{ uri: IMAGE_DOMAIN + "/" + item.firstImage }} style={styles.cardNewImg} />
                      <Text style={styles.txtPrice1}>{ConvertToMoneyV2(item.price) + "/tháng"}</Text>
                      <Text
                        style={{ padding: 5, backgroundColor: COLOR.white, color: COLOR.primary, position: "absolute", bottom: 5, left: 5, borderRadius: 10 }}
                      >
                        {item.typeName}
                      </Text>
                    </View>
                    <View>
                      <Text numberOfLines={1} style={styles.cardNewPosition}>
                        {item.title}
                      </Text>
                      <View>
                        <Text style={{ color: COLOR.grey }}>
                          <FontAwesome6 name="location-dot" color={COLOR.primary} size={16} />{" "}
                          {`${item.positionDetail} - ${item.ward} - ${item.district} - ${item.province}`}
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
    alignItems: "flex-end",
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
    margin: 5,
    elevation: 2,
  },

  cardNewPosition: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: "600",
    paddingVertical: 10,
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
    color: COLOR.primary,
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 10,
  },
});

export default TenantDashboardScreen;
