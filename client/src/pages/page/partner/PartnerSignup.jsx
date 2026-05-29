import React from 'react'

import { SERVER_URL } from '../../../config/config.js'
import SignupForm from '../../components/SignupForm'
import usePartnerStore from '../../../store/partner.store.js'

const PartnerSignup = () => {

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const signup = usePartnerStore((state) => state.signup);

  const loginUrl = "/partner/login";
  const forgotPasswordUrl = "/partner/forgot-password";

  const googleAuthUrl = `${SERVER_URL}/api/partner/google`;

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(fullName.trim() === "" || email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields");
      return;
    }

    if(!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    if(password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

      // If validation passes, you can proceed with form submission (e.g., API call)

      await signup({ fullName, email, password });

  }

  return (
    <div className='min-h-screen w-full bg-black flex items-center justify-center overflow-hidden relative '>
      <SignupForm
        fullName={fullName}
        email={email}
        password={password}
        setFullName={setFullName}
        setEmail={setEmail}
        setPassword={setPassword}
        googleAuthUrl={googleAuthUrl}
        handleSubmit={handleSubmit}
        loginUrl={loginUrl}
        forgotPasswordUrl={forgotPasswordUrl}
      />
    </div>
  )
}

export default PartnerSignup
