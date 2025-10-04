import { apiClient2 } from "@/helper/commonHelper";

export const predictDisease = async (payload) => {
  const response = await apiClient2.post("/predict", payload);
  return response;
};

export const getSymptoms = async () => {
  const response = await apiClient2.get("/symptoms");
  return response;
};

export const getDiseaseInfo = async (disease = null) => {
  if (disease) {
    const response = await apiClient2.get(`/disease-info/${disease}`);
    return response;
  }
  const response = await apiClient2.get("/disease-info");
  return response;
};

export const fullConsultation = (imageFile, audioFile = null) => {
  const formData = new FormData();
  
  if (imageFile) {
    formData.append("image", imageFile);
  }
  
  if (audioFile) {
    formData.append("audio", audioFile);
  }

  return apiClient2.post("/ai/full-consultation", formData);
  // Note: Removed explicit Content-Type header - let browser set it automatically
};

export const imageAnalysis = (imageFile, query = null) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  
  if (query) {
    formData.append("query", query);
  }

  return apiClient2.post("/ai/image-analysis", formData);
};

export const transcribeAudio = (audioFile) => {
  const formData = new FormData();
  formData.append("audio", audioFile);

  return apiClient2.post("/ai/transcribe", formData);
};

export const textToSpeech = (payload) => {
  return apiClient2.post("/ai/text-to-speech", payload);
};

export const lifestyleRecommendations = (payload) => {
  return apiClient2.post("/lifestyle-recommendations", payload);
  // Note: Fixed the endpoint - it's /lifestyle-recommendations, not /ai/lifestyle-recommendations
};