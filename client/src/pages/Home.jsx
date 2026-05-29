import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, User, LogIn, Store, UserPlus } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const foodCards = [
    {
      title: "Italian Pizza",
      desc: "Cheesy • Crispy • Trending",
      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    },
    {
      title: "Loaded Burger",
      desc: "Juicy • Viral • Delicious",
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    },
    {
      title: "Healthy Bowl",
      desc: "Fresh • Organic • Healthy",
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-red-700/20 blur-3xl" />

      <div className="absolute top-1/2 -right-40 size-96 rounded-full bg-red-500/10 blur-3xl" />

      <div className="absolute bottom-0 left-1/2 size-96 -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 md:px-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-linear-to-br from-red-700 to-red-500 text-xl font-bold shadow-lg shadow-red-500/20">
            Z
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide">ZomotoReel</h1>

            <p className="text-xs text-gray-400">Food • Reels • Discover</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={() => navigate("/user/login")}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-5
              py-2.5
              text-sm
              font-medium
              transition-all
              duration-300
              hover:border-red-500/40
              hover:bg-white/10
            "
          >
            <LogIn size={16} />
            User Login
          </button>

          <button
            onClick={() => navigate("/user/signup")}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-linear-to-r
              from-red-700
              to-red-500
              px-5
              py-2.5
              text-sm
              font-semibold
              shadow-lg
              shadow-red-500/20
              transition-all
              duration-300
              hover:scale-[1.03]
            "
          >
            <UserPlus size={16} />
            User Signup
          </button>
        </div>

        {/* Burger Menu */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="
            flex
            size-11
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-red-500/40
            hover:bg-white/10
            md:hidden
          "
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`
          fixed
          top-0
          right-0
          z-40
          h-screen
          w-72
          border-l
          border-white/10
          bg-black/70
          p-6
          backdrop-blur-2xl
          transition-all
          duration-500
          md:hidden
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="mt-20 flex flex-col gap-4">
          <button
            onClick={() => handleNavigate("/user/login")}
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-5
              py-4
              text-left
              transition-all
              duration-300
              hover:border-red-500/40
              hover:bg-white/10
            "
          >
            <LogIn size={18} />
            User Login
          </button>

          <button
            onClick={() => handleNavigate("/user/signup")}
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              bg-linear-to-r
              from-red-700
              to-red-500
              px-5
              py-4
              font-semibold
              transition-all
              duration-300
              hover:scale-[1.02]
            "
          >
            <UserPlus size={18} />
            User Signup
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="
            fixed
            inset-0
            z-30
            bg-black/50
            backdrop-blur-sm
            md:hidden
          "
        />
      )}

      {/* Hero Section */}
      <section className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
        {/* Badge */}
        <div
          className="
            mb-6
            rounded-full
            border
            border-red-500/20
            bg-red-500/10
            px-5
            py-2
            text-sm
            tracking-wide
            text-red-300
            backdrop-blur-xl
          "
        >
          🍔 India's Modern Food Reel Platform
        </div>

        {/* Heading */}
        <h1
          className="
            max-w-5xl
            text-5xl
            font-black
            leading-tight
            tracking-tight
            md:text-7xl
          "
        >
          Discover Food Through
          <span className="bg-linear-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            {" "}
            Short Reels
          </span>
        </h1>

        {/* Description */}
        <p
          className="
            mt-6
            max-w-2xl
            text-lg
            leading-relaxed
            text-gray-400
          "
        >
          Explore trending restaurants, viral dishes, and authentic food
          experiences through short engaging videos.
        </p>

        {/* Food Cards */}
        <div className="mt-16 grid w-full max-w-5xl gap-6 md:grid-cols-3">
          {foodCards.map((food, index) => (
            <div
              key={index}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-2xl
              "
            >
              <img
                src={food.img}
                alt={food.title}
                className="
                  h-72
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-110
                "
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <h2 className="text-2xl font-bold">{food.title}</h2>

                <p className="mt-1 text-sm text-gray-300">{food.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Section */}
        <div className="mt-24 grid w-full max-w-5xl gap-6 md:grid-cols-2">
          {/* Partner Card */}
          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-8
              text-left
              backdrop-blur-2xl
              transition-all
              duration-300
              hover:border-red-500/30
              hover:bg-white/10
            "
          >
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-red-700 to-red-500 text-2xl">
              <Store size={28} />
            </div>

            <h2 className="text-2xl font-bold">Restaurant Partners</h2>

            <p className="mt-3 leading-relaxed text-gray-400">
              Upload food reels, showcase your restaurant, and attract customers
              through engaging short videos.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate("/partner/signup")}
                className="
                  flex-1
                  rounded-xl
                  bg-linear-to-r
                  from-red-700
                  to-red-500
                  px-5
                  py-3
                  font-semibold
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                "
              >
                Partner Signup
              </button>

              <button
                onClick={() => navigate("/partner/login")}
                className="
                  flex-1
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-5
                  py-3
                  font-semibold
                  transition-all
                  duration-300
                  hover:border-red-500/40
                  hover:bg-white/10
                "
              >
                Partner Login
              </button>
            </div>
          </div>

          {/* Features Card */}
          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-8
              backdrop-blur-2xl
            "
          >
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-red-500 text-2xl">
              <User size={28} />
            </div>

            <h2 className="text-2xl font-bold">For Food Lovers</h2>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 size-2 rounded-full bg-red-500" />
                <p className="text-gray-400">
                  Watch trending food reels instantly
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 size-2 rounded-full bg-red-500" />
                <p className="text-gray-400">
                  Discover nearby restaurants & cafes
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 size-2 rounded-full bg-red-500" />
                <p className="text-gray-400">
                  Save and share your favorite food spots
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="
          relative
          z-10
          mt-24
          border-t
          border-white/10
          bg-white/5
          backdrop-blur-2xl
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            items-center
            justify-between
            gap-6
            px-6
            py-8
            text-center
            md:flex-row
            md:px-12
            md:text-left
          "
        >
          {/* Footer Logo */}
          <div>
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div
                className="
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-2xl
                  bg-linear-to-br
                  from-red-700
                  to-red-500
                  text-lg
                  font-bold
                "
              >
                Z
              </div>

              <div>
                <h2 className="text-lg font-bold tracking-wide">ZomotoReel</h2>

                <p className="text-xs text-gray-400">Food • Reels • Discover</p>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              Discover trending food spots, viral dishes, and restaurants
              through engaging short reels.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col gap-3 text-sm">
            <button
              onClick={() => navigate("/user/login")}
              className="
                text-gray-400
                transition-colors
                duration-300
                hover:text-red-400
              "
            >
              User Login
            </button>

            <button
              onClick={() => navigate("/user/signup")}
              className="
                text-gray-400
                transition-colors
                duration-300
                hover:text-red-400
              "
            >
              User Signup
            </button>

            <button
              onClick={() => navigate("/partner/login")}
              className="
                text-gray-400
                transition-colors
                duration-300
                hover:text-red-400
              "
            >
              Partner Login
            </button>

            <button
              onClick={() => navigate("/partner/signup")}
              className="
                text-gray-400
                transition-colors
                duration-300
                hover:text-red-400
              "
            >
              Partner Signup
            </button>
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          className="
            border-t
            border-white/10
            px-6
            py-5
            text-center
            text-sm
            tracking-wide
            text-gray-500
          "
        >
          © {new Date().getFullYear()} ZomotoReel. All Rights Reserved. Licensed
          & Protected.
        </div>
      </footer>
    </div>
  );
};

export default Home;
