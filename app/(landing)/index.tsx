import { useRouter } from "expo-router";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "column",
    minWidth: "100%",
    flexGrow: 1,
    paddingHorizontal: 50,
    paddingVertical: 40,
    gap: 20,
  },
  registerButton: {
    minWidth: "100%",
    backgroundColor: "#5964E8",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  registerPressed: {
    backgroundColor: "#303371",
    alignItems: "center",
    padding: 15,
  },
  signInButton: {
    minWidth: "100%",
    backgroundColor: "gray",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  signInPressed: {
    backgroundColor: "#6668",
    alignItems: "center",
    padding: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});

const image = {
  uri: "https://png.pngtree.com/background/20210709/original/pngtree-black-minimalist-atmospheric-wooden-background-picture-image_965794.jpg",
};

export default function LandingPage() {
  const router = useRouter();

  return (
    <ImageBackground source={image} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Pressable
          style={({ pressed }) => [
            styles.registerButton,
            pressed && styles.registerPressed,
          ]}
          onPress={() => {
            router.push("/register");
          }}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.signInButton,
            pressed && styles.signInPressed,
          ]}
          onPress={() => {
            router.push("/login");
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}
