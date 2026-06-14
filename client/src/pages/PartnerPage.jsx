import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {ArrowLeftIcon} from "lucide-react"

import useFoodStore from "../store/food.store.js";

import {Link} from "react-router-dom"

const PartnerPage = () => {
  const { id } = useParams();

  const { partnerFoods, getPartnerFoods } = useFoodStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        setLoading(true);

        await getPartnerFoods(id);
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, [id]);

  const foods = partnerFoods || [];

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-red-950 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <Link to={"/user/dashboard"}>
          <ArrowLeftIcon className="text-white mb-3"/>
        </Link>
        <h1 className="text-white text-4xl font-bold">Partner Store</h1>

        <p className="text-gray-400 mt-2">Explore delicious reels</p>
      </div>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : foods.length === 0 ? (
        <div className="text-gray-400">No food available</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div
              key={food._id}
              className="
              bg-white/10
              backdrop-blur-xl
              border
              border-white/10
              rounded-3xl
              overflow-hidden
              "
            >
              <video
                src={food.recipeVideo}
                className="w-full h-80 object-cover"
                autoPlay
                muted
              />

              <div className="p-5">
                <h2 className="text-white text-xl font-bold">
                  {food.recipeName}
                </h2>

                <p className="text-gray-400 mt-2">{food.description}</p>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {food.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="
                      bg-red-500/20
                      text-red-300
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      "
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerPage;
