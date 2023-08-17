import { ImagePickerAsset } from "expo-image-picker";
import { useReducer } from "react";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../Api/AuthApi";
import { useUploadProfilePictureMutation } from "../Api/MediaApi";
import { setCredentials } from "../store/reducer/AuthSlice";
import RegisterForm from "../types/RegisterForm";
import convertImageToCustomFile from "../utils/imageUtils";
import useSession from "./useSession";

export interface StateFormReducer extends Omit<RegisterForm, "pictureUrl"> {
  rePassword: string;
  pictureUrl: ImagePickerAsset;
}
const initialState: StateFormReducer = {
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  password: "",
  rePassword: "",
  pictureUrl: {} as ImagePickerAsset,
};

export interface ActionFormReducer extends StateFormReducer {
  type: string;
}

export const reducerTypes = {
  SET_USERNAME: "SET_USERNAME",
  SET_FIRST_NAME: "SET_NAME",
  SET_LAST_NAME: "SET_LAST_NAME",
  SET_PASSWORD: "SET_PASSWORD",
  SET_RE_PASSWORD: "SET_RE_PASSWORD",
  SET_DATE_OF_BIRTH: "SET_DATE_OF_BIRTH",
  SET_EMAIL: "SET_EMAIL",
  SET_PICTURE: "SET_PICTURE",
} as const;

const reducerForm = (state: StateFormReducer, action: ActionFormReducer) => {
  switch (action.type) {
    case reducerTypes.SET_USERNAME: {
      const { username } = action;
      return { ...state, username };
    }
    case reducerTypes.SET_FIRST_NAME: {
      const { firstName } = action;
      return { ...state, firstName };
    }
    case reducerTypes.SET_LAST_NAME: {
      const { lastName } = action;
      return { ...state, lastName };
    }
    case reducerTypes.SET_PASSWORD: {
      const { password } = action;
      return { ...state, password };
    }
    case reducerTypes.SET_RE_PASSWORD: {
      const { rePassword } = action;
      return { ...state, rePassword };
    }
    case reducerTypes.SET_DATE_OF_BIRTH: {
      const { dateOfBirth } = action;
      return { ...state, dateOfBirth };
    }
    case reducerTypes.SET_EMAIL: {
      const { email } = action;
      return { ...state, email };
    }
    case reducerTypes.SET_PICTURE: {
      const { pictureUrl } = action;
      return { ...state, pictureUrl };
    }
    default:
      throw new Error("Invalid action type");
  }
};

export default function useRegister() {
  const [form, dispatch] = useReducer(reducerForm, initialState);
  const toDispatch = useDispatch();
  const [uploadImage, { isLoading: isImageLoading }] =
    useUploadProfilePictureMutation();
  const [register, { isError, isLoading, isSuccess }] = useRegisterMutation();

  const {
    isError: isSessionError,
    isLoading: isSessionLoading,
    isSuccess: isSessionSuccess,
  } = useSession();

  async function submitForm() {
    const dateOfBirth = form.dateOfBirth as string;
    const newDate = new Date(dateOfBirth);
    const toSubmit: RegisterForm = {
      ...form,
      pictureUrl: "",
      dateOfBirth: newDate.toISOString(),
    };

    try {
      const stream = await convertImageToCustomFile(form.pictureUrl);
      const data = await register(toSubmit).unwrap();
      const media = new FormData();
      // ignore the type mismatch
      media.append("file", stream as never);

      await uploadImage({
        media,
        userId: data?.username,
        token: data?.accessToken,
      }).unwrap();
      toDispatch(
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
    form,
    dispatch,
    submitForm,
  };
}
