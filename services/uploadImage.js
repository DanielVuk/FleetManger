import axios from "axios";
import { UPLOAD_PRESET, CLOUD_NAME } from "@env";

const uploadImage = async (photo) => {
  if (!photo) return;

  const filename = photo.split("/").pop();
  const fileType = filename.split(".").pop();

  const data = new FormData();
  data.append("file", {
    uri: photo,
    type: `image/${fileType}`,
    name: filename,
  });
  data.append("upload_preset", process.env.UPLOAD_PRESET);
  data.append("cloud_name", process.env.CLOUD_NAME);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Slika uploadana uspješno: ", res.data.secure_url);
    return res.data.secure_url;
  } catch (error) {
    console.error("Greška pri uploadu slike: ", error);
    throw error;
  }
};

export { uploadImage };
