import { authFetch } from "../../api/authFetch";
import { useNavigate } from "react-router-dom";
import { firebaseDownloadUrlToObjectPath } from "../firebase/firebaseDownloadUrlToObjectPath";
import { getJson } from "../../api/getJson";
export function usePostDelete(){
  const navigate = useNavigate();

  const deleteSubmit = async(index,setError,contentHtml) => {
    const doc = new DOMParser().parseFromString(contentHtml, "text/html");
    const srcs = Array.from(doc.querySelectorAll("img")).map(img => img.getAttribute("src")).filter(Boolean);
    const imagUrls = Array.from(new Set(srcs));
    const imagePaths  = imagUrls.map(firebaseDownloadUrlToObjectPath).filter(Boolean);
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
      
            if (!res.ok) {
              const data = await getJson(res);
              setError(data.message || "게시글을 삭제하지 못했습니다.");
              return;           
            }

            setTimeout(()=>{
              navigate("/user/posts/postList",{replace: true});
            },800);

            } catch (err) {
            console.error(err);
              return;
            }
  }

  return{
    deleteSubmit
  };
}