import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import useMediaSelection from "../../hooks/useMediaSelection";
import { SignUpFormValues, singUpFormSchema } from "./formValidation";

const styles = StyleSheet.create({
  dateTimePicker: {
    alignSelf: "flex-start",
  },
  dateWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
  },
  errorMessageText: {
    color: "#B00020",
    fontSize: 12,
    fontWeight: "bold",
    marginHorizontal: 4,
  },
  dateInput: {
    flex: 1,
    minWidth: "100%",
    backgroundColor: "#202225",
    marginVertical: 5,
    color: "white",
    borderRadius: 5,
  },
  input: {
    display: "flex",
    flexBasis: "40%",
    flexShrink: 0,
    flexGrow: 1,
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
  label: {
    fontWeight: "bold",
    color: "white",
    marginVertical: 5,
    paddingBottom: 20,
    textAlign: "center",
  },
});

export default function RegisterForm({
  submitForm,
}: {
  submitForm: (form: SignUpFormValues) => Promise<void>;
}) {
  const [isCalendarOpenForAndroid, setIsCalendarOpenForAndroid] =
    useState<boolean>(false);

  const methods = useForm<SignUpFormValues>({
    resolver: zodResolver(singUpFormSchema),
    defaultValues: {
      dateOfBirth: new Date(),
      password: {
        password: "",
        confirmPassword: "",
      },
      name: {
        firstName: "",
        lastName: "",
      },
      profilePicture: {
        uri: "https://avachara.com/avatar/img/m_face/1.png",
        type: "image",
        width: 100,
        height: 100,
      },
    },
    mode: "onBlur",
  });

  const { openImagePicker, image } = useMediaSelection();

  async function imagePicker() {
    await openImagePicker();
    if (image.current) {
      const {
        uri,
        fileName,
        type,
        height,
        width,
        assetId,
        base64,
        fileSize,
        duration,
      } = image.current;
      methods.setValue("profilePicture", {
        uri,
        type: type as string,
        width,
        height,
        assetId: assetId as string,
        base64: base64 as string,
        fileName: fileName as string,
        fileSize: fileSize as number,
        duration: duration as number,
      });
    }
  }

  return (
    <View style={{ display: "flex", rowGap: 12 }}>
      <FormProvider {...methods}>
        <Controller
          control={methods.control}
          name="profilePicture"
          render={({ field: { value } }) => {
            return (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 100,
                    height: 105,
                    width: 105,
                    borderColor: "#5964E8",
                    borderWidth: 2,
                    backgroundColor: "gray",
                    marginVertical: 10,
                  }}
                  onPress={() => imagePicker()}
                >
                  <Image
                    style={{
                      borderRadius: 50,
                    }}
                    source={{
                      uri: `${value?.uri}`,
                      height: 100,
                      width: 100,
                    }}
                  />
                  <AntDesign
                    name="pluscircleo"
                    size={25}
                    color="white"
                    style={{ position: "absolute", bottom: 0, right: 0 }}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <Controller
          control={methods.control}
          name="username"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <View>
              {!!error?.message && (
                <Text style={styles.errorMessageText}>{error.message}</Text>
              )}
              <TextInput
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                style={styles.input}
                placeholderTextColor="grey"
                placeholder="Username"
              />
            </View>
          )}
        />
        <Controller
          control={methods.control}
          name="name"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
            formState: { errors },
          }) => {
            return (
              <>
                <View>
                  {!!error?.message && (
                    <Text style={styles.errorMessageText}>
                      {error?.message}
                    </Text>
                  )}
                  {!!errors?.name?.firstName && (
                    <Text style={styles.errorMessageText}>
                      {errors.name?.firstName?.message}
                    </Text>
                  )}
                  {!!errors?.name?.lastName && (
                    <Text style={styles.errorMessageText}>
                      {errors.name?.lastName?.message}
                    </Text>
                  )}
                </View>
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
                    autoComplete="name"
                    onBlur={onBlur}
                    autoCapitalize="sentences"
                    value={value.firstName}
                    autoCorrect
                    onChangeText={(text) => {
                      onChange({
                        ...value,
                        firstName: text,
                      });
                    }}
                    placeholderTextColor="grey"
                    placeholder="First Name"
                  />
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    autoCapitalize="sentences"
                    autoComplete="name"
                    autoCorrect
                    value={value.lastName}
                    onChangeText={(text) => {
                      onChange({
                        ...value,
                        lastName: text,
                      });
                    }}
                    placeholderTextColor="grey"
                    placeholder="Last Name"
                  />
                </View>
              </>
            );
          }}
        />
        <Controller
          control={methods.control}
          name="email"
          render={({
            field: { onBlur, onChange, value },
            fieldState: { error },
          }) => {
            return (
              <View>
                {!!error?.message && (
                  <Text style={styles.errorMessageText}>{error.message}</Text>
                )}
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="grey"
                  placeholder="Email"
                />
              </View>
            );
          }}
        />

        <Controller
          control={methods.control}
          name="password"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
            formState: { errors },
          }) => {
            return (
              <>
                <View>
                  {!!error?.message && (
                    <Text style={styles.errorMessageText}>
                      {error?.message}
                    </Text>
                  )}
                  {!!errors?.password?.password && (
                    <Text style={styles.errorMessageText}>
                      {errors.password?.password?.message}
                    </Text>
                  )}
                  {!!errors?.password?.confirmPassword && (
                    <Text style={styles.errorMessageText}>
                      {errors.password?.confirmPassword?.message}
                    </Text>
                  )}
                </View>
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
                    value={value.password}
                    secureTextEntry
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange({
                        ...value,
                        password: text,
                      });
                    }}
                    style={styles.input}
                    placeholderTextColor="grey"
                    placeholder="Enter Password"
                  />
                  <TextInput
                    onBlur={onBlur}
                    value={value.confirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    onChangeText={(text) => {
                      onChange({
                        ...value,
                        confirmPassword: text,
                      });
                    }}
                    style={styles.input}
                    placeholderTextColor="grey"
                    placeholder="Repeat Your Password"
                  />
                </View>
              </>
            );
          }}
        />

        <Controller
          control={methods.control}
          name="dateOfBirth"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <>
                {!!error?.message && (
                  <Text style={styles.errorMessageText}>{error.message}</Text>
                )}
                <View style={styles.dateWrapper}>
                  {Platform.OS === "android" && (
                    <TouchableOpacity
                      onPress={() => {
                        setIsCalendarOpenForAndroid(true);
                      }}
                      style={styles.dateInput}
                    >
                      <Text style={styles.input}>
                        {value.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {(isCalendarOpenForAndroid || Platform.OS !== "android") && (
                    <RNDateTimePicker
                      value={value}
                      style={styles.dateTimePicker}
                      mode="date"
                      onChange={(e) => {
                        if (Platform.OS === "android") {
                          setIsCalendarOpenForAndroid(false);
                        }

                        if (e.type === "set" && e.nativeEvent.timestamp) {
                          onChange(new Date(e.nativeEvent.timestamp));
                          methods.trigger("dateOfBirth");
                        }
                      }}
                    />
                  )}
                </View>
              </>
            );
          }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // get current form values
            const currFormValues = methods.getValues();
            // https://zod.dev/?id=safeparse
            const result = singUpFormSchema.safeParse(currFormValues);

            if (!result.success) {
              console.log(
                "form is invalid",
                JSON.stringify(result.error.formErrors.fieldErrors)
              );

              const error = result.error.formErrors.fieldErrors;
              Object.keys(error).forEach((key) => {
                // get the first error
                const errorField = key as keyof SignUpFormValues;
                const errorFieldError = error[errorField]![0];
                methods.setError(errorField, {
                  type: "manual",
                  message: errorFieldError,
                });
              });
            } else {
              console.info("form is valid");
              submitForm(result.data);
            }
          }}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </FormProvider>
    </View>
  );
}
