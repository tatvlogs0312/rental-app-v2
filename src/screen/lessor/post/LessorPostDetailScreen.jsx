import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../../constants/COLORS";
import { get } from "../../../api/ApiManager";
import { IMAGE_DOMAIN } from "../../../constants/URL";
import { ConvertToMoneyV2 } from "../../../utils/Utils";

const LessorPostDetailScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const postId = route.params.postId;

  const [post, setPost] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    try {
      const res = await get("/post/" + postId, null, auth.token);
      setPost(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <View></View>
      <View>
        {post && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <View style={{ position: "relative" }}>
                <View style={{ position: "absolute", zIndex: 10, top: 10, left: 10 }}>
                  <Pressable style={styles.icon} onPress={() => navigation.goBack()}>
                    <FontAwesome6 name="angle-left" size={25} color={COLOR.black} />
                  </Pressable>
                </View>
                <Image source={{ uri: `${IMAGE_DOMAIN}/${post.image[imageIndex]}` }} style={{ width: "auto", height: 250, objectFit: "cover" }} />
              </View>
              <View style={{ padding: 10 }}>
                <View>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled
                    horizontal
                    data={post.image}
                    renderItem={({ index, item }) => (
                      <Pressable onPress={() => setImageIndex(index)}>
                        <Image
                          source={{ uri: `${IMAGE_DOMAIN}/${item}` }}
                          style={{
                            marginRight: index === images.length - 1 ? 0 : 10,
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
                    <Text style={{ fontSize: 19, fontWeight: "bold" }}>{post.title}</Text>
                    <Text style={{ marginVertical: 3, fontSize: 14 }}>
                      <FontAwesome6 name="location-dot" size={14} />
                      {` ${post.position.detail}, ${post.position.ward}, ${post.position.district}, ${post.position.province}`}
                    </Text>
                  </View>
                  <View style={{ marginTop: 5, borderTopWidth: 0.5, borderTopColor: COLOR.grey }}>
                    {/* <View style={{ marginVertical: 5, flexDirection: "row", alignItems: "flex-end" }}>
                      <View style={styles.info}>
                        <Text style={styles.infoTitle}>Loại phòng</Text>
                        <Text style={styles.infoValue}>{`${post.roomTypeName}`}</Text>
                      </View>
                      <View style={styles.info}>
                        <Text style={styles.infoTitle}>Giá cho thuê</Text>
                        <Text style={styles.infoValue}>{`${ConvertToMoneyV2(post.price)}/tháng`}</Text>
                      </View>
                      <View style={styles.info}>
                        <Text style={styles.infoTitle}>Phòng ngủ</Text>
                        <Text style={styles.infoValue}>{`${ConvertToMoneyV2(post.price)}/tháng`}</Text>
                      </View>
                      <View style={styles.info}>
                        <Text style={styles.infoTitle}>Diện tích</Text>
                        <Text style={styles.infoValue}>{`${post.acreage}m²`}</Text>
                      </View>
                    </View> */}

                    <View>
                      <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 15, marginBottom: 5 }}>Mô tả:</Text>
                      <Text>{post.content}</Text>
                    </View>

                    <View>
                      <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 15, marginBottom: 10 }}>Thông tin phòng:</Text>
                      <View style={{ ...styles.infoV2, ...{ borderTopWidth: 0.5, borderColor: COLOR.grey } }}>
                        <View style={styles.infoV2Icon}>
                          <FontAwesome6 name="house" size={14} />
                        </View>
                        <Text style={styles.infoV2Title}>Loại phòng</Text>
                        <Text>{`${post.roomTypeName}`}</Text>
                      </View>
                      <View style={{ ...styles.infoV2, ...{ borderTopWidth: 0.5, borderColor: COLOR.grey } }}>
                        <View style={styles.infoV2Icon}>
                          <FontAwesome6 name="money-bill-1-wave" size={14} />
                        </View>
                        <Text style={styles.infoV2Title}>Mức giá</Text>
                        <Text>{`${ConvertToMoneyV2(post.price)}/tháng`}</Text>
                      </View>
                      <View style={{ ...styles.infoV2, ...{ borderTopWidth: 0.5, borderColor: COLOR.grey } }}>
                        <View style={styles.infoV2Icon}>
                          <FontAwesome6 name="expand" size={14} />
                        </View>
                        <Text style={styles.infoV2Title}>Diện tích</Text>
                        <Text>{`${post.acreage}m²`}</Text>
                      </View>
                      <View style={{ ...styles.infoV2, ...{ borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: COLOR.grey } }}>
                        <View style={styles.infoV2Icon}>
                          <FontAwesome6 name="bed" size={14} />
                        </View>
                        <Text style={styles.infoV2Title}>Số phòng ngủ</Text>
                        <Text>{`${post.numberOfRoom} PN`}</Text>
                      </View>
                    </View>

                    <View style={{ marginTop: 5 }}>
                      <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 15, marginBottom: 5 }}>Liên hệ xem phòng:</Text>
                      <Text>
                        <FontAwesome6 name="user" solid />
                        {` ${post.lessorName}`}
                      </Text>
                      <Text>
                        <FontAwesome6 name="phone" solid />
                        {` ${post.lessorNumber}`}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
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
  },

  infoV2Value: {
    width: "50%",
  },
});

export default LessorPostDetailScreen;
