/* eslint-disable no-param-reassign */
// file will have the main websocket configuration and logic
import { EntityAdapter } from "@reduxjs/toolkit";
import {
  PatchCollection,
  Recipe,
} from "@reduxjs/toolkit/dist/query/core/buildThunks";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import REST from "../constants/Rest";
import Message, { EntityMessage } from "../types/Message";
import {
  deleteMessageSubscriber,
  sendMessageSubscriber,
  updateMessageSubscriber,
} from "./subscribers";

// create a websocket connection and return the client and socket
export default function webSocketConnection(
  url: string,
  roomId: string,
  token: string,
  updateCachedData: (updateRecipe: Recipe<EntityMessage>) => PatchCollection,
  messageAdapter: EntityAdapter<Message>
): { stompClient: Client; socket: WebSocket } {
  const socket = new SockJS(url, null, {
    transports: ["websocket"],
    server: "netty-with-rabbitmq",
  });
  const stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => {
      if (str.includes("PING")) return;
      if (str.includes("PONG")) return;
      console.info(str);
    },
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    connectionTimeout: 5000,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    if (!roomId) return;

    // enable the chat for the user
    updateCachedData((draft) => {
      draft.canUseChat = true;
    });
    stompClient.subscribe(
      `${REST.MESSAGING.WS.CHANNEL_GET_MESSAGES}.${roomId}.messages.send`,
      (event) => sendMessageSubscriber(event, updateCachedData, messageAdapter)
    );

    stompClient.subscribe(
      `${REST.MESSAGING.WS.CHANNEL_GET_MESSAGES}.${roomId}.messages.update`,
      (event) =>
        updateMessageSubscriber(event, updateCachedData, messageAdapter)
    );

    stompClient.subscribe(
      `${REST.MESSAGING.WS.CHANNEL_GET_MESSAGES}.${roomId}.messages.delete`,
      (event) =>
        deleteMessageSubscriber(event, updateCachedData, messageAdapter)
    );
  };

  return { stompClient, socket };
}
