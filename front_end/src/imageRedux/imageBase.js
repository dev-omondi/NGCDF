
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
        }),
        uploads:builder.mutation({
            query:(data)=>({
                url:`${IMAGE_URL}/multiple`,
                method:"POST",
                body:data
            }),
            invalidatesTags:["Images"]
        }),
        deleteImage:builder.mutation({
            query:(key)=>({
                url:`${IMAGE_URL}?key=${key}`,
                method:"DELETE",
            }),
            invalidatesTags:["Images"]
        })
    })
})
export const{useUploadMutation,useUploadsMutation,useDeleteImageMutation}=imageBase