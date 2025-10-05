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
  return response;
};
export const logoutUser = async (data) => {
  const response = await apiClient.post("/users/logout");
  return response.data;
};
export const getUser = async (data) => {
  const response = await apiClient.get("/users/get_user");
  return response.data;
};
export const getUnverifiedUsers = async (data) => {
  const response = await apiClient.get("/admin/unverified");
  return response.data;
};
export const updateUserVerification = async (userId) => {
  const response = await apiClient.post(`/admin/verify/${userId}`);
  return response.data;
};
