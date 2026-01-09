import { ref, deleteObject, getStorage } from "firebase/storage";
import {useState} from "react";
export function useFirebaseSingleImageRemove() {
    
    const [imgRemoveError, setImgRemoveError] = useState("");

    const removeOne = async (url) => {
        if (!url) return{ok:false,reason:"no-url"};

        try {
            const targetUrl = url;
            const storage = getStorage();
            const imageRef = ref(storage, targetUrl);
            await deleteObject(imageRef);
            return {ok:true}
        } catch (err) {
            setImgRemoveError("이미지 삭제 실패");
            return{ok:false, reason:"error", error:err};
        }
    };

    const removeTiptapImage = async (src) => {
        if (!src) return;

        try {
            const targetUrl = src;
            const storage = getStorage();
            const imageRef = ref(storage, targetUrl);
            await deleteObject(imageRef);
        } catch (err) {
            console.error(err);
            setImgRemoveError("이미지 삭제 실패");
        }
    };

    return { removeOne,removeTiptapImage, imgRemoveError };
}