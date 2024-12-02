import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { get, post } from "../../../api/ApiManager";
import { COLOR } from "../../../constants/COLORS";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { ConvertToMoneyV2, witdhScreen } from "../../../utils/Utils";
import { IMAGE_DOMAIN } from "../../../constants/URL";
import { TouchableOpacity } from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const TenantPostDetailScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [postId, setPostId] = useState(route.params.id);

  const [postData, setPostData] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  const [recommends, setRecommends] = useState([]);

  const flatListRef = useRef(null);
  const thumbnailListRef = useRef(null);

  const handleScroll = (event) => {
    // Lấy chỉ số trang hiện tại
    const index = Math.round(event.nativeEvent.contentOffset.x / witdhScreen);
    console.log(index);

    setImageIndex(index);

    // Cuộn danh sách thumbnail đến đúng vị trí
    thumbnailListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0,
    });
  };

  const handleThumbnailPress = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const openDialer = () => {
    const url = `tel:${postData.lessorNumber}`;
    console.log(url);

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url); // Mở ứng dụng điện thoại
        } else {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            textBody: "Không thể mở ứng dụng điện thoại của bạn",
          });
        }
      })
      .catch((err) => console.error("Lỗi khi mở ứng dụng gọi điện:", err));
  };

  useEffect(() => {
    getPost();
    getRecommends();

    return () => {
      console.log("CLEAN UP");
    };
  }, [postId]);

  const getPost = async () => {
    try {
      const res = await get("/rental-service/post/" + postId, null, auth.token);
      setPostData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecommends = async () => {
    try {
      const res = await post("/rental-service/post/search-recommend", { ignore: postId, page: 0, size: 4 }, auth.token);
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
                  <Pressable style={styles.icon} onPress={() => navigation.goBack()}>
                    <FontAwesome6 name="angle-left" size={25} color={COLOR.primary} />
                  </Pressable>
                </View>
                <View style={{ position: "absolute", zIndex: 10, top: 10, right: 10 }}>
                  <Pressable style={styles.icon}>
                    <FontAwesome6 name="heart" size={25} color={COLOR.primary} />
                  </Pressable>
                </View>
                <FlatList
                  ref={flatListRef}
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled
                  horizontal
                  data={postData.image}
                  renderItem={({ item, index }) => (
                    <Image source={{ uri: `${IMAGE_DOMAIN}/${item}` }} style={{ width: witdhScreen, height: 250, objectFit: "cover" }} />
                  )}
                  pagingEnabled
                  bounces={false}
                  onScroll={handleScroll}
                  onViewableItemsChanged={({ viewableItems }) => {
                    setImageIndex(viewableItems[0]?.index); // Sử dụng dấu ? để tránh lỗi khi không có item nào
                  }}
                />
              </View>
              <View style={{ padding: 10 }}>
                <View>
                  <FlatList
                    ref={thumbnailListRef}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled
                    horizontal
                    data={postData.image}
                    renderItem={({ index, item }) => (
                      <Pressable onPress={() => handleThumbnailPress(index)}>
                        <Image
                          source={{ uri: `${IMAGE_DOMAIN}/${item}` }}
                          style={[
                            {
                              marginRight: index === postData.image.length - 1 ? 0 : 10,
                              width: 100,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 10,
                            },
                            imageIndex === index && {
                              borderWidth: 5,
                              borderColor: COLOR.primary,
                            },
                          ]}
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
                  <View style={{ marginTop: 5, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLOR.grey }}>
                    <View>
                      <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 15, marginBottom: 5, color: COLOR.primary }}>Mô tả:</Text>
                      <Text>{postData.content}</Text>
                    </View>

                    <View>
                      <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 15, marginBottom: 10, color: COLOR.primary }}>Thông tin phòng:</Text>
                      <View style={{ ...styles.infoV2, ...{ borderTopWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey } }}>
                        <View style={styles.infoV2Icon}>
                          <FontAwesome6 name="house" size={14} color={COLOR.primary} />
                        </View>
                        <Text style={styles.infoV2Title}>Loại phòng</Text>
                        <Text>{`${postData.roomTypeName}`}</Text>
                      </View>
                      <View style={{ ...styles.infoV2, ...{ borderTopWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey } }}>
                        <View style={styles.infoV2Icon}>
                          <FontAwesome6 name="money-bill-1-wave" size={14} color={COLOR.primary} />
                        </View>
                        <Text style={styles.infoV2Title}>Mức giá</Text>
                        <Text>{`${ConvertToMoneyV2(postData.price)}/tháng`}</Text>
                      </View>
                      <View style={{ ...styles.infoV2, ...{ borderTopWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey } }}>
                        <View style={styles.infoV2Icon}>
                          <FontAwesome6 name="expand" size={14} color={COLOR.primary} />
                        </View>
                        <Text style={styles.infoV2Title}>Diện tích</Text>
                        <Text>{`${postData.acreage}m²`}</Text>
                      </View>
                      <View
                        style={{
                          ...styles.infoV2,
                          ...{ borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLOR.grey },
                        }}
                      >
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
                        <FontAwesome6 name="user" solid color={COLOR.primary} />
                        {` ${postData.lessorName}`}
                      </Text>
                      <Text>
                        <FontAwesome6 name="phone" solid color={COLOR.primary} />
                        {` ${postData.lessorNumber}`}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ marginVertical: 10, marginHorizontal: "auto" }}>
              <TouchableOpacity onPress={openDialer}>
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
    // color: COLOR.primary,
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
