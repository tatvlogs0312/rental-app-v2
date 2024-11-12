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
    const fetchData = async () => {
      try {
        const response = await post("/post/search-for-lessor", { page: page, size: size }, auth.token);
        setPosts(response.data); // Cập nhật đúng state với dữ liệu nhận được
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [page, size, auth.token]);

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <View style={{ padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row" }}>
          <Pressable style={styles.icon}>
            <FontAwesome6 name="angle-left" size={25} color={COLOR.white} />
          </Pressable>
          <Text style={{ fontSize: 25, marginLeft: 5 }}>Bài viết</Text>
        </View>
        <Pressable
          style={styles.icon}
          onPress={() => {
            navigation.navigate("LessorAddPost");
          }}
        >
          <FontAwesome6 name="plus" size={25} color={COLOR.white} />
        </Pressable>
      </View>
      <View style={{ padding: 10 }}>
        {posts && posts.length > 0 ? (
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <Pressable style={{ padding: 10, marginVertical: 5, borderWidth: 1, borderRadius: 10 }}>
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
