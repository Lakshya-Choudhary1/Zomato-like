import React from "react";

import {ArrowLeft} from "lucide-react";
import { Link } from "react-router-dom";

const EmailVerificationForm = ({
  handleSubmit,
  verificationToken,
  setVerificationToken,
  handleResendCode,
  isLoading
}) => {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute -top-30 -left-30 size-72 rounded-full bg-red-700/30 blur-3xl" />
      <div className="absolute -bottom-30 -right-30 size-72 rounded-full bg-red-500/20 blur-3xl" />

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
          backdrop-blur-2xl
          shadow-2xl
          p-8
        "
      >
        <Link to="/">
          <ArrowLeft className="text-white" />
        </Link>
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-wide text-white">
            Verify Email
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Verification Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="verificationToken"
              className="text-sm text-gray-300"
            >
              Verification Code
            </label>

            <input
              type="text"
              id="verificationToken"
              placeholder="Enter verification code"
              required
              value={verificationToken}
              onChange={(e) =>
                setVerificationToken(e.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
                text-center
                text-lg
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
          
          <div className="flex items-center gap-3 py-1 mt-4 ">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs text-gray-400">
                              Didn't receive the code?
                    </span>
                    <button
                         type="button"
                         className="text-xs text-red-500 hover:underline cursor-pointer tracking-wider"
                         onClick={() => handleResendCode()}
                    >
                              Resend Code
                    </button>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="
              w-full
              text-center
              rounded-xl
              bg-linear-to-r
              from-red-700
              to-red-500
              py-3
              font-semibold
              tracking-wide
              text-white
              transition-all
              duration-300
              hover:scale-[1.02]
              active:scale-[0.98]
            "
            disabled={isLoading || verificationToken.length === 0}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerificationForm;