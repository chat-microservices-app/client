/* eslint-disable no-param-reassign */
import { EntityState, createEntityAdapter } from "@reduxjs/toolkit";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import baseApi from ".";
import REST from "../constants/Rest";
import Message from "../types/Message";
import MessageForm from "../types/MessageForm";
import MessagePagination, {
  SanitizedMessage,
} from "../types/MessagePagination";

const messageAdapter = createEntityAdapter<Message>({
  selectId: (message) => message.messageData.messageId as string,
});

const initialState = messageAdapter.getInitialState({
  page: 0,
  numberOfElements: 0,
  size: 0,
  totalPages: 0,
});

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<
      EntityState<Message> & {
        page: number;
        numberOfElements: number;
        size: number;
        totalPages: number;
      },
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
        return messageAdapter.upsertMany(initialState, parsedContent);
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
        const socket = new SockJS(
          `${REST.BASE_URL}${REST.BASE_ENDPOINT}${REST.MESSAGING.WS.ROOT}`,
          null
        );
        try {
          // wait for the initial query to complete
          await cacheDataLoaded;
          const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
              if (!arg.roomId) return;
              // subscribe to the websocket channel for the room
              stompClient.subscribe(
                `${REST.MESSAGING.WS.CHANNEL_GET_MESSAGES}/${arg.roomId}${REST.MESSAGING.ROOT}`,
                (event) => {
                  const message: Message = JSON.parse(event.body);
                  if (message) {
                    // updating the cache with the new message
                    updateCachedData((draft) => {
                      // eslint-disable-next-line no-param-reassign
                      draft.ids = [
                        message.messageData.messageId as string,
                        ...draft.ids,
                      ];
                      // eslint-disable-next-line no-param-reassign
                      draft.entities[message.messageData.messageId as string] =
                        message;
                      messageAdapter.upsertOne(draft, message);
                    });
                  }
                }
              );
            },
            connectHeaders: {
              Authorization: `Bearer ${arg.token}`,
            },
            onWebSocketClose: () => {
              stompClient.deactivate();
            },
            reconnectDelay: 1500,
            heartbeatIncoming: 3000,
            heartbeatOutgoing: 1000,
          });
          // create the stomp client to translate the socket messages
          stompClient.activate();
        } catch (e) {
          console.warn(e, " errror here");
          socket.close();
        }

        cacheEntryRemoved.then(() => {
          if (socket) socket.close();
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
          // add the values to the get more messages query
          const messages = await queryFulfilled;
          const { data } = messages;
          if (data?.messages?.length > 0) {
            dispatch(
              baseApi.util.updateQueryData(
                "getMessages" as never,
                {
                  roomId: arg.roomId,
                  token: arg.token,
                  page: 0,
                  size: arg.size,
                } as never,
                (
                  draft: EntityState<Message> & {
                    page: number;
                    numberOfElements: number;
                    size: number;
                    totalPages: number;
                  }
                ) => {
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
});

export const {
  util: { invalidateTags },
  useLazyGetMessagesQuery,
  useGetMoreMessagesQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useLazyGetMoreMessagesQuery,
} = messageApi;
