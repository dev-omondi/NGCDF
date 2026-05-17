
import usersApi from "./rootApiSlice.js";

const USER_URL='/api/users'

const baseApi=usersApi.injectEndpoints({
    endpoints:(builder)=>({
        register:builder.mutation({
            query:(data)=>({
                url:`${USER_URL}/register`,
                method:"POST",
                body:data
            }),
            invalidatesTags:["Users"]
        }),
        login:builder.mutation({
            query:()=>({
                url:`${USER_URL}/login`,
                method:"POST",

            }),
            invalidatesTags:["Users"]
        }),
        logout:builder.mutation({
            query:()=>({
                url:`${USER_URL}/logout`,
                method:"POST"
            })
        })
    })
})
export const {useRegisterMutation,useLoginMutation,useLogoutMutation}=baseApi