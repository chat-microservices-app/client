import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  ActionFormReducer,
  StateFormReducer,
  reducerTypes,
} from "../../hooks/useRegister";

const styles = StyleSheet.create({
  input: {
    flex: 1,
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
    backgroundColor: "#4CABEB",
    opacity: 0.6,
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
    paddingBottom: 20,
    textAlign: "center",
  },
});

export default function RegisterForm({
  form,
  dispatch,
  submitForm,
}: {
  form: StateFormReducer;
  dispatch: React.Dispatch<ActionFormReducer>;
  submitForm: () => Promise<void>;
}) {
  const {
    username,
    firstName,
    lastName,
    email,
    dateOfBirth,
    password,
    pictureUrl,
    rePassword,
  } = form;
  return (
    <View style={{ display: "flex", rowGap: 12 }}>
      <TextInput
        value={username}
        onChangeText={(text: string) => {
          dispatch({
            ...form,
            type: reducerTypes.SET_USERNAME,
            username: text,
          });
        }}
        style={styles.input}
        placeholderTextColor="grey"
        placeholder="Username"
      />
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          overflow: "hidden",
          columnGap: 15,
        }}
      >
        <TextInput
          style={styles.input}
          autoCapitalize="sentences"
          value={firstName}
          autoCorrect
          onChangeText={(text) => {
            dispatch({
              ...form,
              type: reducerTypes.SET_FIRST_NAME,
              firstName: text,
            });
          }}
          placeholderTextColor="grey"
          placeholder="First Name"
        />
        <TextInput
          style={styles.input}
          autoCapitalize="sentences"
          autoComplete="name"
          autoCorrect
          value={lastName}
          onChangeText={(text) => {
            dispatch({
              ...form,
              type: reducerTypes.SET_LAST_NAME,
              lastName: text,
            });
          }}
          placeholderTextColor="grey"
          placeholder="Last Name"
        />
      </View>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          dispatch({
            ...form,
            type: reducerTypes.SET_EMAIL,
            email: text,
          });
        }}
        placeholderTextColor="grey"
        placeholder="Email"
      />
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          overflow: "hidden",
          columnGap: 15,
        }}
      >
        <TextInput
          value={password}
          onChangeText={(text) => {
            dispatch({
              ...form,
              type: reducerTypes.SET_PASSWORD,
              password: text,
            });
          }}
          style={styles.input}
          autoComplete="password"
          autoCapitalize="none"
          secureTextEntry
          placeholderTextColor="grey"
          placeholder="Password"
        />
        <TextInput
          value={rePassword}
          secureTextEntry
          autoCapitalize="none"
          onChangeText={(text: string) => {
            dispatch({
              ...form,
              type: reducerTypes.SET_RE_PASSWORD,
              rePassword: text,
            });
          }}
          style={styles.input}
          placeholderTextColor="grey"
          placeholder="Repeat Your Password"
        />
      </View>
      <TextInput
        value={pictureUrl}
        autoCapitalize="none"
        onChangeText={(text) => {
          dispatch({
            ...form,
            type: reducerTypes.SET_PICTURE,
            pictureUrl: text,
          });
        }}
        keyboardType="url"
        style={styles.input}
        placeholderTextColor="grey"
        placeholder="Picture as URL"
      />
      <TextInput
        value={dateOfBirth as string}
        autoCapitalize="none"
        autoComplete="birthdate-full"
        keyboardType="numbers-and-punctuation"
        onChangeText={(text) => {
          dispatch({
            ...form,
            type: reducerTypes.SET_DATE_OF_BIRTH,
            dateOfBirth: text,
          });
        }}
        style={styles.input}
        placeholderTextColor="grey"
        placeholder="DD-MM-YYYY"
      />
      <Pressable
        style={styles.button}
        onPress={() => {
          submitForm();
        }}
      >
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
    </View>
  );
}
