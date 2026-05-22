
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
        }),
        applicants:builder.query({
            query:()=>`${APPLICATION_URL}`,
            providesTags:["Applicants"]
        }),
        updateRole:builder.mutation({
            query:({data,id})=>({
                url:`${APPLICATION_URL}/${id}`,
                method:"PUT",
                body:data
            }),
            invalidatesTags:["Applications"]
        }),
        applicant:builder.query({
            query:(id)=>`${APPLICATION_URL}/${id}`,
            providesTags:["Applications"]
        })
    })
})
export const{useApplyMutation,useApplicantsQuery
    ,useUpdateRoleMutation,useApplicantQuery}=applicationApi