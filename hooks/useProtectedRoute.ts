import { useNavigation, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetSessionQuery } from "../Api/SessionApi";
import { selectAccessToken, selectUsername } from "../store/reducer/AuthSlice";

export default function useProtectedRoute() {
  const userId = useSelector(selectUsername);
  const router = useRouter();
  const { data } = useGetSessionQuery(userId);
  const navigation = useNavigation();
  const segments = useSegments();
  const accessToken = useSelector(selectAccessToken);
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)" || segments[0] === "(landing)";
    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !data &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/");
    } else if (data && inAuthGroup && userId !== "" && accessToken !== "") {
      // Redirect away from the sign-in page.
      navigation.navigate("(main)" as never);
    }
  }, [accessToken, data, navigation, router, segments, userId]);
}
