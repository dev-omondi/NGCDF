import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userInfor:localStorage.getItem("userInfor")?JSON.parse(localStorage.getItem("userInfor")):
    null
}
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            state.userInfor=action.payload
            localStorage.setItem("userInfor",JSON.stringify(action.payload))
        },
        clearCredentials:(state)=>{
            state.userInfor=null
            localStorage.removeItem("userInfor")
        }
    },
    
})
export const {setCredentials,clearCredentials}=authSlice.actions
export default authSlice.reducer