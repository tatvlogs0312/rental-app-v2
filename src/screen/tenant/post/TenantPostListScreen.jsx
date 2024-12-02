import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { COLOR } from "../../../constants/COLORS";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { get, post } from "../../../api/ApiManager";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { IMAGE_DOMAIN } from "../../../constants/URL";
import { ConvertMoneyV3, ConvertToMoneyV2 } from "../../../utils/Utils";
import { useFocusEffect } from "@react-navigation/native";
import LoadingModal from "react-native-loading-modal";
import { TouchableOpacity } from "react-native";

const TenantPostListScreen = ({ navigation, route }) => {
  const type = route?.params.type || "NEW";

  const auth = useAuth();
  const load = useLoading();

  const [posts, setPosts] = useState([]);
  const [totalPage, setTotalPage] = useState(null);

  const [roomTypeId, setRoomTypeId] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });

  const [types, setTypes] = useState([]);

  const [visiable, setVisiable] = useState(false);

  useEffect(() => {
    getPost();
    getRoomTypes();
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

  const getRoomTypes = async () => {
    try {
      const data = await post("/rental-service/room-type/search", {}, null);
      setTypes(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPost = async () => {
    load.isLoading();
    try {
      let api = "";
      if (type === "NEW") {
        api = "/rental-service/post/search";
      } else {
        api = "/rental-service/post/search-recommend";
      }
      const res = await post(
        api,
        {
          keyword: keyword,
          roomTypeId: roomTypeId,
          priceFrom: priceRange.min,
          priceTo: priceRange.max,
          page: 0,
          size: size,
        },
        auth.token,
      );
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
          api = "/rental-service/post/search";
        } else {
          api = "/rental-service/post/search-recommend";
        }
        const res = await post(
          api,
          {
            keyword: keyword,
            priceFrom: priceRange.min,
            priceTo: priceRange.max,
            roomTypeId: roomTypeId,
            page: page + 1,
            size: size,
          },
          auth.token,
        );
        setPosts([...posts, ...res.data]);
        setPage(page + 1);
      } catch (error) {
        console.log(error);
      }
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
        <Text style={{ padding: 5, backgroundColor: COLOR.white, color: COLOR.primary, position: "absolute", bottom: 5, left: 5, borderRadius: 10 }}>
          {item.typeName}
        </Text>
      </View>
      <View>
        <Text style={styles.cardNewPosition}>{item.title}</Text>
        <View>
          <Text style={{ color: COLOR.grey }}>
            <FontAwesome6 name="location-dot" /> {`${item.positionDetail} - ${item.ward} - ${item.district} - ${item.province}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <>
      <View style={{ flex: 1 }}>
        <LoadingModal modalVisible={load.loading} />
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: COLOR.white,
              padding: 10,
            }}
          >
            <Pressable style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center", borderRadius: 10 }} onPress={() => navigation.goBack()}>
              <FontAwesome6 name="angle-left" color={COLOR.primary} size={20} />
            </Pressable>
            <TextInput style={styles.searchInput} placeholder="Tìm kiếm" placeholderTextColor="#A9A9A9" value={keyword} onChangeText={(t) => setKeyword(t)} />
            <Pressable style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center", borderRadius: 10 }} onPress={getPost}>
              <FontAwesome6 name="magnifying-glass" color={COLOR.primary} size={20} />
            </Pressable>
            <Pressable style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center", borderRadius: 10 }} onPress={() => setVisiable(true)}>
              <FontAwesome6 name="sliders" color={COLOR.primary} size={20} />
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

      <Modal visible={visiable} animationType="slide">
        <View style={styles.modalContent}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={styles.title}>Bộ lọc tìm kiếm</Text>
            <Pressable style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center", borderRadius: 10 }} onPress={() => setVisiable(false)}>
              <FontAwesome6 name="x" color={COLOR.red} size={20} />
            </Pressable>
          </View>

          {/* Loại phòng */}
          <Text style={styles.label}>Loại phòng</Text>
          <FlatList
            data={types}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.brandButton, roomTypeId === item.id && styles.selectedBrand]} onPress={() => setRoomTypeId(item.id)}>
                <Text style={[styles.brandText, roomTypeId === item.id && styles.selectedBrandText]}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Khoảng giá */}
          <Text style={styles.label}>Khoảng Giá (đ)</Text>
          <View style={styles.priceRange}>
            <TextInput
              style={styles.priceInput}
              placeholder="Tối thiểu"
              keyboardType="numeric"
              value={String(priceRange.min)}
              onChangeText={(text) => setPriceRange((prev) => ({ ...prev, min: text }))}
            />
            <Text style={styles.priceDivider}>-</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Tối đa"
              keyboardType="numeric"
              value={String(priceRange.max)}
              onChangeText={(text) => setPriceRange((prev) => ({ ...prev, max: text }))}
            />
          </View>

          {/* Nút hành động */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setRoomTypeId(null);
                setPriceRange({ min: 0, max: 100000000 });
              }}
            >
              <Text style={styles.resetButtonText}>Thiết lập lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                getPost();
                setVisiable(false);
              }}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
    color: COLOR.primary,
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
    width: 250,
    paddingHorizontal: 15,
    backgroundColor: COLOR.light,
    borderRadius: 10,
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },

  brandButton: {
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },

  selectedBrand: {
    backgroundColor: "#FF5722",
  },

  brandText: {
    fontSize: 14,
    color: "#000",
  },

  selectedBrandText: {
    color: "#FFFFFF",
  },

  priceRange: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-between",
  },

  priceInput: {
    // flex: 1,
    width: 170,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    textAlign: "center",
  },

  priceDivider: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: "bold",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  resetButton: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },

  resetButtonText: {
    textAlign: "center",
    color: "#000",
  },

  applyButton: {
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },

  applyButtonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default TenantPostListScreen;
