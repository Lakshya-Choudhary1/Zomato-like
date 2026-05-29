import React from 'react'

import EmailVerificationForm from '../../components/EmailVerificationForm.jsx'
import usePartnerStore from "../../../store/partner.store.js"

const PartnerVerifyEmail = () => {
  const [verificationToken, setVerificationToken] = React.useState('')
  const { verifyEmail ,resendVerificationCode , partner , isLoading } = usePartnerStore()

    const handleSubmit = async(e) => {
      e.preventDefault()
        await verifyEmail({verificationToken});
    }

    const handleResendCode = async() => {
        await resendVerificationCode({email: partner.email});
    };


  return (
    <div className='min-h-screen w-full bg-black flex items-center justify-center px-4 overflow-hidden relative '>
      <EmailVerificationForm
        handleSubmit={handleSubmit}
        verificationToken={verificationToken}
        setVerificationToken={setVerificationToken}
        handleResendCode={handleResendCode}
        isLoading={isLoading}
      />
    </div>
  )
}

export default PartnerVerifyEmail
