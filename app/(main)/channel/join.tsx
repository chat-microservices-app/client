import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useJoinRoomMutation } from "../../../Api/RoomApi";
import { useGetSessionQuery } from "../../../Api/SessionApi";
import Button from "../../../components/UI/Button";
import { selectUsername } from "../../../store/reducer/AuthSlice";

const styles = StyleSheet.create({
  root: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    color: "white",
  },
});

export default function Join() {
  const username = useSelector(selectUsername);
  const { data: session } = useGetSessionQuery(username);
  const [joinRooms, { isLoading }] = useJoinRoomMutation();
  const { roomId, roomName } = useLocalSearchParams();
  const router = useRouter();
  async function joinChannel(): Promise<void> {
    try {
      const roomIdToJoin = await joinRooms({
        roomId: roomId as string,
        userId: session?.userId as string,
      }).unwrap();
      router.push({
        pathname: `/channel/${roomIdToJoin}`,
        params: { roomName },
      });
    } catch (e) {
      console.warn(e);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.root}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Button title="Request To Join" onPress={() => joinChannel()} />
    </View>
  );
}
