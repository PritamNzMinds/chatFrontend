import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
    const users=localStorage.getItem("users");
    const userdetails=JSON.parse(users);
    let auth=null;
    if(userdetails){
        auth=userdetails.token;
    }
  return (
    auth? <Outlet/> : <Navigate to='/login'/>
  )
}

export default PrivateRoutes