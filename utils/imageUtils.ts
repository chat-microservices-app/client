import { ImagePickerAsset } from "expo-image-picker";
import { Platform } from "react-native";

function getImageExtension(imageUri: string): string {
  if (imageUri.includes("data:")) return imageUri.split("/")[1].split(";")[0];
  const parts = imageUri.split(".");
  return parts[parts.length - 1];
}

async function createBlobFromBase64Image(base64Image: string): Promise<Blob> {
  try {
    return await fetch(base64Image).then((res) => res.blob());
  } catch (e) {
    throw new Error("Error while creating blob from base64 image");
  }
}
export default async function convertImageToCustomFile(
  image: ImagePickerAsset
): Promise<{ name: string; type: string; uri: string } | Blob> {
  const { uri, fileName } = image;
  const isMobile = Platform.OS === "android" || Platform.OS === "ios";
  const extension = getImageExtension(uri);

  // if it is mobile, we return a custom file
  if (isMobile) {
    return {
      name: fileName ?? `image.${extension}`,
      type: `image/${extension}`,
      uri,
    };
  }

  // otherwise, we return a blob
  const blob = await createBlobFromBase64Image(uri);

  return new File([blob], fileName ?? `image.${extension}`, {
    type: `image/${extension}`,
  });
}
