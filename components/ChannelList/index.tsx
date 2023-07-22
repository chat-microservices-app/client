import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import Room from "../../types/Room";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 10,
    gap: 10,
  },
  columnContainer: {
    display: "flex",
    backgroundColor: "#202225",
    flexDirection: "row",
    borderColor: "white",
    borderWidth: 2,
    padding: 10,
    columnGap: 20,
    minWidth: "100%",
  },
  imageContainer: {
    alignSelf: "center",
  },
  itemText: {
    color: "white",
    fontWeight: "400",
    alignSelf: "center",
    fontSize: 28,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
});

function ChannelToRender({ item }: { item: Room }) {
  const router = useRouter();

  async function handleJoinRoom() {
    router.push(`/channel/${item.roomId}`);
  }

  return (
    <Pressable style={styles.columnContainer} onPress={() => handleJoinRoom()}>
      <View style={styles.imageContainer}>
        <Image style={styles.itemImage} source={{ uri: item.pictureUrl }} />
      </View>
      <Text style={styles.itemText}>{item.name}</Text>
    </Pressable>
  );
}

export default function ChannelList({ rooms }: { rooms: Room[] }) {
  return (
    <View style={styles.container}>
      {rooms.map((room) => (
        <ChannelToRender item={room} key={room.roomId} />
      ))}
    </View>
  );
}
