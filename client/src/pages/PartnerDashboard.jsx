import React, { useEffect, useState } from "react";
import { User2Icon, PlusIcon, XIcon } from "lucide-react";

import usePartnerStore from "../store/partner.store.js";
import useFoodStore from "../store/food.store.js";

const PartnerDashboard = () => {
  const [foodData, setFoodData] = useState({
    recipeName: "",
    description: "",
    tags: "",
    file: null,
  });

  const [editData, setEditData] = useState({
    foodId: "",
    recipeName: "",
    description: "",
    tags: "",
  });

  const [openModel, setOpenModel] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const { partner, logout } = usePartnerStore();

  const { partnerFoods, createFood, updateFood, deleteFood, getPartnerFoods } =
    useFoodStore();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await getPartnerFoods();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const foods = partnerFoods || [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFoodData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !foodData.recipeName ||
      !foodData.description ||
      !foodData.tags ||
      !foodData.file
    )
      return;

    await createFood(foodData);

    setFoodData({
      recipeName: "",
      description: "",
      tags: "",
      file: null,
    });

    setOpenModel(false);

    getPartnerFoods();
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();

    if (
      !editData.foodId ||
      !editData.recipeName ||
      !editData.description ||
      !editData.tags
    )
      return;

    await updateFood({
      foodId: editData.foodId,

      recipeName: editData.recipeName,

      description: editData.description,

      tags: editData.tags.split(",").map((t) => t.trim()),
    });

    setEditData({
      foodId: "",
      recipeName: "",
      description: "",
      tags: "",
    });

    setOpenEditModal(false);

    getPartnerFoods();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this reel?")) return;

    await deleteFood(id);

    getPartnerFoods();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-red-950 p-6 relative">
      {/* ADD BUTTON */}

      <button
        onClick={() => setOpenModel(true)}
        className="fixed bottom-10 right-10 z-50 w-16 h-16 rounded-full bg-linear-to-br from-red-400 to-red-800 flex items-center justify-center"
      >
        <PlusIcon className="text-white" />
      </button>

      {/* CREATE MODAL */}

      {openModel && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">
                Upload New Reel 🎥
              </h2>

              <button onClick={() => setOpenModel(false)}>
                <XIcon className="text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="recipeName"
                value={foodData.recipeName}
                onChange={handleChange}
                placeholder="Recipe Name"
                className="w-full bg-zinc-800 text-white p-3 rounded-xl"
              />

              <textarea
                name="description"
                value={foodData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full bg-zinc-800 text-white p-3 rounded-xl"
              />

              <input
                name="tags"
                value={foodData.tags}
                onChange={handleChange}
                placeholder="pizza, burger"
                className="w-full bg-zinc-800 text-white p-3 rounded-xl"
              />

              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setFoodData((prev) => ({
                    ...prev,
                    file: e.target.files[0],
                  }))
                }
                className="w-full bg-zinc-800 text-white p-3 rounded-xl border border-amber-50/20 "
              />

              <button className="w-full bg-red-600 text-white p-3 rounded-xl">
                Upload
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}

      {openEditModal && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">Edit Reel ✏️</h2>

              <button onClick={() => setOpenEditModal(false)}>
                <XIcon className="text-white" />
              </button>
            </div>

            <form onSubmit={handleUpdateFood} className="space-y-4">
              <input
                value={editData.recipeName}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    recipeName: e.target.value,
                  }))
                }
                className="w-full bg-zinc-800 text-white p-3 rounded-xl"
              />

              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full bg-zinc-800 text-white p-3 rounded-xl"
              />

              <input
                value={editData.tags}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    tags: e.target.value,
                  }))
                }
                className="w-full bg-zinc-800 text-white p-3 rounded-xl"
              />

              <button className="w-full bg-red-600 text-white p-3 rounded-xl">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {partner?.avatar ? (
            <img src={partner.avatar} className="w-14 h-14 rounded-full" />
          ) : (
            <User2Icon className="text-white" />
          )}

          <h1 className="text-white text-3xl font-bold">
            {partner?.fullName || "Partner"}
          </h1>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-5 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-white/10 rounded-2xl overflow-hidden"
            >
              <video
                src={food.recipeVideo}
                autoPlay
                muted
                className="w-full h-64 object-cover"
              />

              <div className="p-5">
                <h2 className="text-white text-xl">{food.recipeName}</h2>

                <p className="text-gray-400">{food.description}</p>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleDelete(food._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => {
                      setEditData({
                        foodId: food._id,

                        recipeName: food.recipeName,

                        description: food.description,

                        tags: food.tags?.join(",") || "",
                      });

                      setOpenEditModal(true);
                    }}
                    className="bg-zinc-700 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;
