
import React from 'react'
import Layout from './modules/Layout'
import Registerpage from './pages/Registerpage'
import Loginpage from './pages/Loginpage'
import Homepage from './pages/Homepage'
import {Route,Routes} from "react-router-dom"
import AdminDashboard from "@/dashboard/AdminDashboard"
import Protectpage from './pages/Protectpage'
import ApplicationForm from './pages/Applicationpage'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Homepage/>}/>
          <Route path='/login' element={<Loginpage/>}/>
          <Route path='/register' element={<Registerpage/>}/>
          <Route path='/bursary/application' element={<ApplicationForm/>}/>
          <Route element={<Protectpage/>}>
          <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App