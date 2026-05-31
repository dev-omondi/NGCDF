
import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"

const   baseQuery=fetchBaseQuery({
    baseUrl:"",
    credentials:"include"
})
const usersApi=createApi({
    reducerPath:"usersApi",
    baseQuery,
    endpoints:(builder)=>({}),
    tagTypes:["Users","Applications","Images","Cycles"]
})

export default usersApi