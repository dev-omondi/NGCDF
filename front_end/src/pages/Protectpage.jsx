import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Protectpage = ({allowedRoles}) => {
    const userInfor=useSelector((state)=>state.auth.userInfor)
  
    if(!userInfor){
        return <Navigate to={"/login"} replace/>
    }
    if (!allowedRoles.includes(userInfor.role)){
        return <Navigate to={"/"} replace/>
    }
    return <Outlet/>
}

export default Protectpage