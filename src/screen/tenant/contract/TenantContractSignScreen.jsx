import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import HeaderBarNoPlus from "../../../components/header/HeaderBarNoPlus";
import { OtpInput } from "react-native-otp-entry";
import { COLOR } from "../../../constants/COLORS";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../../../hook/AuthProvider";
import { useLoading } from "../../../hook/LoadingProvider";
import { get, post } from "../../../api/ApiManager";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import LoadingModal from "react-native-loading-modal";

const TenantContractSignScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const load = useLoading();

  const contractId = route.params.id;

  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [otp, setOpt] = useState(null);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Xóa timer khi component bị unmount
  }, [timeLeft]);

  useEffect(() => {
    retryOtp();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const retryOtp = async () => {
    try {
      setTimeLeft(5 * 60);
      load.isLoading();
      await get("/rental-service/contract/get-otp/" + contractId, {}, auth.token);

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "Vui lòng kiểm tra mail của bạn",
        title: "Thông báo",
      });
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  const confirmOtp = async () => {
    try {
      load.isLoading();
      await post(
        "/rental-service/contract/sign",
        {
          contractId: contractId,
          otp: otp,
        },
        auth.token,
      );

      navigation.navigate("SignSuccess");
    } catch (error) {
      console.log(error);
    } finally {
      load.nonLoading();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <LoadingModal modalVisible={load.loading} />
      <HeaderBarNoPlus title={"Quay lại"} back={() => navigation.goBack()} />
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: "center", marginTop: 30, fontSize: 20, fontWeight: "bold", color: COLOR.primary }}>Ký hợp đồng</Text>
        <View style={{ flex: 1, padding: 20, marginTop: 50, flexDirection: "column", justifyContent: "space-between" }}>
          <View>
            <View>
              <OtpInput numberOfDigits={6} focusColor={COLOR.primary} onTextChange={(t) => setOpt(t)} focusStickBlinkingDuration={500} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, padding: 5 }}>
              <View>
                <Text style={{ fontWeight: "bold", color: COLOR.primary }}>{formatTime(timeLeft)}</Text>
              </View>
              <Pressable onPress={retryOtp}>
                <Text>
                  Bạn chưa nhận được? <Text style={{ fontWeight: "bold", color: COLOR.primary }}>Thử lại</Text>
                </Text>
              </Pressable>
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={confirmOtp}>
              <Text
                style={{
                  textAlign: "center",
                  marginBottom: 20,
                  padding: 10,
                  backgroundColor: COLOR.primary,
                  color: COLOR.white,
                  fontWeight: "bold",
                  borderRadius: 10,
                }}
              >
                Xác nhận
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default TenantContractSignScreen;
