import React from 'react'
import { useParams,useNavigate } from 'react-router-dom';

import ResetPasswordForm from '../../components/ResetPasswordForm.jsx';
import useUserStore from "../../../store/user.store.js"

const UserResetPassword = () => {
  const [password, setPassword] = React.useState("");

  const { isLoading , resetPassword} = useUserStore();

  const {resetPasswordToken}  = useParams();

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle password reset logic here
    if(password.trim() === "") {
      alert("Please enter a new password");
      return;
    }
    if(password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    console.log({password, resetPasswordToken});
    await resetPassword({password, resetPasswordToken});
    setPassword("");
    navigate("/user/login");
  };

  return (
    <div className="">
      <ResetPasswordForm
        handleSubmit={handleSubmit}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
      />
    </div>
  )
}

export default UserResetPassword
