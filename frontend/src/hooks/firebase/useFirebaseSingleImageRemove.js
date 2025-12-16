import { ref, deleteObject, getStorage } from "firebase/storage";
export function useFirebaseSingleImageRemove() {

    const removeOne = async (url, setThumbError, setThumbnailUrl) => {
        if (!url) return;

        try {
            const targetUrl = url;
            const storage = getStorage();
            const imageRef = ref(storage, targetUrl);
            await deleteObject(imageRef);
            setThumbnailUrl("");
        } catch (err) {
            setThumbError("이미지 삭제 실패");
        }
    };

    return { removeOne };
}