
import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"

const   baseQuery=fetchBaseQuery({
    baseUrl:"",//import.meta.env.VITE_API_URL,
    credentials:"include"
})
const usersApi=createApi({
    reducerPath:"usersApi",
    baseQuery,
    endpoints:(builder)=>({}),
    tagTypes:["Users","Applications","Images","Cycles","Download"]
})

export default usersApi