import { apiClient } from "@/helper/commonHelper";

export const sendEmailOTP = async (data) => {
  const response = await apiClient.post("/users/send-otp", data);
  return response.data;
};

export const verifyEmailOTP = async (data) => {
  const response = await apiClient.post("/users/verify-otp", data);
  return response.data;
};

export const completeAshaRegistration = async (data) => {
  const response = await apiClient.post("/users/complete-asha", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  return response.data;
};

export const registerUser = async (data) => {
  const response = await apiClient.post("/users/create", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await apiClient.post("/users/login", data);
  return response.data;
};
