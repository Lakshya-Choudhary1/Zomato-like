// ================= controllers/food.controller.js =================

import mongoose from "mongoose";

import foodModel from "../models/food.model.js";

import sections from "../config/sections.js";

// ================= CREATE FOOD =================
export const createFood = async (req, res) => {
  try {
    const { recipeName, description, tags, recipeVideo } = req.body;
    const partnerId = req.partnerId;

    // 1. Auth check
    if (!partnerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2. Basic validation
    if (!recipeName?.trim() || !description?.trim() || !recipeVideo?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 3. Safe tag parsing
    let parsedTags = ["all"];

    if (tags) {
      if (typeof tags === "string") {
        parsedTags = tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
      } else if (Array.isArray(tags)) {
        parsedTags = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
      }
    }

    // 4. Create food
    const food = await foodModel.create({
      partnerId,
      recipeName: recipeName.trim(),
      recipeVideo,
      description: description.trim(),
      tags: parsedTags,
    });

    return res.status(201).json({
      success: true,
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ================= GET PARTNER VIDEOS =================
export const getPartnersVideo = async (req, res) => {
  try {
    const partnerId = req.partnerId;

    if (!partnerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const foodList = await foodModel
      .find({ partnerId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      foodList,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ================= GET FOOD FEED =================
export const getFoodFeed = async (req, res) => {
  try {
    let { tag = "all", page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const query = tag !== "all" ? { tags: { $in: [tag.toLowerCase()] } } : {};

    const [foods, totalFoods] = await Promise.all([
      foodModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("recipeName recipeVideo description tags createdAt")
        .lean(),

      foodModel.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      foods,

      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalFoods / limit),
        totalFoods,
        hasNextPage: page * limit < totalFoods,
        hasPrevPage: page > 1,
        hasMore: page * limit < totalFoods,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ================= GET HOME FEED =================
export const getHomeFeed = async (req, res) => {
  try {
    const sectionPromises = sections.map(async (section) => {
      const query =
        section !== "all"
          ? {
              tags: section,
            }
          : {};

      const foods = await foodModel
        .find(query)
        .sort({
          createdAt: -1,
        })
        .limit(10)
        .lean();

      return {
        title: section,
        foods,
      };
    });

    const response = await Promise.all(sectionPromises);

    return res.status(200).json({
      success: true,
      sections: response,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ================= GET SINGLE FOOD =================
export const getSingleFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food id",
      });
    }

    const food = await foodModel.findById(foodId).lean();

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    return res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ================= UPDATE FOOD =================
export const updateFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    const { recipeName, description, tags } = req.body;

    const parsedTags =
      typeof tags === "string"
        ? tags.split(",").map((tag) => tag.trim().toLowerCase())
        : undefined;

    const updatedFood = await foodModel.findOneAndUpdate(
      {
        _id: foodId,
        partnerId: req.partnerId,
      },
      {
        recipeName,
        description,
        tags: parsedTags,
      },
      {
        new: true,
      },
    );

    if (!updatedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food updated successfully",
      updatedFood,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ================= DELETE FOOD =================
export const deleteFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    const deletedFood = await foodModel.findOneAndDelete({
      _id: foodId,
      partnerId: req.partnerId,
    });

    if (!deletedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
