export default interface MessageForm {
  messageId?: string;
  message: string;
  userId: string;
  roomId: string;
  createdAt?: string;
  updatedAt?: string;
}
