import * as ImagePicker from "expo-image-picker";
import { useRef } from "react";

export default function useMediaSelection() {
  const image = useRef<ImagePicker.ImagePickerAsset | null>(null);
  const openImagePicker = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      image.current = asset;
    }
  };
  return {
    openImagePicker,
    image,
  };
}
