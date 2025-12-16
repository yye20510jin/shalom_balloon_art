import { useCallback, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebaseConfig";

export function useFirebaseSingleImageUpload({ folder = "posts" } = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadOne = useCallback(async (file) => {
    if (!file) throw new Error("NO_FILE");

    try {
      setIsUploading(true);
      setError("");

      const safeName = file.name.replace(/\s+/g, "_");
      const filePath = `${folder}/${Date.now()}_${safeName}`;
      const fileRef = ref(storage, filePath);

      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (e) {
      console.error(e);
      setError("이미지 업로드 중 오류가 발생했습니다.");
      throw e;
    } finally {
      setIsUploading(false);
    }
  }, [folder]);

  return { uploadOne, isUploading, error, setError };
}
