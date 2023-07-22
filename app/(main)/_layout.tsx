import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useGetRoomsQuery } from "../../Api/RoomApi";
import ChannelList from "../../components/ChannelList";
import CreateChannelButton from "../../components/CreateChannelButton";
import Drawer from "../../navigation/Drawer";

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingVertical: 10,
    flex: 1,
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
  },
});

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { data, isLoading } = useGetRoomsQuery({
    page: 0,
    size: 10,
  });

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{}}>
      <Text style={styles.title}>Channels</Text>
      <View style={styles.topContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <ChannelList rooms={data?.rooms ?? []} />
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
    <Drawer drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="welcome" options={{ title: "welcome" }} />
      <Drawer.Screen
        name="channel/create"
        options={{ title: "create channel" }}
      />
      <Drawer.Screen name="channel/[id]" options={{ title: "channel" }} />
    </Drawer>
  );
}
