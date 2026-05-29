import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-black">
      <div
        className="
          relative
          animate-spin
          rounded-full
          border-6
          border-solid
          border-red-700
          border-t-transparent
          size-14
        ">
        </div>
    </div>
  );
};

export default Loading;