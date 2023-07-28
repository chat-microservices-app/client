import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import {
  useGetRoomsJoinedQuery,
  useLazyGetPublicRoomsQuery,
} from "../../Api/RoomApi";
import { useGetSessionQuery } from "../../Api/SessionApi";
import ChannelList from "../../components/ChannelList";
import CreateChannelButton from "../../components/CreateChannelButton";
import Button from "../../components/UI/Button";
import Drawer from "../../navigation/Drawer";
import { selectUsername } from "../../store/reducer/AuthSlice";
import Room from "../../types/Room";

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginVertical: 10,
  },
  bottomContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
});

function RoomsToShow({
  isRoomJoined,
  roomsJoined,
  publicRooms,
  setIsRoomJoined,
}: {
  isRoomJoined: boolean;
  setIsRoomJoined: React.Dispatch<React.SetStateAction<boolean>>;
  roomsJoined: Room[] | undefined;
  publicRooms: Room[] | undefined;
}) {
  return isRoomJoined ? (
    <ChannelList
      rooms={publicRooms ?? []}
      isRoomJoined={isRoomJoined}
      setIsRoomJoined={setIsRoomJoined}
    />
  ) : (
    <ChannelList
      rooms={roomsJoined ?? []}
      isRoomJoined={isRoomJoined}
      setIsRoomJoined={setIsRoomJoined}
    />
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const [isRoomJoined, setIsRoomJoined] = useState<boolean>(false);
  const username = useSelector(selectUsername);
  const { data: session } = useGetSessionQuery(username);
  const { data: roomsJoined, isLoading } = useGetRoomsJoinedQuery({
    page: 0,
    size: 10,
    userId: session?.userId as string,
  });

  const [
    getPublicRooms,
    { isLoading: isPublicRoomsDataLoading, data: publicRooms },
  ] = useLazyGetPublicRoomsQuery();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        padding: 0,
        margin: 0,
      }}
    >
      <Text style={styles.title}>Channels</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 0,
        }}
      >
        <Button
          title="My Rooms"
          onPress={() => {
            setIsRoomJoined(false);
          }}
        />
        <Button
          title="Rooms To join"
          onPress={() => {
            getPublicRooms({
              page: 0,
              size: 10,
              userId: session?.userId as string,
            });
            setIsRoomJoined(true);
          }}
        />
      </View>
      <View style={[styles.topContainer, { flex: 1 }]}>
        {isLoading || isPublicRoomsDataLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <RoomsToShow
            isRoomJoined={isRoomJoined}
            setIsRoomJoined={setIsRoomJoined}
            roomsJoined={roomsJoined?.rooms}
            publicRooms={publicRooms?.rooms}
          />
        )}
      </View>
      <View style={styles.bottomContainer}>
        <CreateChannelButton />
      </View>
    </DrawerContentScrollView>
  );
}

export default function Mainlayout() {
  return (
    <Drawer drawerContent={CustomDrawerContent} initialRouteName="welcome">
      <Drawer.Screen name="welcome" options={{ title: "welcome" }} />
      <Drawer.Screen
        name="channel/create"
        options={{ title: "create channel" }}
      />
      <Drawer.Screen name="channel/[id]" options={{ title: "channel" }} />
      <Drawer.Screen
        name="channel/join"
        options={{ title: "Join this channel" }}
      />
    </Drawer>
  );
}
