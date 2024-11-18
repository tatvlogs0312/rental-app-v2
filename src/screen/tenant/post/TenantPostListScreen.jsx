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

const TenantPostListScreen = ({ navigation, route }) => {
  const type = route?.params.type || "NEW";

  const auth = useAuth();
  const load = useLoading();

  const [posts, setPosts] = useState([]);
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
    setPage(page + 1);
  };

  const getPost = async () => {
    try {
      let api = "";
      if (type === "NEW") {
        api = "/post/search";
      } else {
        api = "/post/search-recommend";
      }
      const res = await post(api, { page: page, size: size }, auth.token);
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreData = async () => {
    try {
      let api = "";
      if (type === "NEW") {
        api = "/post/search";
      } else {
        api = "/post/search-recommend";
      }
      const res = await post(api, { page: page + 1, size: size }, auth.token);
      setPosts([...posts, ...res.data]);
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
          <Text>
            <FontAwesome6 name="location-dot" /> {`${item.positionDetail} - ${item.ward} - ${item.district} - ${item.province}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#F5F5F5",
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Pressable
            style={{ height: 50, width: 50, backgroundColor: "black", justifyContent: "center", alignItems: "center", borderRadius: 10 }}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome6 name="angle-left" color={COLOR.white} size={20} />
          </Pressable>
          <TextInput style={styles.searchInput} placeholder="Tìm kiếm" placeholderTextColor="#A9A9A9" />
          <Pressable style={{ height: 50, width: 50, backgroundColor: "black", justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
            <FontAwesome6 name="sliders" color={COLOR.white} size={20} />
          </Pressable>
        </View>
      </View>
      <View style={{ flex: 1, margin: 10 }}>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.postId.toString()} // Sử dụng postId làm key
          contentContainerStyle={{ marginVertical: 10 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={load.loading} onRefresh={getPost} />}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Không có bài viết nào.</Text>}
          // onEndReached={loadMoreItem}
          // onEndReachedThreshold={0}
        />
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
    elevation: 5,
  },

  cardNewPosition: {
    fontSize: 17,
    marginBottom: 5,
    fontWeight: "600",
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
    color: COLOR.black,
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 10,
  },

  searchInput: {
    height: 40,
    width: 270,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
});

export default TenantPostListScreen;
