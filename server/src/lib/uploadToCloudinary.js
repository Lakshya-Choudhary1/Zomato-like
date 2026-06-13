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

    const result = await cloudinary.v2.uploader.upload(image.path, {
      resource_type: "image",
      folder: "zomoto/avatars",
    });

    return result.secure_url;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

