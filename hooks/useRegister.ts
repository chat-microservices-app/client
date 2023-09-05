import { ImagePickerAsset } from "expo-image-picker";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../Api/AuthApi";
import { useUploadProfilePictureMutation } from "../Api/MediaApi";
import { setCredentials } from "../store/reducer/AuthSlice";
import RegisterForm from "../types/RegisterForm";
import convertImageToCustomFile from "../utils/imageUtils";
import useSession from "./useSession";
import { SignUpFormValues } from "../components/RegisterForm/formValidation";

export interface StateFormReducer extends Omit<RegisterForm, "pictureUrl"> {
  rePassword: string;
  pictureUrl: ImagePickerAsset;
}

export default function useRegister() {
  const dispatch = useDispatch();
  const [uploadImage, { isLoading: isImageLoading }] =
    useUploadProfilePictureMutation();
  const [register, { isError, isLoading, isSuccess }] = useRegisterMutation();

  const {
    isError: isSessionError,
    isLoading: isSessionLoading,
    isSuccess: isSessionSuccess,
  } = useSession();

  async function submitForm(form: SignUpFormValues) {
    const { dateOfBirth, email, name, password, profilePicture, username } =
      form;
    const toSubmit: RegisterForm = {
      username,
      email,
      firstName: name.firstName,
      lastName: name.lastName,
      password: password.password,
      pictureUrl: "",
      dateOfBirth: dateOfBirth.toISOString(),
    };

    try {
      const stream = await convertImageToCustomFile(
        profilePicture as ImagePickerAsset
      );
      const data = await register(toSubmit).unwrap();
      const media = new FormData();
      // ignore the type mismatch
      media.append("file", stream as never);

      await uploadImage({
        media,
        userId: data?.username,
        token: data?.accessToken,
      }).unwrap();
      dispatch(
        setCredentials({
          accessToken: data?.accessToken,
          refreshToken: data?.refreshToken,
          username: data?.username,
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  if (isSessionError) {
    throw new Error("Session error");
  }

  return {
    isSessionError,
    isImageLoading,
    isSessionLoading,
    isSessionSuccess,
    isError,
    isLoading,
    isSuccess,
    submitForm,
  };
}
