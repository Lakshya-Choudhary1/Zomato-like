import React from 'react'

const ResetPasswordForm = ({handleSubmit,password,setPassword , isLoading}) => {

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
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-wide text-white">
            Reset Password
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
              htmlFor="password"
              className="text-sm text-gray-300"
            >
                 New Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-3
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
          

          {/* Reset Button */}
          <button
            type="submit"
            className="
              w-full
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
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordForm
