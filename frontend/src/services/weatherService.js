import api from "../api/axios";

const getCurrentWeather = async () => {
  const response = await api.get("/clima/actual");

  return response.data;
};

export default {
  getCurrentWeather,
};
