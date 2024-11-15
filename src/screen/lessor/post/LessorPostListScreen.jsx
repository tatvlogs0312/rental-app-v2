import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { COLOR } from "../../../constants/COLORS";
import { post } from "../../../api/ApiManager";

const LessorPostListScreen = ({ navigation }) => {
  const auth = useAuth();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    fetchData();
  }, [page, size, auth.token]);

  const fetchData = async () => {
    try {
      const response = await post("/post/search-for-lessor", { page: page, size: size }, auth.token);
      setPosts(response.data); // Cập nhật đúng state với dữ liệu nhận được
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (id) => {
    try {
      const response = await post("/post/delete", { id: id }, auth.token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <HeaderBarPlus title={"Bài viết"} back={() => navigation.goBack()} plus={() => navigation.navigate("LessorAddPost")} />
      <View style={{ padding: 10 }}>
        {posts && posts.length > 0 ? (
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <Pressable style={{ padding: 10, marginVertical: 5, borderWidth: 1, borderRadius: 10, position: "relative" }}>
                <Pressable
                  style={{
                    backgroundColor: COLOR.black,
                    position: "absolute",
                    top: 5,
                    right: 5,
                    width: 25,
                    height: 25,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                  }}
                  onPress={async () => {
                    await deletePost(item.id);
                    await fetchData();
                  }}
                >
                  <FontAwesome6 name="x" size={14} color={COLOR.white} />
                </Pressable>
                <Text style={{ fontSize: 17, fontWeight: "bold", marginBottom: 5 }}>{item.title}</Text>
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
            )}
          />
        ) : (
          <Text>Không có dữ liệu</Text>
        )}
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
});

export default LessorPostListScreen;
