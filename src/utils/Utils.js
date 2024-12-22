import { Dimensions } from "react-native";
import uuid from "react-native-uuid";
import dayjs from "dayjs";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "VND",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const ConvertToMoney = (value) => {
  return formatter.format(value);
};

export function ConvertToMoneyV2(amount) {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace(/\.0$/, "") + " triệu";
  } else if (amount >= 1_000) {
    return (amount / 1_000).toFixed(1).replace(/\.0$/, "") + " nghìn";
  } else {
    return amount + " đồng";
  }
}

// Dùng khi hiển thị
export function ConvertMoneyV3(amount) {
  if (amount !== null && amount !== undefined && amount !== "") {
    // Chuyển chuỗi thành số, loại bỏ các ký tự không phải số
    const numericAmount = parseInt(amount, 10) || 0;

    const res = numericAmount
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
      })
      .replace("₫", "")
      .trim();

    return res;
  }
  return "";
}

// Dùng khi nhập
export function ConvertMoneyV4(amount) {
  if (amount !== null && amount !== undefined && amount !== "") {
    // Chuyển chuỗi thành số, loại bỏ các ký tự không phải số
    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;

    const res = numericAmount
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
      })
      .replace("₫", "")
      .trim();
    return res;
  }
  return "";
}

export const TimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diff = now - past; // tính toán sự chênh lệch về thời gian (miliseconds)

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} năm trước`;
  } else if (months > 0) {
    return `${months} tháng trước`;
  } else if (weeks > 0) {
    return `${weeks} tuần trước`;
  } else if (days > 0) {
    return `${days} ngày trước`;
  } else if (hours > 0) {
    return `${hours} giờ trước`;
  } else if (minutes > 0) {
    return `${minutes} phút trước`;
  } else {
    return `${seconds} giây trước`;
  }
};

export const witdhScreen = Dimensions.get("window").width;

export const heighScreen = Dimensions.get("window").height;

export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const toMoneyDot = (number) => {
  if (number === null || number === undefined || isNaN(number) || number === "") {
    return null;
  }
  return Number(number).toLocaleString("de-DE");
};

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Thêm '0' nếu dưới 10
  const day = String(today.getDate()).padStart(2, "0"); // Thêm '0' nếu dưới 10
  return `${year}-${month}-${day}`;
};

export const getUUID = () => {
  return uuid.v4();
};

export const convertDate = (date, format) => {
  if (date === null) {
    return "";
  }
  return dayjs(date).format(format);
};
