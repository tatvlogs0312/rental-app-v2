import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../../constants/COLORS";
import { get, post } from "../../../api/ApiManager";
import { IMAGE_DOMAIN } from "../../../constants/URL";
import { ConvertToMoneyV2, witdhScreen } from "../../../utils/Utils";
import { TouchableOpacity } from "react-native";
import ConfirmPopup from "../../../components/ConfirmPopup";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import uuid from "react-native-uuid";
import LoadingModal from "react-native-loading-modal";

const LessorPostDetailScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const postId = route.params.postId;

  const [postData, setPostData] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  const [deleteVisiable, setDeleteVisiable] = useState(false);

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

  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    try {
      const res = await get("/post/" + postId, null, auth.token);
      setPostData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (id) => {
    try {
      load.isLoading();
      const response = await post("/post/delete", { id: postId }, auth.token);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Xóa bài đăng thành công",
        title: "Thông báo",
      });
      navigation.navigate("LessorPostList", {
        refresh: uuid.v4(),
      });
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
      setDeleteVisiable(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <LoadingModal modalVisible={load.loading} />
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
                      <FontAwesome6 name="location-dot" size={14} />
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

            <View style={{ marginVertical: 10, padding: 10 }}>
              <TouchableOpacity onPress={() => setDeleteVisiable(true)}>
                <Text
                  style={{
                    padding: 10,
                    backgroundColor: COLOR.primary,
                    color: COLOR.white,
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRadius: 15,
                  }}
                >
                  Xóa bài đăng
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>

      <Modal visible={deleteVisiable} transparent animationType="slide">
        <ConfirmPopup
          title={"Bạn có muốn xóa bài đăng này"}
          onCancel={() => {
            setDeleteVisiable(false);
          }}
          onSubmit={() => {
            deletePost();
          }}
        />
      </Modal>
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
});

export default LessorPostDetailScreen;
