import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { COLOR } from "../../../constants/COLORS";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { get, post } from "../../../api/ApiManager";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { IMAGE_DOMAIN } from "../../../constants/URL";
import { ConvertToMoneyV2 } from "../../../utils/Utils";
import { useFocusEffect } from "@react-navigation/native";
import LoadingModal from "react-native-loading-modal";

const TenantPostListScreen = ({ navigation, route }) => {
  const type = route?.params.type || "NEW";

  const auth = useAuth();
  const load = useLoading();

  const [posts, setPosts] = useState([]);
  const [totalPage, setTotalPage] = useState(null);

  const [keyword, setKeyword] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    getPost();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      // Nếu nhận được signal refresh, tải lại dữ liệu
      getPost();
    }
  }, [route.params?.refresh]);

  const loadMoreItem = async () => {
    await loadMoreData();
  };

  const getPost = async () => {
    load.isLoading();
    try {
      let api = "";
      if (type === "NEW") {
        api = "/post/search";
      } else {
        api = "/post/search-recommend";
      }
      const res = await post(api, { keyword: keyword, page: 0, size: size }, auth.token);
      setPosts(res.data);
      setTotalPage(res.totalPage);
      setPage(0);
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const loadMoreData = async () => {
    if (totalPage !== null && page + 1 < totalPage) {
      try {
        let api = "";
        if (type === "NEW") {
          api = "/post/search";
        } else {
          api = "/post/search-recommend";
        }
        const res = await post(api, { keyword: keyword, page: page + 1, size: size }, auth.token);
        setPosts([...posts, ...res.data]);
        setPage(page + 1);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getPostX = async () => {
    try {
      setPage(0);
      setKeyword(null);
      let api = "";
      if (type === "NEW") {
        api = "/post/search";
      } else {
        api = "/post/search-recommend";
      }
      const res = await post(api, { keyword: keyword, page: page, size: size }, auth.token);
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => (
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
      </View>
      <View>
        <Text style={styles.cardNewPosition}>{item.title}</Text>
        <View>
          <Text style={{color: COLOR.grey}}>
            <FontAwesome6 name="location-dot" /> {`${item.positionDetail} - ${item.ward} - ${item.district} - ${item.province}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <LoadingModal modalVisible={load.loading} />
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: COLOR.primary,
            padding: 10,
          }}
        >
          <Pressable
            style={{ height: 40, width: 40, backgroundColor: "black", justifyContent: "center", alignItems: "center", borderRadius: 10 }}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome6 name="angle-left" color={COLOR.white} size={20} />
          </Pressable>
          <TextInput style={styles.searchInput} placeholder="Tìm kiếm" placeholderTextColor="#A9A9A9" value={keyword} onChangeText={(t) => setKeyword(t)} />
          <Pressable
            style={{ height: 40, width: 40, backgroundColor: "black", justifyContent: "center", alignItems: "center", borderRadius: 10 }}
            onPress={getPost}
          >
            <FontAwesome6 name="magnifying-glass" color={COLOR.white} size={20} />
          </Pressable>
          <Pressable style={{ height: 40, width: 40, backgroundColor: "black", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
            <FontAwesome6 name="sliders" color={COLOR.white} size={20} />
          </Pressable>
        </View>
      </View>
      <View style={{ flex: 1, marginHorizontal: 10, marginBottom: 10 }}>
        {posts.length > 0 && (
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item.postId.toString()} // Sử dụng postId làm key
            contentContainerStyle={{ marginVertical: 10 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={load.loading} onRefresh={getPost} />}
            ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Không có bài viết nào.</Text>}
            onEndReached={loadMoreItem}
            onEndReachedThreshold={0}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardNew: {
    padding: 10,
    backgroundColor: COLOR.light,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 15,
    elevation: 3,
  },

  cardNewPosition: {
    fontSize: 17,
    marginBottom: 5,
    fontWeight: "600",
    color: COLOR.primary
  },

  cardNewImg: {
    width: "auto",
    height: 200,
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

  searchInput: {
    height: 40,
    width: 230,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
});

export default TenantPostListScreen;
