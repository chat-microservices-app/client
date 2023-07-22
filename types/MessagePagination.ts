import Message from "./Message";
import { Pageable, Sort } from "./RoomPagination";

export interface SanitizedMessage {
  messages: Message[];
  size: number;
  totalPages: number;
  page: number;
  numberOfElements: number;
}

export default interface MessagePagination {
  content: Message[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
