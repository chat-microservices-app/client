export default interface Message {
  messageId: string;
  message: string;
  userId: string;
  roomId: string;
  createdAt?: string;
  updatedAt?: string;
}
