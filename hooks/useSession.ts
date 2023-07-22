import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLazyGetSessionQuery } from "../Api/SessionApi";
import { selectAccessToken, selectUsername } from "../store/reducer/AuthSlice";

export default function useSession() {
  const accessToken = useSelector(selectAccessToken);
  const userId = useSelector(selectUsername);
  const startSession = useRef<boolean>(true);
  const [trigger, { isError, isSuccess, isFetching, isLoading }] =
    useLazyGetSessionQuery();

  useEffect(() => {
    if (accessToken !== "" && userId !== "" && startSession.current === true) {
      startSession.current = false;
      trigger(userId);
    }
    return () => {
      trigger(userId).abort();
    };
  }, [accessToken, trigger, userId, startSession]);

  return { isSuccess, isError, isFetching, startSession, isLoading };
}
