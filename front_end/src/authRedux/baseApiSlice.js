
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
            query:(data)=>({
                url:`${USER_URL}/auth`,
                method:"POST",
                body:data,
            }),
            invalidatesTags:["Users"]
        }),
        logout:builder.mutation({
            query:()=>({
                url:`${USER_URL}/logout`,
                method:"POST"
            }),
            invalidatesTags:["Users"]
        }),
        getUsers:builder.query({
            query:()=>`${USER_URL}`,
            providesTags:["Users"]
        }),
        getUser:builder.query({
            query:(id)=>`${USER_URL}/${id}`,
            providesTags:["Users"]
        }),
        getProfile:builder.query({
            query:()=>({
                url:`${USER_URL}/profile`,
                method:"GET"
            }),
            providesTags:["Users"]
        }),
        updateUser:builder.mutation({
            query:(data)=>({
                url:`${USER_URL}/profile`,
                method:"PUT",
                body:data
            })
        }),
        updateRole:builder.mutation({ 
            query:({data,id})=>({
                url:`${USER_URL}/${id}`,
                method:"PUT",
                body:data
            }),
            invalidatesTags:["Users"]
        }),
        deleteUser:builder.mutation({
            query:(id)=>({
                url:`${USER_URL}/${id}`,
                method:"DELETE",
            }),
            invalidatesTags:["Users"]
        })
    })
})
export const {useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetUserQuery,
    useUpdateRoleMutation,
    useGetProfileQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetUsersQuery}=baseApi