
import usersApi from "@/authRedux/rootApiSlice.js";

const CYCLE_URL="/api/cycle"

const cyclebaseApi=usersApi.injectEndpoints({
    endpoints:(builder)=>({
        createcycle:builder.mutation({
            query:(data)=>({
                url:`${CYCLE_URL}`,
                method:"POST",
                body:data
            }),
            invalidatesTags:["Cycles"]
        }),
        updateCycle:builder.mutation({
            query:({id,data})=>({
                url:`${CYCLE_URL}/${id}`,
                method:"PUT",
                body:data
            }),
            invalidatesTags:["Cycles"]
        }),
        getcycles:builder.query({
            query:()=>({
                url:`${CYCLE_URL}`,
                method:"GET"
            }),
            providesTags:["Cycles"]
        }),
        getCycle:builder.query({
            query:(id)=>({
                url:`${CYCLE_URL}/${id}`,
                method:"GET"
            }),
            providesTags:["Cycles"]
        }),
        openCycle:builder.query({
            query:()=>({
                url:`${CYCLE_URL}/open`,
                method:"GET"
            }),
            providesTags:["Cycles"]
        }),
        deleteCycle:builder.mutation({
            query:(id)=>({
                url:`${CYCLE_URL}/${id}`,
                method:"DELETE"
            }),
            invalidatesTags:["Cycles"]
        })
    })
})

export const{useCreatecycleMutation,
    useUpdateCycleMutation,
    useGetCycleQuery,
    useGetcyclesQuery,
    useDeleteCycleMutation,
    useOpenCycleQuery
}=cyclebaseApi