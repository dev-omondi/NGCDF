
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
import Statuspage from './pages/Statuspage'
import Userpage from './dashboard/Userpage'
import ApplicantReviewPage from './dashboard/Applicantpage'
import Userspage from './dashboard/Userspage'
import Profilepage from './pages/Profilepage'
import Fundsallocation from './dashboard/Fundsallocation'
import { useNavigate,useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Toaster } from "react-hot-toast";
import Createcycle from './dashboard/Createcycle'
import Cyclespage from './dashboard/Cyclespage'
import Cyclepage from './dashboard/Cyclepage'
import Approvedpage from './pages/Approvedpage'
import SupportPage from './pages/Supportpage'
import ApplicationGuidePage from './pages/Applicationguide'
import Beneficiariespage from './pages/Beneficiariespage'
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
      <Toaster position="top-right" />
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Homepage/>}/>
          <Route path='/login' element={<Loginpage/>}/>
          <Route path='/register' element={<Registerpage/>}/>
          <Route path='/bursary/application' element={<ApplicationForm/>}/>
          <Route path='applicant/:id' element={<ApplicantReviewPage/>}/>
          <Route path='/beneficiaries' element={<Beneficiariespage/>}/>
          <Route path='/status' element={<Statuspage/>}/>
          <Route path='/support' element={<SupportPage/>}/>
          <Route path='/application/guide' element={<ApplicationGuidePage/>}/>
          <Route element={<Protectpage allowedRoles={["admin"]}/> }>
            <Route path='/admin/dashboard' element={<BursaryDashboard/>}/>
            <Route path='/cycles' element={<Cyclespage/>}/>
            <Route path='/download' element={<Approvedpage/>}/>
            <Route path='/cycle/:id' element={<Cyclepage/>}/>
            <Route path='/users' element={<Userspage/>}/>
            <Route path='/cycle/create' element={<Createcycle/>} />
          </Route>
          <Route element={<Protectpage allowedRoles={["reviewer"]}/>}>
            <Route path='/applicants/dashboard' element={<ApplicantsPage/>}/>
          </Route>
            <Route element={<Protectpage allowedRoles={["finance"]}/>}>
               <Route path='/allocation' element={<Fundsallocation/>}/>
            </Route>
          <Route path='/user/:id' element={<Userpage/>}/>
          <Route path='/profile/:id' element={<Profilepage/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App