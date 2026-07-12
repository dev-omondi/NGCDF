import usersApi from "@/authRedux/rootApiSlice";

const downloadApiSlice = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    downloadApplicants: builder.mutation({
      query: ({cycleName}) => ({
        url: `/api/download`,
        method: "GET",
        params:{cycleName},
        responseHandler: async (response) =>{
          if(!response.ok){
            throw await response.json()
          }
          return await response.blob()}
      }),
    }),
  }),
});

export const { useDownloadApplicantsMutation } = downloadApiSlice;