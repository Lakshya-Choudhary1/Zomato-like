import React from "react";

import { SERVER_URL } from "../../../config/config.js";
import LoginForm from "../../components/LoginForm.jsx";
import useUserStore from "../../../store/user.store.js";


const UserLogin = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const googleAuthUrl = `${SERVER_URL}/api/user/google`;
  const signupUrl = "/user/signup";
  const forgotPasswordUrl = "/user/forgot-password";

  //api import from user store
  const {login,isLoading} = useUserStore();

  const handleSubmit = async(e) => {
    e.preventDefault();
      // Handle form submission logic here
      if(email.trim() === "" || password.trim() === "") {
        alert("Please fill in all fields");
        return;
      }

      if(!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email");
        return;
      }

        // You can add more validation logic here (e.g., password strength)
        if(password.length < 8) {
          alert("Password must be at least 8 characters long");
          return;
        }
      // If validation passes, you can proceed with form submission (e.g., API call)
      await login({ email, password });
    
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center  overflow-hidden relative font-orbitron">
      <LoginForm
        googleAuthUrl={googleAuthUrl}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        signupUrl={signupUrl}
        forgotPasswordUrl={forgotPasswordUrl}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserLogin;
