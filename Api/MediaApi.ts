import baseApi from ".";
import REST from "../constants/Rest";

const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadProfilePicture: builder.mutation<
      void,
      { userId: string; media: FormData; token: string }
    >({
      query: ({ userId, media, token }) => ({
        url: `${REST.MEDIA.ROOT}/${userId}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: media,
      }),
      invalidatesTags: ["Session"],
    }),
  }),
});

export const { useUploadProfilePictureMutation, usePrefetch } = mediaApi;
