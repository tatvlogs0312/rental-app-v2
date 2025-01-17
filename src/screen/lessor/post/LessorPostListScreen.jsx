import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../../constants/COLORS";
import { post } from "../../../api/ApiManager";
import HeaderBarPlus from "../../../components/header/HeaderBarPlus";
import { useLoading } from "../../../hook/LoadingProvider";
import { IMAGE_DOMAIN } from "../../../constants/URL";

const LessorPostListScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [posts, setPosts] = useState([]);
  const [totalPage, setTotalPage] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    fetchData();
  }, [auth.token, route.params?.refresh]);

  const fetchData = async () => {
    try {
      const response = await post("/rental-service/post/search-for-lessor/v2", { page: 0, size: size }, auth.token);
      setPosts(response.data);
      setTotalPage(response.totalPage);
      setPage(0);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreData = async () => {
    console.log("totalPage: " + totalPage);
    console.log("page: " + page);

    if (totalPage !== null && page + 1 < totalPage) {
      try {
        const response = await post("/rental-service/post/search-for-lessor/v2", { page: page + 1, size: size }, auth.token);
        const newPosts = response.data || [];
        setPosts([...posts, ...newPosts]);
        setPage(page + 1);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const loadMoreItem = async () => {
    await loadMoreData();
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={{
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        margin: 10,
        // Thiết lập đổ bóng cho iOS
        shadowColor: "#000",
        shadowRadius: 20,
        // Thiết lập đổ bóng cho Android
        elevation: 5,
      }}
      onPress={() =>
        navigation.navigate("LessorPostDetail", {
          postId: item.id,
        })
      }
    >
      {/* Thông tin bài đăng */}
      <View style={{ position: "relative" }}>
        <Image source={{ uri: IMAGE_DOMAIN + "/" + item.firstImage }} style={styles.cardNewImg} />
        <View style={{ position: "absolute", right: 10, bottom: 10, backgroundColor: COLOR.white, padding: 4, borderRadius: 5 }}>
          <Text>
            <FontAwesome6 name="camera" size={16} />
            {" " + item.numImage}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 17, fontWeight: "bold", marginBottom: 5, color: COLOR.primary }}>{item.title}</Text>
      <View>
        <Text>
          <FontAwesome6 name="calendar" size={14} />
          {"  " + item.createTime}
        </Text>
        <Text>
          <FontAwesome6 name="eye" size={14} />
          {" " + item.numberWatch + " lượt xem"}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderBarPlus title={"Bài viết"} back={() => navigation.goBack()} plus={() => navigation.navigate("LessorAddPost")} />
      <View style={{ padding: 5, flex: 1 }}>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} // Đảm bảo key là unique
          refreshControl={<RefreshControl refreshing={load.loading} onRefresh={fetchData} />}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreItem}
          onEndReachedThreshold={0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 5,
    backgroundColor: COLOR.black,
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  cardNewImg: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 10,
  },
});

export default LessorPostListScreen;
