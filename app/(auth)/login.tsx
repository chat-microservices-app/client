import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../Api/AuthApi";
import useSession from "../../hooks/useSession";
import { selectUsername, setCredentials } from "../../store/reducer/AuthSlice";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: 18,
    backgroundColor: "#36393E",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 10,
  },
  subtitle: {
    color: "lightgrey",
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#202225",
    marginVertical: 5,
    padding: 15,
    color: "white",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#5964E8",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonPressed: {
    backgroundColor: "#5964E8",
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  forgotPasswordText: {
    color: "#4CABEB",
    marginVertical: 5,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    marginVertical: 5,
  },
});

export default function Login() {
  const usernameFetched = useSelector(selectUsername);
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>("union");
  const [password, setPassword] = useState<string>("123");
  const { isLoading: isSessionLoading } = useSession();

  const [login, { isLoading }] = useLoginMutation();

  async function handleLogin() {
    try {
      const data = await login({ username, password }).unwrap();
      dispatch(
        setCredentials({
          accessToken: data?.accessToken,
          refreshToken: data?.refreshToken,
          username: data?.username,
        })
      );
    } catch (err) {
      console.debug(err);
    }
  }

  if (isLoading || isSessionLoading) {
    return (
      <View style={[styles.container, { flex: 1 }]}>
        <ActivityIndicator size="large" color="white" />
        <Text>Registering wait {usernameFetched}...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      automaticallyAdjustContentInsets
      automaticallyAdjustKeyboardInsets
      overScrollMode="always"
      bounces
      bouncesZoom
      contentContainerStyle={{
        paddingBottom: 20,
      }}
    >
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>We are so excited to see you again</Text>
      <Text style={styles.text}>ACCOUNT INFORMATION</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="grey"
        placeholder="Email or Username"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="grey"
        placeholder="Password"
      />
      <Text style={styles.forgotPasswordText}>Forgot password?</Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => handleLogin()}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </ScrollView>
  );
}
