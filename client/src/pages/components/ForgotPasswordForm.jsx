import React from "react";

import { ArrowBigLeftDash, ArrowBigLeft, ArrowLeft } from "lucide-react";

import Loading from "./utils/Loading.jsx";

const ForgotPasswordForm = ({ email, setEmail, handleSubmit, isLoading }) => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-4">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 size-80 rounded-full bg-red-700/30 blur-3xl" />
      <div className="absolute -right-32 -bottom-32 size-80 rounded-full bg-red-500/20 blur-3xl" />

      {/* Glass Card */}
      <div
        className="
          relative
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-8
          shadow-2xl
          backdrop-blur-2xl
        "
      >
        <div
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-200 cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft size={24} />
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-wide text-white">
            Forgot Password
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Enter your email address and we’ll send you a password reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm tracking-wide text-gray-300"
            >
              Email Address
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                text-white
                outline-none
                transition-all
                duration-300
                placeholder:text-gray-500
                focus:border-red-500/60
                focus:bg-white/10
              "
            />
          </div>

          {/* Submit Button */}
          
            <button
              type="submit"
              className="
              w-full
              flex 
              items-center
              justify-center
              rounded-xl
              bg-linear-to-r
              from-red-700
              to-red-500
              px-4
              py-3
              font-semibold
              tracking-wider
              text-white
              transition-all
              duration-300
              hover:scale-[1.02]
              active:scale-[0.98]
            "
            disabled={isLoading}
            >
              {isLoading ? "Sending..." : "SEND RESET LINK"}
            </button>
         
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
