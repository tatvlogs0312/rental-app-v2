import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import LoadingModal from "react-native-loading-modal";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { witdhScreen } from "../../../utils/Utils";
import { COLOR } from "../../../constants/COLORS";
import { color } from "@rneui/base";
import { Text } from "react-native";
import { useState } from "react";

const data = [
  {
    name: "Trống",
    population: 6,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Đã cho thuê",
    population: 10,
    color: "#F00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
];

const data2 = [
  {
    name: "Chưa gửi",
    population: 6,
    color: COLOR.lightBlue,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Chờ thanh toán",
    population: 10,
    color: COLOR.lightGreen,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },

  {
    name: "Đã thanh toán",
    population: 100,
    color: COLOR.lightYellow,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
];

const StatisticalScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const [room, setRoom] = useState();
  const [bill, setBill] = useState();

   

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <LoadingModal modalVisible={load.loading} />
      <HeaderBarNoPlus title={"Thống kê"} back={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, margin: 10 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Biểu đồ phòng</Text>
          <PieChart
            data={data}
            width={witdhScreen - 20}
            height={220}
            accessor={"population"}
            backgroundColor={"transparent"}
            absolute
            chartConfig={{
              backgroundGradientFrom: "#1E2923",
              backgroundGradientFromOpacity: 0,
              backgroundGradientTo: "#08130D",
              backgroundGradientToOpacity: 0.5,
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              strokeWidth: 2, // optional, default 3
              barPercentage: 0.5,
              useShadowColorFromDataset: false, // optional
            }}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Biểu đồ hóa đơn</Text>
          <PieChart
            data={data2}
            width={witdhScreen - 20}
            height={220}
            accessor={"population"}
            backgroundColor={"transparent"}
            absolute
            chartConfig={{
              backgroundGradientFrom: "#1E2923",
              backgroundGradientFromOpacity: 0,
              backgroundGradientTo: "#08130D",
              backgroundGradientToOpacity: 0.5,
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              strokeWidth: 2, // optional, default 3
              barPercentage: 0.5,
              useShadowColorFromDataset: false, // optional
            }}
          />
        </View>

        <View style={{ marginBottom: 0 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>Hóa đơn hàng năm</Text>
          <LineChart
            data={{
              labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
              datasets: [
                {
                  data: [4, 2, 3, 2, 15, 6, 2.5, 9, 4.5, 3, 11, 15],
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  strokeWidth: 1, // Độ dày đường
                },
              ],
            }}
            width={witdhScreen - 20}
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff", // Màu nền tổng thể
              backgroundGradientFrom: "#ffffff", // Màu gradient từ
              backgroundGradientTo: "#ffffff", // Màu gradient đến
              decimalPlaces: 2, // Số chữ số thập phân
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu chữ trục X, Y
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu label
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "5", // Kích thước điểm
                strokeWidth: "2", // Độ dày viền
                stroke: "#000000", // Màu viền điểm
              },
              propsForBackgroundLines: {
                stroke: "#d3d3d3", // Màu các đường grid
                strokeDasharray: "4", // Kiểu nét đứt
              },
            }}
            bezier // Làm mượt đường biểu đồ
            style={{
              marginVertical: 8,
              borderRadius: 16,
              elevation: 3, // Đổ bóng
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          />
          <View style={styles.header}>
            <TouchableOpacity>
              <Text style={styles.arrow}>&lt;</Text>
            </TouchableOpacity>
            <Text style={styles.yearText}>{"2025"}</Text>
            <TouchableOpacity>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    // width: "60%",
    marginBottom: 20,
  },
  arrow: {
    fontSize: 25,
    padding: 5,
    fontWeight: "bold",
    color: "#333",
  },
  yearText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default StatisticalScreen;
