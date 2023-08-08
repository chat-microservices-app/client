/* eslint-disable no-param-reassign */
import { createEntityAdapter } from "@reduxjs/toolkit";

import baseApi from ".";
import REST from "../constants/Rest";
import Message, { EntityMessage } from "../types/Message";
import MessageForm from "../types/MessageForm";
import MessagePagination, {
  SanitizedMessage,
} from "../types/MessagePagination";
import webSocketConnection from "../websocket/websocket";

const messageAdapter = createEntityAdapter<Message>({
  selectId: (message) => message.messageData.messageId as string,
});

const initialState = messageAdapter.getInitialState({
  page: 0,
  numberOfElements: 0,
  size: 0,
  totalPages: 0,
  canUseChat: false,
});

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<
      EntityMessage,
      { roomId: string; token: string; page: number; size: number }
    >({
      query: ({ roomId, token, page, size }) => ({
        url: `${REST.ROOMS.ROOT}/${roomId}${REST.MESSAGING.ROOT}`,
        method: "GET",
        params: {
          page,
          size,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (apiResponse) => {
        const { content, totalPages, number, size, numberOfElements } =
          apiResponse as MessagePagination;

        const parsedContent = content.map((message) => {
          const date = new Date(message.messageData.createdAt as string);
          let actualDate = date;
          if (date.getUTCDate() === date.getDate()) {
            actualDate = new Date(
              date.getTime() - date.getTimezoneOffset() * 60000
            );
          }
          const parsedMessage = {
            ...message,
            messageData: {
              ...message.messageData,
              date: actualDate.toLocaleDateString(),
            },
          } as Message;
          return parsedMessage;
        });
        initialState.page = number;
        initialState.size = size;
        initialState.totalPages = totalPages;
        initialState.numberOfElements = numberOfElements;
        return messageAdapter.upsertMany(
          { ...initialState, totalPages, page: number, numberOfElements, size },
          parsedContent
        );
      },
      providesTags: (result) =>
        result
          ? [
              // Provides a tag for each post in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.ids.map((id) => ({
                type: "Messages" as const,
                id,
              })),
              { type: "Messages", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Messages", id: "PARTIAL-LIST" }],
      onCacheEntryAdded: async (
        arg,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        // set up a subscription to the websocket
        let websocket = webSocketConnection(
          `${REST.BASE_URL}${REST.BASE_ENDPOINT}${REST.MESSAGING.WS.ROOT}`,
          arg.roomId,
          arg.token,
          updateCachedData,
          messageAdapter
        );

        try {
          // wait for the initial query to complete
          await cacheDataLoaded;

          // active the inital websocket connection
          websocket.stompClient.activate();

          // if the websocket forcefullycloses, we want to reconnect
          websocket.stompClient.onWebSocketClose = async () => {
            setTimeout(() => {
              websocket = webSocketConnection(
                `${REST.BASE_URL}${REST.BASE_ENDPOINT}${REST.MESSAGING.WS.ROOT}`,
                arg.roomId,
                arg.token,
                updateCachedData,
                messageAdapter
              );
              websocket.stompClient.activate();
            }, 5000);
          };
        } catch (e) {
          console.warn(e, " errror here");
          websocket.socket.close();
        }

        cacheEntryRemoved.then(() => {
          if (websocket.socket) websocket.socket.close();
        });
      },
      keepUnusedDataFor: 120,
    }),

    getMoreMessages: builder.query<
      SanitizedMessage,
      { roomId: string; page: number; size: number; token: string }
    >({
      query: ({ roomId, page, size }) => ({
        url: `${REST.ROOMS.ROOT}/${roomId}${REST.MESSAGING.ROOT}`,
        method: "GET",
        params: {
          page,
          size,
        },
      }),
      transformResponse: (apiResponse) => {
        const { content, totalPages, number, size, numberOfElements } =
          apiResponse as MessagePagination;

        const parsedContent = content.map((message) => {
          const date = new Date(message.messageData.createdAt as string);
          let actualDate = date;
          if (date.getUTCDate() === date.getDate()) {
            actualDate = new Date(
              date.getTime() - date.getTimezoneOffset() * 60000
            );
          }
          const parsedMessage = {
            ...message,
            messageData: {
              ...message.messageData,
              date: actualDate.toLocaleDateString(),
            },
          } as Message;
          return parsedMessage;
        });

        return {
          messages: parsedContent,
          totalPages,
          page: number,
          size,
          numberOfElements,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // add the values to the get more messages query after the query has been fulfilled
          const messages = await queryFulfilled;
          const { data } = messages;
          if (data?.messages?.length > 0) {
            // mutate the cache to add the new message to to the getMessages query
            dispatch(
              baseApi.util.updateQueryData(
                "getMessages" as never,
                {
                  roomId: arg.roomId,
                  token: arg.token,
                  page: 0,
                  size: arg.size,
                } as never,
                (draft: EntityMessage) => {
                  draft.page = data.page;
                  draft.size = data.size;
                  draft.totalPages = data.totalPages;
                  draft.numberOfElements = data.numberOfElements;
                  return messageAdapter.upsertMany(draft, data.messages);
                }
              )
            );
          }
        } catch (error) {
          console.error(error);
        }
      },
      keepUnusedDataFor: 120,
    }),
    editMessage: builder.mutation<
      void,
      { roomId: string; messageId: string; message: MessageForm }
    >({
      query: ({ roomId, messageId, message }) => ({
        url: `${REST.ROOMS.ROOT}/${roomId}/messages/${messageId}`,
        method: "PUT",
        body: JSON.stringify(message),
      }),
    }),
    deleteMessage: builder.mutation<
      void,
      { roomId: string; messageId: string; userId: string }
    >({
      query: ({ roomId, messageId, userId }) => ({
        url: `${REST.ROOMS.ROOT}/${roomId}/messages/${messageId}`,
        method: "DELETE",
        params: {
          userId,
        },
      }),
    }),
    sendMessage: builder.mutation<
      void,
      { message: MessageForm; roomId: string }
    >({
      query: ({ roomId, message }) => ({
        url: `${REST.ROOMS.ROOT}/${roomId}/messages`,
        method: "POST",
        body: JSON.stringify(message),
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  util: { invalidateTags },
  useDeleteMessageMutation,
  useLazyGetMessagesQuery,
  useGetMoreMessagesQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useLazyGetMoreMessagesQuery,
  useEditMessageMutation,
} = messageApi;
