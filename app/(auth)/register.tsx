import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RegisterForm from "../../components/RegisterForm";
import useRegister from "../../hooks/useRegister";

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
  text: {
    color: "white",
    fontWeight: "bold",
    marginVertical: 5,
    paddingBottom: 20,
    textAlign: "center",
  },
});

export default function RegisterScreen() {
  const { isLoading, isError, form, dispatch, submitForm, isImageLoading } =
    useRegister();

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Oops something is off</Text>
      </View>
    );
  }

  if (isLoading || isImageLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
        <View>
          <Text style={styles.text}>Waiting for assets to load...</Text>
        </View>
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
      contentContainerStyle={{
        paddingBottom: 20,
      }}
    >
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>Thank you for choosing us </Text>
      <Text style={styles.text}>ACCOUNT INFORMATION</Text>
      <RegisterForm dispatch={dispatch} form={form} submitForm={submitForm} />
    </ScrollView>
  );
}
