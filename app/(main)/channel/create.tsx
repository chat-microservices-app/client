import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { useCreateRoomMutation } from "../../../Api/RoomApi";
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

function NewChannelScreen() {
  const [name, setName] = useState("");
  const username = useSelector(selectUsername);
  const { data: session } = useGetSessionQuery(username);
  const [pictureUrl, setPictureUrl] = useState("");
  const router = useRouter();
  const [createRoom, { isLoading }] = useCreateRoomMutation();
  async function createChannel(): Promise<void> {
    try {
      if (!session?.userId) throw new Error("No session found");
      const roomId = await createRoom({
        creatorId: session?.userId,
        name,
        pictureUrl,
      }).unwrap();
      router.push(`/channel/${roomId}`);
    } catch (error) {
      console.error(error);
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.root, { alignContent: "center" }]}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Channel name"
        style={styles.input}
        placeholderTextColor="lightgray"
      />
      <TextInput
        value={pictureUrl}
        onChangeText={setPictureUrl}
        placeholder="Picture url"
        style={styles.input}
        placeholderTextColor="lightgray"
      />
      <Button title="Create channel" onPress={() => createChannel()} />
    </View>
  );
}

export default NewChannelScreen;
