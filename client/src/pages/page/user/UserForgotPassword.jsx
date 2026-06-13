import React from "react";
import { useNavigate } from "react-router-dom";

import useUserStore from "../../../store/user.store.js";
import ForgotPasswordForm from "../../components/ForgotPasswordForm.jsx";

const UserForgotPassword = () => {
  const [email, setEmail] = React.useState("");

  const { forgotPassword , isLoading} = useUserStore();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await forgotPassword({ email });

    navigate("/");
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-4">
      
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-red-700/20 blur-3xl" />

      <div className="absolute -right-40 -bottom-40 size-96 rounded-full bg-red-500/10 blur-3xl" />

      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[22px_22px]" />

      {/* Forgot Password Form */}
      <div className="relative z-10 w-full">
        <ForgotPasswordForm
          email={email}
          setEmail={setEmail}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default UserForgotPassword;