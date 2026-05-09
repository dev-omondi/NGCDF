
import React from 'react'
import Layout from './modules/Layout'
import Registerpage from './pages/Registerpage'
import Loginpage from './pages/Loginpage'
import Homepage from './pages/Homepage'
import {Route,Routes} from "react-router-dom"
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Homepage/>}/>
          <Route path='/login' element={<Loginpage/>}/>
          <Route path='/register' element={<Registerpage/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App