/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-param-reassign */
// file will have the main websocket configuration and logic
import { EntityAdapter } from "@reduxjs/toolkit";
import {
  PatchCollection,
  Recipe,
} from "@reduxjs/toolkit/dist/query/core/buildThunks";
import { Client, IStompSocket } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import REST from "../constants/Rest";
import Message, { EntityMessage } from "../types/Message";
import {
  deleteMessageSubscriber,
  sendMessageSubscriber,
  updateMessageSubscriber,
} from "./subscribers";

// object that will handle the websocket connection with stomp support
// the main goal is to handle reconnections upon hanging or sudden disconnections
class WebSocketConnection {
  url: string;

  roomId: string;

  token: string;

  updateCachedData: (updateRecipe: Recipe<EntityMessage>) => PatchCollection;

  messageAdapter: EntityAdapter<Message>;

  stompClient: null | Client;

  socket: null | WebSocket;

  timeout: null | NodeJS.Timeout;

  constructor(
    url: string,
    roomId: string,
    token: string,
    updateCachedData: (updateRecipe: Recipe<EntityMessage>) => PatchCollection,
    messageAdapter: EntityAdapter<Message>
  ) {
    this.url = url;
    this.roomId = roomId;
    this.token = token;
    this.updateCachedData = updateCachedData;
    this.messageAdapter = messageAdapter;

    this.stompClient = null;
    this.socket = null;
    this.timeout = null;

    this.connect();
  }

  connect() {
    this.socket = new SockJS(this.url, null, {
      transports: ["websocket"],
      server: "netty-with-rabbitmq",
    });

    this.stompClient = new Client({
      brokerURL: this.url,
      debug: (str) => {
        console.info(str);
      },
      onWebSocketClose: () => {
        this.updateCachedData((draft) => {
          draft.canUseChat = false;
        });
      },
      connectHeaders: {
        Authorization: `Bearer ${this.token}`,
      },

      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    this.stompClient.reconnectDelay = 5000;
    this.stompClient.connectionTimeout = 5 * 1000 * 60;

    let connectTimeoutHandler: NodeJS.Timeout | null = null;
    this.stompClient.webSocketFactory = () =>
      new SockJS(this.url, null, {
        transports: ["websocket"],
        server: "netty-with-rabbitmq",
      }) as IStompSocket;

    this.stompClient.beforeConnect = () => {
      // Callback, invoked on before a connection to the STOMP broker.
      const self = this;
      // important, otherwise we might have multiple connections of the same client
      if (!self.stompClient?.active) {
        self.stompClient?.activate();
      }
      if (!connectTimeoutHandler) {
        connectTimeoutHandler = setTimeout(
          () => {
            (self.stompClient as Client).deactivate();
            clearTimeout(connectTimeoutHandler as NodeJS.Timeout);
          },
          5 * 1000 * 60
        );
      }
    };

    this.stompClient.onDisconnect = () => {
      clearTimeout(connectTimeoutHandler as NodeJS.Timeout);
      this.updateCachedData((draft) => {
        draft.canUseChat = false;
      });
    };

    this.stompClient.onConnect = () => {
      clearTimeout(connectTimeoutHandler as NodeJS.Timeout);
      if (!this.roomId) return;

      // Enable the chat for the user
      this.updateCachedData((draft) => {
        draft.canUseChat = true;
      });

      // Subscribe to channels
      this.stompClient?.subscribe(
        `${REST.MESSAGING.WS.CHANNEL_GET_MESSAGES}.${this.roomId}.messages.send`,
        (event) =>
          sendMessageSubscriber(
            event,
            this.updateCachedData,
            this.messageAdapter
          )
      );

      this.stompClient?.subscribe(
        `${REST.MESSAGING.WS.CHANNEL_GET_MESSAGES}.${this.roomId}.messages.update`,
        (event) =>
          updateMessageSubscriber(
            event,
            this.updateCachedData,
            this.messageAdapter
          )
      );

      this.stompClient?.subscribe(
        `${REST.MESSAGING.WS.CHANNEL_GET_MESSAGES}.${this.roomId}.messages.delete`,
        (event) =>
          deleteMessageSubscriber(
            event,
            this.updateCachedData,
            this.messageAdapter
          )
      );
    };
  }

  getStompClient() {
    return this.stompClient;
  }

  getSocket() {
    return this.socket;
  }
}

export default WebSocketConnection;
