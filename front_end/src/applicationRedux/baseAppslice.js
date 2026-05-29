
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
        updateStatus:builder.mutation({
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
        }),
        updateAmount:builder.mutation({
            query:({id,ApprovedAmount})=>({
                url:`${APPLICATION_URL}/allocation/${id}`,
                method:"PUT",
                body:{ApprovedAmount}
            }),
            invalidatesTags:["Applications"]
        })
    })
})
export const{useApplyMutation,useApplicantsQuery
    ,useUpdateStatusMutation,useApplicantQuery,useUpdateAmountMutation}=applicationApi