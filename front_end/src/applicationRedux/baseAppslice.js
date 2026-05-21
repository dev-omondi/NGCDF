
import usersApi from "@/authRedux/rootApiSlice";

const APPLICATION_URL="/api/application"

const applicationApi= usersApi.injectEndpoints({
    endpoints:(builder)=>({
        apply:builder.mutation({
            query:(data)=>({
                url:`${APPLICATION_URL}`,
                method:"POST",
                body:data
            }),
            invalidatesTags:["Applications"]
        })
    })
})
export const{useApplyMutation}=applicationApi