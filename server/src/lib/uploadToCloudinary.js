import cloudinary from "cloudinary";
import config from "../config/config.js";

cloudinary.v2.config({
  cloud_name: "dgozd3fnf",
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

//post a image to cloudinary.
export const uploadImageToCloudinary = async (image) => {
  try {
    //convert image to base64
    const base64Image = `data:image/jpeg;base64,${image.toString("base64")}`;

    const result = await cloudinary.v2.uploader.upload(base64Image, {
      resource_type: "image",
      folder: "zomoto/avatars",
    });

    return result.secure_url;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export const uploadVideoToCloudinary = async (video) => {
  try {
    // convert video buffer to base64
    const base64Video = `data:video/mp4;base64,${video.toString("base64")}`;

    const result = await cloudinary.v2.uploader.upload(base64Video, {
      resource_type: "video",
      folder: "zomoto/videos",
    });

    return result.secure_url;
  } catch (error) {
    console.log("Cloudinary Video Upload Error:", error);
    throw new Error("Failed to upload video to Cloudinary");
  }
};
