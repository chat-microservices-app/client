import { EntityState } from "@reduxjs/toolkit";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetMessagesQuery,
  useLazyGetMoreMessagesQuery,
} from "../Api/MessageApi";
import { selectAccessToken } from "../store/reducer/AuthSlice";
import Message from "../types/Message";

export default function useMessageData({ id }: { id: string }) {
  const token = useSelector(selectAccessToken);
  const { isLoading, data } = useGetMessagesQuery({
    roomId: id as string,
    page: 0,
    size: 10,
    token,
  });
  const [page, setPage] = useState<number>(1);
  const [triggetGetMoreMessages, { isFetching: isGetMoreMessagesLoading }] =
    useLazyGetMoreMessagesQuery();

  async function handleLoadMoreMessages() {
    if (isLoading || isGetMoreMessagesLoading) return;
    const { totalPages, page: currentPage } = data as EntityState<Message> & {
      page: number;
      numberOfElements: number;
      size: number;
      totalPages: number;
    };
    if (totalPages === undefined) return;
    if (totalPages === currentPage + 1) return;
    if (totalPages === page) return;
    setPage((prev) => prev + 1);
    try {
      if (isLoading) return;
      await triggetGetMoreMessages({
        roomId: id as string,
        page,
        size: 10,
        token,
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  }

  return {
    handleLoadMoreMessages,
    isLoading,
    isGetMoreMessagesLoading,
    messageList: data as EntityState<Message> & {
      page: number;
      numberOfElements: number;
      size: number;
      totalPages: number;
    },
  };
}
