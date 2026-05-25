
import React, { useEffect } from 'react'
import Layout from './modules/Layout'
import Registerpage from './pages/Registerpage'
import Loginpage from './pages/Loginpage'
import Homepage from './pages/Homepage'
import {Route,Routes} from "react-router-dom"
import BursaryDashboard from './dashboard/AdminDashboard'
import Protectpage from './pages/Protectpage'
import ApplicationForm from './pages/Applicationpage'
import ApplicantsPage from './dashboard/Applicantsdashboard'
import Userpage from './dashboard/Userpage'
import ApplicantReviewPage from './dashboard/Applicantpage'
import Userspage from './dashboard/Userspage'
import Profilepage from './pages/Profilepage'
import { useNavigate,useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
const App = () => {

  const navigate=useNavigate()
  const location=useLocation()
  const userInfor=useSelector((state)=>state.auth.userInfor)

  //prevent redirecting logedin users to home page on reopening of platform
  useEffect(()=>{
    if (!userInfor) return

    if(location.pathname==="/"){
      if(userInfor.role==="admin"){
        navigate("/admin/dashboard")
      }
    }
  },[userInfor,location.pathname,navigate])

  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Homepage/>}/>
          <Route path='/login' element={<Loginpage/>}/>
          <Route path='/register' element={<Registerpage/>}/>
          <Route path='/bursary/application' element={<ApplicationForm/>}/>
          <Route path='/applicants/dashboard' element={<ApplicantsPage/>}/>
          <Route path='applicant/:id' element={<ApplicantReviewPage/>}/>
          <Route element={<Protectpage/>}>
            <Route path='/admin/dashboard' element={<BursaryDashboard/>}/>
            <Route path='/users' element={<Userspage/>}/>
          </Route>
          <Route path='/user/:id' element={<Userpage/>}/>
          <Route path='/profile/:id' element={<Profilepage/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App