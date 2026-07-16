import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet, useLocation } from "react-router-dom"

const Layout = () => {
  const location = useLocation();

  
  const isAdminDashboard = location.pathname.startsWith("admin/dashboard");

  return (
    <div className='min-h-screen w-full max-w-7xl mx-auto flex flex-col'>
        <Navbar/>
        <main className='flex-1'>
           
        </main>
        <div className={isAdminDashboard ? "lg:pl-64" : ""}>
          <Footer/>
        </div>
    </div>
  )
}

export default Layout