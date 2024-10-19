import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";
import { DOMAIN, IMAGE_DOMAIN } from "../../constants/URL";
import { COLOR } from "../../constants/COLORS";
import { ConvertToMoney, heighScreen, TimeAgo, witdhScreen } from "../../utils/Utils";
import { Button, SearchBar } from "@rneui/themed";
import Modal, { ModalContent } from "react-native-modals";
import { post } from "../../api/ApiManager";
import LoadingModal from "react-native-loading-modal";
import { useLoading } from "../../hook/LoadingProvider";

const PostScreen = ({ navigation }) => {
  const [roomTypes, setRoomTypes] = useState([]);

  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [roomTypeId, setRoomTypeId] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [roomTypeVisiable, setRoomTypeVisiable] = useState(false);
  const [roomTypeTitle, setRoomTypeTitle] = useState("Loại phòng trọ");

  const [acreageVisiable, setAcreageVisiable] = useState(false);

  const loading = useLoading();

  useEffect(() => {
    callSearchPostV2();
    fetchRoomType();
  }, []);

  useEffect(() => {
    callSearchPostV2();
  }, [roomTypeId]);

  const fetchRoomType = async () => {
    try {
      const data = await post("/room-type/search", {}, null);
      setRoomTypes(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height >= event.nativeEvent.contentSize.height) {
      setPage(page + 1);
      console.log("page: " + page);
      callSearchPost();
    }
  };

  const callSearchPost = () => {
    loading.isLoading();
    axios
      .post(DOMAIN + "/post/search", {
        roomTypeId: roomTypeId,
        province: "",
        district: "",
        ward: "",
        detail: keyword,
        priceFrom: 0,
        priceTo: 100000000,
        page: page,
        size: size,
      })
      .then((res) => {
        console.log(res);
        setPosts([...posts, ...res.data.data]);
      })
      .catch((err) => console.error(JSON.stringify(err)));
    loading.nonLoading();
  };

  const callSearchPostV2 = () => {
    loading.isLoading();

    setPage(0);
    setSize(10);

    axios
      .post(DOMAIN + "/post/search", {
        roomTypeId: roomTypeId,
        province: "",
        district: "",
        ward: "",
        detail: keyword,
        priceFrom: 0,
        priceTo: 100000000,
        page: page,
        size: size,
      })
      .then((res) => {
        console.log(JSON.stringify(res));
        setPosts(res.data.data);
      })
      .catch((err) => console.error(JSON.stringify(err)));

    loading.nonLoading();
  };

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 10, marginTop: 20, marginBottom: 130, height: heighScreen }}>
      <LoadingModal modalVisible={loading.loading} />
      <View>
        <Text style={styles.screenTitle}>Bài đăng</Text>
      </View>
      <View style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <SearchBar
            onChangeText={(text) => setKeyword(text)}
            value={keyword}
            placeholder="Tìm kiếm"
            lightTheme
            containerStyle={{ width: 300, height: 50, padding: 5 }}
            inputContainerStyle={{ height: 38 }}
          />
          <Button title={"tìm kiếm"} buttonStyle={{ height: 50 }} onPress={callSearchPostV2} />
        </View>
        <ScrollView horizontal style={{ position: "relative", width: "100%", marginTop: 10 }} showsHorizontalScrollIndicator={false}>
          <Pressable onPress={() => setRoomTypeVisiable(true)}>
            <Text style={styles.searchType}>{roomTypeTitle}</Text>
          </Pressable>

          <Pressable onPress={() => setAcreageVisiable(true)}>
            <Text style={styles.searchType}>Diện tích</Text>
          </Pressable>

          <Pressable>
            <Text style={styles.searchType}>Mức giá</Text>
          </Pressable>

          <Pressable>
            <Text style={styles.searchType}>Số phòng</Text>
          </Pressable>
        </ScrollView>
      </View>
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          onEndReached={() => handleScroll}
          onEndReachedThreshold={0.5}
          data={posts}
          key={(post) => post.id}
          keyExtractor={(post) => post.id}
          contentContainerStyle={{ padding: 10 }}
          renderItem={(post) => (
            <TouchableOpacity
              key={post.item.postId}
              onPress={() =>
                navigation.navigate("PostDetail", {
                  id: post.item.postId,
                })
              }
            >
              <View style={styles.post} key={post.index}>
                <View style={{ position: "relative" }}>
                  <Image
                    source={{
                      uri: IMAGE_DOMAIN + "/" + post.item.firstImage,
                    }}
                    style={{ height: 230, borderRadius: 10, objectFit: "cover" }}
                  />
                  <Text style={{ position: "absolute", bottom: 0, right: 0, padding: 5, backgroundColor: "grey", borderBottomRightRadius: 10, color: "white" }}>
                    {TimeAgo(post.item.postTime)}
                  </Text>
                </View>
                <Text style={{ fontSize: 17 }}>{post.item.title}</Text>
                <Text>{"Địa điểm: " + post.item.positionDetail + " - " + post.item.ward + " - " + post.item.district + " - " + post.item.province}</Text>
                <Text>{"Giá thuê: " + ConvertToMoney(post.item.price)}</Text>
                <Text>{"Loại phòng: " + post.item.typeName}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <Modal visible={roomTypeVisiable} onTouchOutside={() => setRoomTypeVisiable(false)} style={{ justifyContent: "flex-end" }}>
        <ModalContent style={{ width: witdhScreen, height: 300 }}>
          <View>
            <Text style={{ color: COLOR.lightBlue, fontSize: 20, marginLeft: 10, marginBottom: 10 }}>Loại phòng</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 20 }}>
              <Pressable
                onPress={() => {
                  setRoomTypeTitle("Loại phòng trọ");
                  setRoomTypeVisiable(false);
                  setRoomTypeId(null);
                }}
              >
                <Text style={styles.modalRoomType}>Tất cả</Text>
              </Pressable>
              {roomTypes.map((x) => (
                <Pressable
                  onPress={() => {
                    setRoomTypeTitle(x.name);
                    setRoomTypeVisiable(false);
                    setRoomTypeId(x.id);
                  }}
                >
                  <Text style={styles.modalRoomType}>{x.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </ModalContent>
      </Modal>

      <Modal visible={acreageVisiable} onTouchOutside={() => setAcreageVisiable(false)} style={{ justifyContent: "flex-end" }}>
        <ModalContent style={{ width: witdhScreen }}>
          <View>
            <Text>Diện tích</Text>
          </View>
          
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  post: {
    marginBottom: 20,
  },

  screenTitle: {
    marginBottom: 10,
    fontSize: 25,
    fontWeight: "700",
    color: COLOR.lightBlue,
  },

  search: {
    height: 30,
    width: 300,
    padding: 5,
    borderColor: "black",
    borderWidth: 1,
  },

  searchType: {
    width: 120,
    padding: 5,
    borderWidth: 1,
    borderColor: COLOR.lightBlue,
    textAlign: "center",
    borderRadius: 20,
    color: COLOR.lightBlue,
    marginHorizontal: 2,
  },

  modalRoomType: {
    padding: 10,
    marginBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.2)",
  },
});

export default PostScreen;
