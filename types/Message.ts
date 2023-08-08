import { EntityState } from "@reduxjs/toolkit";
import Member from "./Member";
import MessageForm from "./MessageForm";

export default interface Message {
  messageData: MessageForm;
  userData: Member;
}

export interface EntityMessage extends EntityState<Message> {
  page: number;
  numberOfElements: number;
  size: number;
  totalPages: number;
  canUseChat: boolean;
}
