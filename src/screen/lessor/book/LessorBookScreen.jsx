import React, { useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { get, post } from "../../../api/ApiManager";
import { TouchableOpacity } from "react-native";
import { COLOR } from "../../../constants/COLORS";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { Calendar } from "react-native-calendars";
import { getCurrentDate } from "../../../utils/Utils";
import NoData from "../../../components/NoData";

const LessorBookScreen = ({ navigation }) => {
  const auth = useAuth();
  const load = useLoading();

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [date, setDate] = useState(getCurrentDate());
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10000);

  const [books, setBooks] = useState([]);

  const [dateWatchs, setDateWatchs] = useState({});
  const [dateSelect, setDateSelect] = useState({ [date]: { selected: true, selectedColor: COLOR.darkBlue } });

  useEffect(() => {
    if (auth.token !== "") {
      fetchData();
      getBookInMonth();
    }
  }, [auth.token]);

  useEffect(() => {
    setDateSelect({ [date]: { selected: true, selectedColor: COLOR.darkBlue } });
    fetchData();
  }, [date]);

  useEffect(() => {
    getBookInMonth();
  }, [month, year]);

  const fetchData = async () => {
    try {
      const data = await post("/book/search-for-lessor", { date: date, status: status, page: page, size: size }, auth.token);
      setBooks(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBookInMonth = async () => {
    try {
      const data = await get("/book/get-book-in-month", { month: month, year: year }, auth.token);

      const result = {};
      data.forEach((date) => {
        result[date] = {
          marked: true,
          dotColor: "red",
        };
      });

      setDateWatchs(result);
    } catch (error) {
      console.log(error);
    }
  };

  const SeachBar = () => {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => navigation.goBack()} style={{ marginHorizontal: 5 }}>
            <FontAwesome6 name="arrow-left" size={20} color="#7e8c99" />
          </Pressable>
          <Text style={{ marginLeft: 10, fontSize: 18 }}>Danh sách lịch xem phòng</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <SeachBar />
      <View>
        <Calendar
          onMonthChange={(val) => {
            setMonth(val.month);
            setYear(val.year);
          }}
          onDayPress={(day) => setDate(day.dateString)}
          markedDates={{ ...dateSelect, ...dateWatchs }}
        />
        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 20 }}>
          <FontAwesome6 name="circle" color={"red"} solid />
          <Text style={{ marginLeft: 5 }}>Có lịch xem phòng</Text>
        </View>
      </View>

      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, color: COLOR.darkBlue, fontWeight: "700" }}>{"Lịch xem phòng ngày " + date + ": "}</Text>
        </View>
        {books.length > 0 ? (
          <FlatList
            data={books}
            renderItem={({ item }) => {
              return (
                <View style={{ marginVertical: 5, padding: 20, backgroundColor: COLOR.light, borderRadius: 20 }}>
                  <View>
                    <View style={{ borderBottomWidth: 0.5, marginBottom: 10 }}>
                      <Text style={{ fontSize: 15, fontWeight: "600", color: COLOR.darkBlue }}>{" Phòng: " + item.roomCode + " - " + item.position}</Text>
                    </View>
                    <View>
                      <Text>
                        <FontAwesome6 name="user" size={15} />
                        {"  Người xem: " + item.tenantFirstName + " " + item.tenantLastName}
                      </Text>
                      <Text style={{ marginVertical: 5 }}>
                        <FontAwesome6 name="phone" size={15} />
                        {"  Số điện thoại người xem: " + item.tenantPhoneNumber}
                      </Text>
                      <Text>
                        <FontAwesome6 name="clock" size={15} />
                        {"  Thời gian xem: " + item.dateWatch}
                      </Text>
                    </View>
                  </View>
                  {/* <View>
                  <Text>Đồng ý</Text>
                </View> */}
                </View>
              );
            }}
          />
        ) : (
          <NoData message={"Không có lịch xem phòng"} />
        )}
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

  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f1f1f5",
    padding: 10,
    // borderRadius: 15,
    // margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default LessorBookScreen;
