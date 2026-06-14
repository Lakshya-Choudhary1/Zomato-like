import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axiosInstance.js";
import { SERVER_URL } from "../config/config.js";

const foodStore = create((set, get) => ({
  foods: [],
  homeFeed: [],
  partnerFoods: [],
  selectedFood: null,
  pagination: null,
  isLoading: false,
  

  // ================= CREATE FOOD =================
  createFood: async ({ recipeName, description, tags, file }) => {
    set({ isLoading: true });
    console.log("Creating food with data:", { recipeName,
      description,
      tags,
      file,
    });
    try {
      // 1. Upload video to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "zomoto_upload_reels");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dgozd3fnf/video/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      // 2. Proper error handling
      if (!response.ok || !data.secure_url) {
        throw new Error(data?.error?.message || "Video upload failed");
      }

      const recipeVideo = data.secure_url;

      // 3. Send to backend
      const axiosResponse = await axiosInstance.post("/api/food", {
        recipeName,
        description,
        tags,
        recipeVideo,
      });

      // 4. Update state
      set((state) => ({
        partnerFoods: [axiosResponse.data.food, ...state.partnerFoods],
      }));

      toast.success("Food created successfully");

      return axiosResponse.data.food;
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Failed to create food");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  // ================= GET PARTNER FOODS =================
  getPartnerFoods: async (partnerId) => {
    set({ isLoading: true });

    try {
      const url = partnerId
        ? `/api/food/partner/videos?id=${partnerId}`
        : "/api/food/partner/videos";
        
      const axiosResponse = await axiosInstance.get(url);

      set({
        partnerFoods: axiosResponse.data.foodList,
      });
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch partner foods",
      );
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  // ================= GET HOME FEED =================
  getHomeFeed: async () => {
    set({ isLoading: true });

    try {
      const axiosResponse = await axiosInstance.get("/api/food/home/feed");

      set({
        homeFeed: axiosResponse.data.sections,
      });
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch home feed",
      );
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  // ================= GET FOOD FEED =================
  getFoodFeed: async ({ tag = "all", page = 1, limit = 10 }) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.get(
        `/api/food/feed?tag=${tag}&page=${page}&limit=${limit}`,
      );

      const newFoods = res.data.foods;

      set((state) => ({
        foods: page === 1 ? newFoods : [...state.foods, ...newFoods],

        pagination: res.data.pagination,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ================= GET SINGLE FOOD =================
  getSingleFood: async (foodId) => {
    set({ isLoading: true });

    try {
      const axiosResponse = await axiosInstance.get(`/api/food/${foodId}`);

      set({
        selectedFood: axiosResponse.data.food,
      });

      return axiosResponse.data.food;
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to fetch food");

      return null;
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  // ================= UPDATE FOOD =================
  updateFood: async ({ foodId, recipeName, description, tags }) => {
    set({ isLoading: true });

    try {
      const axiosResponse = await axiosInstance.put(`/api/food/${foodId}`, {
        recipeName,
        description,
        tags,
      });

      const updatedFood = axiosResponse.data.updatedFood;

      set((state) => ({
        partnerFoods: state.partnerFoods.map((food) =>
          food._id === foodId ? updatedFood : food,
        ),

        foods: state.foods.map((food) =>
          food._id === foodId ? updatedFood : food,
        ),

        selectedFood:
          state.selectedFood?._id === foodId ? updatedFood : state.selectedFood,
      }));

      toast.success("Food updated successfully");

      return updatedFood;
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to update food");

      return null;
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  // ================= DELETE FOOD =================
  deleteFood: async (foodId) => {
    set({ isLoading: true });

    try {
      await axiosInstance.delete(`/api/food/${foodId}`);

      set((state) => ({
        partnerFoods: state.partnerFoods.filter((food) => food._id !== foodId),

        foods: state.foods.filter((food) => food._id !== foodId),

        selectedFood:
          state.selectedFood?._id === foodId ? null : state.selectedFood,
      }));

      toast.success("Food deleted successfully");

      return true;
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to delete food");

      return false;
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  // ================= CLEAR SELECTED FOOD =================
  clearSelectedFood: () => {
    set({
      selectedFood: null,
    });
  },
}));

export default foodStore;
