
import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import {Outlet} from "react-router-dom"

const Layout = () => {
  return (
    <div className='min-h-screen w-full max-w-7xl mx-auto flex flex-col'>
        <Navbar/>
        <main className='flex-1'>
            <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default Layout