import { Pressable, useColorScheme } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import Colors from "../constants/Colors";

export default function CustomButton({
  name,
  size,
}: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  size: number;
}) {
  const colorScheme = useColorScheme();

  return (
    <Link href="/modal" asChild>
      <Pressable>
        {({ pressed }) => (
          <FontAwesome
            name={name}
            size={size}
            color={Colors[colorScheme ?? "light"].text}
            style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
    </Link>
  );
}
