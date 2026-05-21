import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/authRedux/authSlice.js"
import usersApi from "@/authRedux/rootApiSlice.js";
import imageReducer from "@/imageRedux/imageSlice.js"
import applicationReducer from "@/applicationRedux/applicationSlice.js"

const store=configureStore({
    reducer:{
        auth:authReducer,
        image:imageReducer,
        application:applicationReducer,
        [usersApi.reducerPath]:usersApi.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(usersApi.middleware),
    devTools:true
})
export default store