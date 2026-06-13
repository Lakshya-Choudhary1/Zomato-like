import React from 'react'
import { useParams ,useNavigate} from 'react-router-dom';

import ResetPasswordForm from '../../components/ResetPasswordForm.jsx';
import usePartnerStore from "../../../store/partner.store.js"

const PartnerResetPassword = () => {
  const [password, setPassword] = React.useState("");

  const { isLoading , resetPassword} = usePartnerStore();

  const {resetPasswordToken}  = useParams();

  const navigate = useNavigate();

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
    await resetPassword({password, resetPasswordToken});
    setPassword("");
    navigate("/partner/login")
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

export default PartnerResetPassword
