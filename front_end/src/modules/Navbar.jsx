import React, { useState } from "react"
import ngcdf_logo from "@/assets/ngcdf_logo.png"
import { Link, useNavigate } from "react-router-dom"
import { useLogoutMutation } from "@/authRedux/baseApiSlice.js"
import { clearCredentials } from "@/authRedux/authSlice"
import { useDispatch,useSelector } from "react-redux"

import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const Navbar = () => {
  const [open, setOpen] = useState(false)

  const dispatch=useDispatch()
  const navigate=useNavigate()
  const userInfor=useSelector((state)=>state.auth.userInfor)

  const[logout]=useLogoutMutation()

  const handleLogout=async()=>{
    try {
      await logout().unwrap()
      dispatch(clearCredentials())
      navigate("/login")
    } catch (error) {
      console.log(error?.data?.message)
    }
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 shadow-lg backdrop-blur-md bg-gray-50 px-4 md:px-6">
        <div className="flex items-center justify-between py-2">

          {/* LOGO */}
          <div className="flex-shrink-0">
            <img
              src={ngcdf_logo}
              alt="ngcdf_logo"
              className="h-16 md:h-20 w-auto"
            />
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-8">

            {/* LINKS */}
            <section className="flex items-center gap-5 text-sm font-semibold text-blue-500">
              <Link
                className="hover:bg-blue-600 hover:text-white px-3 py-2 rounded transition-all duration-300"
              >
                Home
              </Link>

              <Link
                className="hover:bg-blue-600 hover:text-white px-3 py-2 rounded transition-all duration-300"
                to={"/applicants/dashboard"}
              >
                Funding
              </Link>

              <Link
                className="hover:bg-blue-600 hover:text-white px-3 py-2 rounded transition-all duration-300"
                to={"/bursary/application"}
              >
                Apply Now
              </Link>

              <Link
                className="hover:bg-blue-600 hover:text-white px-3 py-2 rounded transition-all duration-300"
              >
                More...
              </Link>
            </section>

            {/* AUTH / USER */}
            {!userInfor? (
              <section className="flex items-center gap-3">
                <Link
                  to={"/login"}
                  className="bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all duration-300 text-sm"
                >
                  Sign In
                </Link>

                <Link
                  to={"/register"}
                  className="bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all duration-300 text-sm"
                >
                  Sign Up
                </Link>
              </section>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <Avatar className="h-10 w-10 border-2 border-blue-400 cursor-pointer">
                      <AvatarImage src={userInfor?.profilePic} />

                      <AvatarFallback className="bg-blue-500 text-white">
                        {userInfor.firstName.charAt(0).toUpperCase()}
                        {userInfor.secondName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56"
                >
                  <DropdownMenuLabel>
                    My Account
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer" onClick={()=>navigate(`/profile/${userInfor.id}`)} >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* MOBILE NAV */}
          <div className="flex md:hidden items-center justify-between flex-1 ml-4">

            {/* CENTER HAMBURGER */}
            <div className="flex-1 flex justify-center">
              {!open && (
                <button
                  onClick={() => setOpen(true)}
                  className="text-blue-500"
                >
                  <Menu size={30} />
                </button>
              )}
            </div>

            {/* USER DROPDOWN */}
            <div className="flex justify-end">
              {userInfor? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="outline-none">
                      <Avatar className="h-10 w-10 border-2 border-blue-400">
                        <AvatarImage src={userInfor.profilePic} />

                        <AvatarFallback className="bg-blue-500 text-white">
                        {userInfor.firstName.charAt(0).toUpperCase()}
                        {userInfor.secondName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-52"
                  >
                    <DropdownMenuLabel>
                      My Account
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to={"/login"}
                  className="bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all duration-300 text-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[60] transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "rgba(209, 213, 219, 0.55)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        {/* TOP */}
        <div className="flex justify-between items-center px-6 py-4">
          <img
            src={ngcdf_logo}
            alt="ngcdf_logo"
            className="h-16 w-auto"
          />

          <button
            onClick={() => setOpen(false)}
            className="text-blue-500"
          >
            <X size={30} />
          </button>
        </div>

        {/* MOBILE LINKS */}
        <div className="flex-1 flex flex-col justify-center items-center gap-7 text-blue-600 font-semibold text-sm">

          <Link onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link onClick={() => setOpen(false)}>
            Funding
          </Link>

          <Link onClick={() => setOpen(false)} to={"/bursary/application"}>
            Apply Now
          </Link>

          <Link onClick={() => setOpen(false)}>
            Projects
          </Link>

          <Link onClick={() => setOpen(false)}>
            Suggestions
          </Link>

          <Link onClick={() => setOpen(false)}>
            Contact
          </Link>

          {/* MOBILE AUTH */}
          {!userInfor && (
            <div className="flex flex-col gap-4 mt-4 w-full px-8">

              <Link
                to={"/login"}
                onClick={() => setOpen(false)}
                className="bg-blue-400 hover:bg-blue-600 text-white py-3 rounded text-center transition-all duration-300"
              >
                Sign In
              </Link>

              <Link
                to={"/register"}
                onClick={() => setOpen(false)}
                className="bg-blue-400 hover:bg-blue-600 text-white py-3 rounded text-center transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar