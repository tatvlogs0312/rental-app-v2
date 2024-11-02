import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { post } from "../../../api/ApiManager";
import { COLOR } from "../../../constants/COLORS";
import { TouchableOpacity } from "react-native";

const TenantBookScreen = ({ navigation }) => {
  const auth = useAuth();
  const load = useLoading();

  const [books, setBooks] = useState([]);

  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [status]);

  const handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height >= event.nativeEvent.contentSize.height) {
      setPage(page + 1);
      fetchDataPage();
    }
  };

  const fetchData = async () => {
    setPage(0);
    setSize(10);

    try {
      const data = await post("/book/search-for-tenant", { status: status, page: page, size: size }, auth.token);
      setBooks(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataPage = async () => {
    try {
      const data = await post("/book/search-for-tenant", { status: status, page: page, size: size }, auth.token);
      setPosts([...books, ...data.data]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ backgroundColor: "white", minHeight: "100%" }}>
      <View style={{ marginVertical: 20 }}>
        <Text style={{ padding: 5, textAlign: "center", fontSize: 20, fontWeight: "600", color: COLOR.lightBlue }}>Lịch xem phòng của bạn</Text>
      </View>
      <View style={{ marginHorizontal: 10, marginVertical: 5 }}>
        <View style={{ marginBottom: 10 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={() => setStatus(null)}>
              <Text style={styles.status}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStatus("BOOKED")}>
              <Text style={styles.status}>Đã đặt</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStatus("ACCEPT")}>
              <Text style={styles.status}>Chấp nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStatus("REJECT")}>
              <Text style={styles.status}>Từ chối</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStatus("CANCEL")}>
              <Text style={styles.status}>Hủy</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={{ marginVertical: 10 }}>
          {books.length > 0 ? (
            <FlatList
              data={books}
              renderItem={(data) => (
                <View style={{ margin: 5, padding: 10, borderWidth: 1, borderRadius: 10, borderColor: COLOR.lightBlue }}>
                  <View>
                    <Text style={{ fontSize: 17, marginBottom: 2, color: COLOR.lightBlue }}>
                      <View></View>
                      {data.item.position + " - " + data.item.ward + " - " + data.item.district + " - " + data.item.province}
                    </Text>
                  </View>
                  <View>
                    <Text>{"Thời gian: " + data.item.dateWatch}</Text>
                    <Text>{"Liên hệ: " + data.item.lessorFirstName + " " + data.item.lessorLastName + " - " + data.item.lessorPhoneNumber}</Text>
                    <Text>{"Trạng thái: " + data.item.bookStatus}</Text>
                    {data.item.bookingMessage && <Text>{"Lưu ý: " + data.item.bookingMessage}</Text>}
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={{ textAlign: "center" }}>Không có dữ liệu</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  status: {
    width: 120,
    padding: 5,
    borderWidth: 1,
    borderColor: COLOR.lightBlue,
    textAlign: "center",
    borderRadius: 20,
    color: COLOR.lightBlue,
    marginHorizontal: 2,
  },
});

export default TenantBookScreen;
