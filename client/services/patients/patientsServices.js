import { apiClient, apiClient2 } from "@/helper/commonHelper";

// export const createPatient = async (payload) => {
//   const response = await apiClient.post("/patients", payload);
//   return response.data;
// };

export const getPatients = (payload) => {
  return apiClient.get("/patients", {
    params: payload,
  });
};

export const getPatient = (id) => {
  return apiClient.get(`/patients/${id}`);
};

export const deletePatient = (id) => {
  return apiClient.delete(`/patients/${id}`);
};

export const updatePatient = (file,id) => {
  const formData = new FormData();
  formData.append("profileImage", file); // name must match FastAPI param

  return apiClient.post(`/patients${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createPatient = (fileData) => {

  return apiClient.post("/patients", fileData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

