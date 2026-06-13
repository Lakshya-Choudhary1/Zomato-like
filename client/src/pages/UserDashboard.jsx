import React, { useEffect, useRef, useState, useCallback } from "react";
import useUserStore from "../store/user.store.js";
import useFoodStore from "../store/food.store.js";

const TAGS = ["all", "pizza", "burger", "healthy", "dessert", "drinks"];

const UserDashboard = () => {
  const [selectedTag, setSelectedTag] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const observerRef = useRef(null);

  const { logout } = useUserStore();
  const { foods, getFoodFeed, pagination } = useFoodStore();

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= TAG CHANGE =================
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setShowFilters(false);
    setPage(1);
  };

  // ================= INITIAL + TAG LOAD =================
  useEffect(() => {
    getFoodFeed({
      tag: selectedTag,
      page: 1,
      limit: 10,
    });
  }, [selectedTag]);

  // ================= LOAD MORE =================
  const loadMore = () => {
    if (!pagination?.hasNextPage) return;

    const nextPage = page + 1;
    setPage(nextPage);

    getFoodFeed({
      tag: selectedTag,
      page: nextPage,
      limit: 10,
    });
  };

  // ================= INFINITE SCROLL =================
  const lastFoodRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [page, pagination],
  );

  return (
    <div className="min-h-screen w-full bg-black flex justify-center">
      {/* MOBILE FRAME */}
      <div className="relative w-full max-w-md h-screen overflow-hidden bg-black">
        {/* ================= NAVBAR ================= */}
        <header className="absolute top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-bold text-white">
              Food<span className="text-red-500">Reels</span>
            </h1>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* ================= FILTER ================= */}
        <div className="absolute top-20 right-4 z-50 w-fit ">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className=" flex justify-between gap-4 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
          >
            <span>Filter</span>
            <span className="text-red-400 capitalize">{selectedTag}</span>
          </button>

          {showFilters && (
            <div className="mt-2 w-full flex flex-col gap-2 rounded-xl bg-black/80 border border-white/10 p-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={` text-left px-3 py-2 rounded-lg text-sm capitalize ${
                    selectedTag === tag
                      ? "bg-red-500 text-white"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= FEED ================= */}
        <main className="h-screen scrollbar-none overflow-y-scroll snap-y snap-mandatory">
          {foods.length == 0 ? (
            <div className="relative h-screen w-full flex  items-center justify-center text-gray-500">
              No more reels
            </div>
          ) : (
            foods?.map((e, idx) => {
              const isLast = idx === foods.length - 1;

              return (
                <section
                  key={e._id || idx}
                  ref={isLast ? lastFoodRef : null}
                  className="relative h-screen w-full snap-start"
                >
                  <video
                    src={e.recipeVideo}
                    className="h-full w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  {/* CONTENT */}
                  <div className="absolute bottom-6 left-4 right-4">
                    <p className="text-white text-md mb-1 ">{e.recipeName}</p>
                    <p className="text-white text-sm mb-4 line-clamp-2">
                      {e.description}
                    </p>

                    <button className="w-full py-3 rounded-2xl bg-red-500/90 text-white font-semibold">
                      Visit Store
                    </button>
                  </div>
                </section>
              );
            })
          )}

          {/* END */}
          {!pagination?.hasNextPage && foods?.length > 0 && (
            <div className="flex h-20 items-center justify-center text-gray-500">
              No more reels
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
