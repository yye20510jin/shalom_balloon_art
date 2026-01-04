import { authFetch } from "../../api/authFetch";
import { useNavigate } from "react-router-dom";
import { firebaseDownloadUrlToObjectPath } from "../firebase/firebaseDownloadUrlToObjectPath";

export function usePostDelete(){
  const navigate = useNavigate();

  const deleteSubmit = async(index,setError,contentHtml) => {
    const doc = new DOMParser().parseFromString(contentHtml, "text/html");
    const srcs = Array.from(doc.querySelectorAll("img")).map(img => img.getAttribute("src")).filter(Boolean);
    const imagUrls = Array.from(new Set(srcs));
    const imagePaths  = imagUrls.map(firebaseDownloadUrlToObjectPath).filter(Boolean);
    console.log("imagePaths: " + imagePaths);
    try {
          const res = await authFetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/${index}`,
              {
                method: "DELETE",
                body:JSON.stringify(
                  imagePaths,
                ),
              }
            );
      
            if (!res || !res.ok) {
              const msg = res ? await res.text() : "서버 응답 없음";
              setError(msg || "게시글을 삭제하지 못했습니다.");
              return;           
            }

            setTimeout(()=>{
              navigate("/user/posts/postList",{replace: true});
            },800);

            } catch (e) {
            console.error(e);
              setError("삭제 도중 오류가 발생했습니다.");
              return;
            }
  }

  return{
    deleteSubmit
  };
}