import axios from "axios";
import { DOMAIN } from "../constants/URL";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const apiClient = axios.create({
  baseURL: DOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiCall = async (endpoint, method, body, params, token) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...((token !== null) | "" | undefined && { Authorization: `Bearer ${token}` }),
    };

    const response = await apiClient({
      url: endpoint,
      method: method,
      data: body,
      params: params,
      headers: headers,
    });

    return response.data;
  } catch (error) {
    console.log(error.response);

    let errorMessage = "Đã có lỗi xảy ra, vui lòng thử lại sau.";

    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "Network error. Please check your connection.";
    }

    Toast.show({
      type: ALERT_TYPE.DANGER,
      textBody: errorMessage,
      title: "Lỗi",
    });
  }
};

// POST with body
export const post = async (endpoint, body, token) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...((token !== null) | "" | undefined && { Authorization: `Bearer ${token}` }),
    };

    const response = await apiClient({
      url: endpoint,
      method: "POST",
      data: body,
      headers: headers,
    });

    console.log("post: " + JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.log(error.response);

    let errorMessage = "Đã có lỗi xảy ra, vui lòng thử lại sau.";

    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "Network error. Please check your connection.";
    }

    Toast.show({
      type: ALERT_TYPE.DANGER,
      textBody: errorMessage,
      title: "Lỗi",
    });
  }
};

//Get with params
export const get = async (endpoint, params, token) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...((token !== null || "" || undefined) && { Authorization: `Bearer ${token}` }),
    };

    console.log("get: " + endpoint);

    const response = await apiClient({
      url: endpoint,
      method: "GET",
      params: params,
      headers: headers,
    });
    console.log("get: " + response.data);

    return response.data;
  } catch (error) {
    console.log(error.response);

    let errorMessage = "Đã có lỗi xảy ra, vui lòng thử lại sau.";

    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "Network error. Please check your connection.";
    }

    Toast.show({
      type: ALERT_TYPE.DANGER,
      textBody: errorMessage,
      title: "Lỗi",
    });
  }
};
