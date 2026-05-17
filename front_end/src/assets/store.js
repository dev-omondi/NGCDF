import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/authRedux/authSlice.js"
import usersApi from "@/authRedux/rootApiSlice.js";

const store=configureStore({
    reducer:{
        auth:authReducer,
        [usersApi.reducerPath]:usersApi.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(usersApi.middleware),
    devTools:true
})
export default store