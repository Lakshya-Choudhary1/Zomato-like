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
  createFood: async (formData) => {
    set({ isLoading: true });

    try {
      const axiosResponse = await axiosInstance.post("/api/food", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        partnerFoods: [axiosResponse.data.food, ...state.partnerFoods],
      }));

      toast.success("Food created successfully");

      return axiosResponse.data.food;
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to create food");

      return null;
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  // ================= GET PARTNER FOODS =================
  getPartnerFoods: async () => {
    set({ isLoading: true });

    try {
      const axiosResponse = await axiosInstance.get("/api/food/partner/videos");

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
  getFoodFeed: async ({ tag = "all", page = 1, limit = 10 } = {}) => {
    set({ isLoading: true });

    try {
      const axiosResponse = await axiosInstance.get(
        `/api/food/feed?tag=${tag}&page=${page}&limit=${limit}`,
      );

      set({
        foods: axiosResponse.data.foods,

        pagination: axiosResponse.data.pagination,
      });
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch food feed",
      );
    } finally {
      set({
        isLoading: false,
      });
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
