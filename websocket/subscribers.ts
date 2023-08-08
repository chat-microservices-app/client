/* eslint-disable no-param-reassign */
// file holds the logic for listening to subscribed topics and handling the messages
import { EntityAdapter } from "@reduxjs/toolkit";
import {
  PatchCollection,
  Recipe,
} from "@reduxjs/toolkit/dist/query/core/buildThunks";
import { IMessage } from "@stomp/stompjs";
import Message, { EntityMessage } from "../types/Message";

export function sendMessageSubscriber(
  event: IMessage,
  updateCachedData: (updateRecipe: Recipe<EntityMessage>) => PatchCollection,
  messageAdapter: EntityAdapter<Message>
): void {
  const message: Message = JSON.parse(event.body);
  if (message) {
    // updating the cache with the new message
    updateCachedData((draft: EntityMessage) => {
      draft.ids = [message.messageData.messageId as string, ...draft.ids];
      draft.entities[message.messageData.messageId as string] = message;
      messageAdapter.upsertOne(draft, message);
    });
  }
}

export function updateMessageSubscriber(
  event: IMessage,
  updateCachedData: (updateRecipe: Recipe<EntityMessage>) => PatchCollection,
  messageAdapter: EntityAdapter<Message>
): void {
  const message: Message = JSON.parse(event.body);
  if (message) {
    updateCachedData((draft: EntityMessage) => {
      draft.entities[message.messageData.messageId as string] = message;
      messageAdapter.upsertOne(draft, message);
    });
  }
}

export function deleteMessageSubscriber(
  event: IMessage,
  updateCachedData: (updateRecipe: Recipe<EntityMessage>) => PatchCollection,
  messageAdapter: EntityAdapter<Message>
): void {
  const messageId: string = JSON.parse(event.body);
  if (messageId) {
    // remove the message from the cache
    updateCachedData((draft: EntityMessage) => {
      draft.ids.filter((id) => id !== messageId);
      messageAdapter.removeOne(draft, messageId as string);
    });
  }
}
