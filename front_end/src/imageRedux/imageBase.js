
import usersApi from "@/authRedux/rootApiSlice";

const IMAGE_URL="/api/upload"

const imageBase=usersApi.injectEndpoints({
    endpoints:(builder)=>({
        upload:builder.mutation({
            query:(data)=>({
                url:`${IMAGE_URL}/single`,
                method:"POST",
                body:data
            }),
            invalidatesTags:["Images"]
        })
    })
})
export const{useUploadMutation}=imageBase