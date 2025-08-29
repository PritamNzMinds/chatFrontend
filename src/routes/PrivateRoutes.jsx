import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const userDetails=useSelector((state)=> state?.user);
  return (
    userDetails!=null ? <Outlet/> : <Navigate to='/login'/>
  )
}

export default PrivateRoutes