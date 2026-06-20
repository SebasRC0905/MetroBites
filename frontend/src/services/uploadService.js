import api from "../api/axios";

const uploadImage = async (file) => {

  const formData = new FormData();

  formData.append(
    "imagen",
    file
  );

  const response =
    await api.post(
      "/uploads",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data"
        }
      }
    );

  return response.data;
};

export default {
  uploadImage
};