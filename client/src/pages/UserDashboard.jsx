import React from 'react'

import  useUserStore  from '../store/user.store.js';

const UserDashboard = () => {
  const {logout} = useUserStore()

  const handleLogout = async() => {
   await logout();
  }

  return (
    <div className='min-h-screen w-full bg-black flex items-center justify-center px-4 overflow-hidden relative font-[orbitron-light]'>
      <button className='text-white text-3xl font-bold' type="button" onClick={handleLogout}>logout</button>
      <h1 className='text-white text-3xl font-bold'>User Dashboard</h1>
    </div>
  )
}

export default UserDashboard
