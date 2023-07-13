import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import baseApi from ".";
import REST from "../constants/Rest";
import Message from "../types/Message";

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], { roomId: string; token: string }>({
      query: ({ roomId, token }) => ({
        url: `${REST.ROOMS.ROOT}/${roomId}${REST.MESSAGING.ROOT}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Messages"],
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) {
        // set up a subscription to the websocket
        const socket = new SockJS(
          REST.BASE_URL + REST.BASE_ENDPOINT + REST.MESSAGING.WS.ROOT
        );
        // create the stomp client to translate the socket messages
        const stompClient = Stomp.over(socket);

        // add headers to the connection
        stompClient.connect({ Authorization: `Bearer ${arg.token}` }, () => {});

        try {
          // wait for the initial query to complete
          await cacheDataLoaded;
          // update the cache with the new messages comming from the websocket
          stompClient.subscribe(
            `${REST.MESSAGING.WS.CHANNEL_GET_MESSAGES}/${arg.roomId}${REST.MESSAGING.ROOT}`,
            (event) => {
              const message: Message = JSON.parse(event.body);
              // updating the cache with the new message
              updateCachedData((draft) => {
                draft.push(message);
              });
            }
          );
        } catch (e: unknown) {
          // TODO handle error
          throw new Error("Error while subscribing to the websocket");
        }
        await cacheEntryRemoved;
        stompClient.disconnect(() => {});
      },
    }),
    sendMessage: builder.mutation<void, { message: Message; roomId: string }>({
      query: ({ roomId, message }) => ({
        url: `${REST.ROOMS.ROOT}/${roomId}/messages`,
        method: "POST",
        body: { message },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  reducer: messageReducer,
} = messageApi;
