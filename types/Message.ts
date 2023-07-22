import Member from "./Member";
import MessageForm from "./MessageForm";

export default interface Message {
  messageData: MessageForm;
  userData: Member;
}
