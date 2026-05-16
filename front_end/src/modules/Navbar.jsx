import React, { useState } from 'react'
import ngcdf_logo from "@/assets/ngcdf_logo.png"
import { Link } from 'react-router-dom'
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className='sticky top-0 z-50 shadow-lg backdrop-blur-md bg-gray-50 px-6'>
        <div className='flex justify-between items-center p-2'>
          <div>
            <img src={ngcdf_logo} alt="ngcdf_logo" className='h-20 w-auto' />
          </div>

          <div className='flex gap-6'>
            <section className='hidden md:flex items-center gap-5 text-sm font-semibold text-blue-500 flex-wrap'>
              <Link className='hover:bg-blue-600 hover:text-white p-2  transition-all duration-500 rounded'>Home</Link>
              <Link className='hover:bg-blue-600 hover:text-white p-2  transition-all duration-500 rounded'>Funding</Link>
              <Link className='hover:bg-blue-600 hover:text-white p-2  transition-all duration-500 rounded'>Bursery Application</Link>
              <Link className='hover:bg-blue-600 hover:text-white p-2  transition-all duration-500 rounded'>More...</Link>
            </section>
            <section className='hidden md:flex items-center gap-3'>
              <Link className='bg-blue-400 rounded px-4 py-2 text-white cursor-pointer
               hover:bg-blue-600 transition-all duration-300 text-sm'
               to={"/login"}>
                Sign In
              </Link>
              <Link className='bg-blue-400 rounded px-4 py-2 text-white cursor-pointer hover:bg-blue-600 
              transition-all duration-300 text-sm'
              to={"/register"}
              >
                Sign Up
              </Link>
            </section>
          </div>
          {!open && (
            <button
              onClick={() => setOpen(true)}
              className='text-blue-400 md:hidden'
            >
              <Menu size={24} />
            </button>
          )}
        </div>
      </nav>
      <div
        className={`fixed inset-0 z-[55] transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'rgba(209, 213, 219, 0.55)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        <div className='flex justify-between items-center px-6 py-4 flex-shrink-0'>
          <img src={ngcdf_logo} alt="ngcdf_logo" className='h-20 w-auto' />
          <button onClick={() => setOpen(false)} className='text-blue-500'>
            <X size={28} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto flex flex-col items-center justify-center gap-6 py-8 font-semibold text-sm text-blue-600'>
          <Link onClick={() => setOpen(false)}>Home</Link>
          <Link onClick={() => setOpen(false)}>Funding</Link>
          <Link onClick={() => setOpen(false)}>Bursery Application</Link>
          <Link onClick={() => setOpen(false)}>Project</Link>
          <Link onClick={() => setOpen(false)}>Suggestions</Link>
          <Link onClick={() => setOpen(false)}>Contact</Link>

          <div className='flex flex-col items-center gap-3 mt-4 w-full px-8'>
            <Link
              onClick={() => setOpen(false)}
              className='bg-blue-400 rounded px-8 py-3 text-white hover:bg-blue-600 transition-all duration-300 text-sm w-full max-w-xs text-center block'
            >
              Sign In
            </Link>
            <Link
              onClick={() => setOpen(false)}
              className='bg-blue-400 rounded px-8 py-3 text-white hover:bg-blue-600 transition-all duration-300 text-sm w-full max-w-xs text-center block'
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar