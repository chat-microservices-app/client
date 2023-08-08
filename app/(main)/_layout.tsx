import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import {
  useGetPublicRoomsQuery,
  useGetRoomsJoinedQuery,
} from "../../Api/RoomApi";
import { useGetSessionQuery } from "../../Api/SessionApi";
import RoomsToShow from "../../components/ChannelList";
import CreateChannelButton from "../../components/CreateChannelButton";
import Button from "../../components/UI/Button";
import Drawer from "../../navigation/Drawer";
import { selectUsername } from "../../store/reducer/AuthSlice";

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

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const [hasUserJoinedTheRoom, sethasUserJoinedTheRoom] =
    useState<boolean>(true);
  const [roomsJoinedpage, setRoomsJoinedpage] = useState<number>(0);
  const [publicRoomsPage, setPublicRoomsPage] = useState<number>(0);
  const username = useSelector(selectUsername);
  const { data: session } = useGetSessionQuery(username);
  const { data: roomsJoined, isLoading } = useGetRoomsJoinedQuery({
    page: roomsJoinedpage,
    size: 10,
    userId: session?.userId as string,
  });

  const { data: publicRooms, isLoading: isPublicRoomsDataLoading } =
    useGetPublicRoomsQuery({
      page: publicRoomsPage,
      size: 10,
      userId: session?.userId as string,
    });

  async function getMoreRooms() {
    if (hasUserJoinedTheRoom) {
      if (roomsJoinedpage + 1 < (roomsJoined?.totalPages as number)) {
        setRoomsJoinedpage((prevPage) => prevPage + 1);
      }
      return;
    }

    if (publicRoomsPage + 1 < (publicRooms?.totalPages as number)) {
      setPublicRoomsPage((prevPage) => prevPage + 1);
    }
  }

  async function getPreviousRooms() {
    if (hasUserJoinedTheRoom) {
      if (roomsJoinedpage > 0) {
        setRoomsJoinedpage((prevPage) => prevPage - 1);
      }
      return;
    }
    if (publicRoomsPage > 0) {
      setPublicRoomsPage((prevPage) => prevPage - 1);
    }
  }

  const page = hasUserJoinedTheRoom ? roomsJoinedpage : publicRoomsPage;
  const totalPages = hasUserJoinedTheRoom
    ? (roomsJoined?.totalPages as number)
    : (publicRooms?.totalPages as number);

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
            sethasUserJoinedTheRoom(true);
          }}
        />
        <Button
          title="Rooms To join"
          onPress={() => {
            sethasUserJoinedTheRoom(false);
          }}
        />
      </View>
      <View style={[styles.topContainer, { flex: 1 }]}>
        {isLoading || isPublicRoomsDataLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <RoomsToShow
            page={page}
            size={10}
            hasUserJoinedTheRoom={hasUserJoinedTheRoom}
            setHasUserJoinedTheRoom={sethasUserJoinedTheRoom}
            roomsJoined={roomsJoined}
            publicRooms={publicRooms}
          />
        )}
      </View>
      <View style={styles.bottomContainer}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            width: "100%",
            padding: 0,
            margin: 0,
          }}
        >
          <Button
            style={{
              width: "40%",
              marginEnd: 0,
              marginStart: 0,
            }}
            disableButton={page === 0}
            onPress={() => getPreviousRooms()}
            title="previous rooms"
          />
          <Button
            style={{ width: "40%", marginEnd: 0, marginStart: 0 }}
            disableButton={
              page + 1 === (totalPages as number) || totalPages === 0
            }
            onPress={() => getMoreRooms()}
            title="next rooms"
          />
        </View>
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
