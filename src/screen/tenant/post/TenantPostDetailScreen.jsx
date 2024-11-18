import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { get, post } from "../../../api/ApiManager";
import { COLOR } from "../../../constants/COLORS";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { ConvertToMoneyV2 } from "../../../utils/Utils";
import { IMAGE_DOMAIN } from "../../../constants/URL";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const TenantPostDetailScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [postId, setPostId] = useState(route.params.id);
  //   const postId = "e6857390-313b-484f-9dfb-47aa70f97a06";

  const [postData, setPostData] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  const [recommends, setRecommends] = useState([]);

  useEffect(() => {
    getPost();
    getRecommends();

    return () => {
      console.log("CLEAN UP");
    };
  }, [postId]);

  const getPost = async () => {
    try {
      const res = await get("/post/" + postId, null, auth.token);
      setPostData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecommends = async () => {
    try {
      const res = await post("/post/search-recommend", { ignore: postId, page: 0, size: 4 }, auth.token);
      setRecommends(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <View>
        {postData && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <View style={{ position: "relative" }}>
                <View style={{ position: "absolute", zIndex: 10, top: 10, left: 10 }}>
                  <Pressable
                    style={styles.icon}
                    onPress={() => {
                      if (navigation.canGoBack()) {
                        navigation.goBack();
                      } else {
                        console.log("No previous screen to go back to");
                      }
                    }}
                  >
                    <FontAwesome6 name="angle-left" size={25} color={COLOR.primary} />
                  </Pressable>
                </View>
                <View style={{ position: "absolute", zIndex: 10, top: 10, right: 10 }}>
                  <Pressable style={styles.icon}>
                    <FontAwesome6 name="heart" size={25} color={COLOR.primary} />
                  </Pressable>
                </View>
                <Image source={{ uri: `${IMAGE_DOMAIN}/${postData.image[imageIndex]}` }} style={{ width: "auto", height: 250, objectFit: "cover" }} />
              </View>
              <View style={{ padding: 10 }}>
                <View>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled
                    horizontal
                    data={postData.image}
                    renderItem={({ index, item }) => (
                      <Pressable onPress={() => setImageIndex(index)}>
                        <Image
                          source={{ uri: `${IMAGE_DOMAIN}/${item}` }}
                          style={{
                            marginRight: index === postData.image.length - 1 ? 0 : 10,
                            width: 100,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 10,
                          }}
                        />
                      </Pressable>
                    )}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <View>
                    <Text style={{ fontSize: 19, fontWeight: "bold" }}>{postData.title}</Text>
                    <Text style={{ marginVertical: 3, fontSize: 14 }}>
                      <FontAwesome6 name="location-dot" size={14} color={COLOR.primary} />
                      {` ${postData.position.detail}, ${postData.position.ward}, ${postData.position.district}, ${postData.position.province}`}
                    </Text>
                  </View>
                  <View style={{ marginTop: 5, borderTopWidth: 0.5, borderTopColor: COLOR.primary }}>
                    <View>
                      <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 15, marginBottom: 5, color: COLOR.primary }}>Mô tả:</Text>
                      <Text>{postData.content}</Text>
                    </View>

                    <View>
                      <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 15, marginBottom: 10, color: COLOR.primary }}>Thông tin phòng:</Text>
                      <View style={{ ...styles.infoV2, ...{ borderTopWidth: 0.5, borderColor: COLOR.primary } }}>
                        <View style={styles.infoV2Icon}>
                          <FontAwesome6 name="house" size={14} color={COLOR.primary} />
                        </View>
                        <Text style={styles.infoV2Title}>Loại phòng</Text>
                        <Text>{`${postData.roomTypeName}`}</Text>
                      </View>
                      <View style={{ ...styles.infoV2, ...{ borderTopWidth: 0.5, borderColor: COLOR.primary } }}>
                        <View style={styles.infoV2Icon}>
                          <FontAwesome6 name="money-bill-1-wave" size={14} color={COLOR.primary} />
                        </View>
                        <Text style={styles.infoV2Title}>Mức giá</Text>
                        <Text>{`${ConvertToMoneyV2(postData.price)}/tháng`}</Text>
                      </View>
                      <View style={{ ...styles.infoV2, ...{ borderTopWidth: 0.5, borderColor: COLOR.primary } }}>
                        <View style={styles.infoV2Icon}>
                          <FontAwesome6 name="expand" size={14} color={COLOR.primary} />
                        </View>
                        <Text style={styles.infoV2Title}>Diện tích</Text>
                        <Text>{`${postData.acreage}m²`}</Text>
                      </View>
                      <View style={{ ...styles.infoV2, ...{ borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: COLOR.primary } }}>
                        <View style={styles.infoV2Icon}>
                          <FontAwesome6 name="bed" size={14} color={COLOR.primary} />
                        </View>
                        <Text style={styles.infoV2Title}>Số phòng ngủ</Text>
                        <Text>{`${postData.numberOfRoom} PN`}</Text>
                      </View>
                    </View>

                    <View style={{ marginTop: 5 }}>
                      <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 15, marginBottom: 5, color: COLOR.primary }}>Liên hệ xem phòng:</Text>
                      <Text>
                        <FontAwesome6 name="user" solid />
                        {` ${postData.lessorName}`}
                      </Text>
                      <Text>
                        <FontAwesome6 name="phone" solid />
                        {` ${postData.lessorNumber}`}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ marginVertical: 10, marginHorizontal: "auto" }}>
              <TouchableOpacity>
                <Text
                  style={{
                    padding: 10,
                    backgroundColor: COLOR.primary,
                    color: COLOR.white,
                    fontSize: 18,
                    fontWeight: "bold",
                    width: 250,
                    textAlign: "center",
                    borderRadius: 15,
                  }}
                >
                  Liên hệ ngay
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ margin: 10 }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: COLOR.primary }}>Bài viết liên quan:</Text>
              </View>
              <ScrollView horizontal style={{ marginVertical: 10 }} showsHorizontalScrollIndicator={false}>
                {recommends &&
                  recommends.map((item) => (
                    <Pressable
                      style={styles.cardNew}
                      onPress={() => {
                        console.log(item.postId);
                        navigation.push("TenantPostDetail", { id: item.postId });
                      }}
                    >
                      <View style={{ position: "relative" }}>
                        <Image source={{ uri: IMAGE_DOMAIN + "/" + item.firstImage }} style={styles.cardNewImg} />
                        <Text style={styles.txtPrice1}>{ConvertToMoneyV2(item.price) + "/tháng"}</Text>
                      </View>
                      <View>
                        <Text numberOfLines={1} style={styles.cardNewPosition}>
                          {item.title}
                        </Text>
                        <View>
                          <Text style={{ color: COLOR.grey }}>
                            <FontAwesome6 name="location-dot" /> {`${item.positionDetail} - ${item.ward} - ${item.district} - ${item.province}`}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 5,
    backgroundColor: COLOR.white,
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    marginRight: 10,
  },

  infoTitle: {
    fontSize: 14,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "500",
  },

  infoV2: {
    flexDirection: "row",
    // marginVertical: 5,
    paddingVertical: 10,
  },

  infoV2Icon: {
    width: "7%",
  },

  infoV2Title: {
    width: "43%",
    fontWeight: "500",
    color: COLOR.primary,
  },

  infoV2Value: {
    width: "50%",
  },

  cardNew: {
    width: 250,
    padding: 10,
    backgroundColor: COLOR.light,
    borderRadius: 10,
    margin: 5,
    zIndex: 10,
    elevation: 2,
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
    color: COLOR.primary,
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 10,
  },
});

export default TenantPostDetailScreen;
