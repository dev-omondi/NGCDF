import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Protectpage = () => {
    const userInfor=useSelector((state)=>state.auth.userInfor)
  
    if(!userInfor){
        return <Navigate to={"/login"}/>
    }
    if (userInfor.role!=="admin") {
        return <Navigate to={"/"}/>
    }
    return <Outlet/>
}

export default Protectpage