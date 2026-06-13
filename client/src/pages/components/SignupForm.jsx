import React from "react";

import {ArrowLeft} from "lucide-react";
import { Link } from "react-router-dom";

const SignupForm = ({
  fullName,
  email,
  password,
  setFullName,
  setEmail,
  setPassword,
  googleAuthUrl,
  handleSubmit,
  loginUrl,
  forgotPasswordUrl,
  isLoading
}) => {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center  overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute -top-30 -left-30 w-72 h-72 bg-red-700/40 blur-3xl rounded-full" />
      <div className="absolute -bottom-30 -right-30 w-72 h-72 bg-red-500/30 blur-3xl rounded-full" />

      {/* Glass Card */}
      <div
        className="
          relative
          w-full
          max-w-md
          border-white/10
          bg-white/5
          backdrop-blur-2xl
          shadow-2xl
          rounded-3xl
          p-8
        "
      >
        <Link to="/">
          <ArrowLeft className="text-white" />
        </Link>

        <h1
          className="
            text-4xl
            font-bold
            text-center
            text-white
            mb-8
            tracking-wide
          "
        >
          Create Account
        </h1>

        <form className="space-y-6">
          
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="fullName"
              className="text-gray-300 text-sm"
            >
              Full Name
            </label>

            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-white/10
                border border-white/10
                text-white
                placeholder:text-gray-400
                outline-none
                focus:border-red-500
                focus:ring-2
                focus:ring-red-500/40
                transition-all
                duration-300
              "
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-gray-300 text-sm"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-white/10
                border border-white/10
                text-white
                placeholder:text-gray-400
                outline-none
                focus:border-red-500
                focus:ring-2
                focus:ring-red-500/40
                transition-all
                duration-300
              "
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-gray-300 text-sm"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-white/10
                border border-white/10
                text-white
                placeholder:text-gray-400
                outline-none
                focus:border-red-500
                focus:ring-2
                focus:ring-red-500/40
                transition-all
                duration-300
              "
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-xl
              bg-linear-to-r
              from-red-700
              to-red-500
              text-white
              font-semibold
              tracking-wide
              hover:scale-[1.02]
              hover:shadow-red-500/30
              hover:shadow-xl
              active:scale-[0.98]
              transition-all
              duration-300
            "
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>

          <div className="flex items-center  py-1 gap-4">
            <div className="h-px flex-1 bg-white/10 " />
               <span className="text-xs text-red-500 hover:underline cursor-pointer tracking-wider" onClick={() => window.location.href = `${forgotPasswordUrl}`}>
                         Forgot password?
               </span>
          </div>

          
          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-400">
              OR
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google OAuth */}
          <a
            href={googleAuthUrl}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-3
              text-white
              transition-all
              duration-300
              hover:border-red-500/40
              hover:bg-white/10
            "
          >
            {/* Google Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="size-5"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15.3 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.2 7.1l6.2 5.2C39.8 36.5 44 30.8 44 24c0-1.3-.1-2.4-.4-3.5z"
              />
            </svg>

            Continue with Google
          </a>
        </form>

          <div className="flex items-center gap-3 py-1 mt-4">
               <div className="h-px flex-1 bg-white/10" />
               <span className="text-xs text-gray-400">
                     Already have an account?
               </span>
               <span className="text-xs text-red-500 hover:underline cursor-pointer tracking-wider" onClick={() => window.location.href = `${loginUrl}`}>
                         Login 
               </span>
               <div className="h-px flex-1 bg-white/10" />
          </div>

      </div>
    </div>
  );
};

export default SignupForm;