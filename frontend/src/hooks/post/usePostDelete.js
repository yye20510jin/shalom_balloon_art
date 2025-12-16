import { authFetch } from "../../api/authFetch";
import { useNavigate } from "react-router-dom";

export function usePostDelete(){
  const navigate = useNavigate();

  const deleteSubmit = async(index,setError) => {
    try {
          const res = await authFetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/${index}`,
              {
                method: "DELETE",
              }
            );
      
            if (!res || !res.ok) {
              const msg = res ? await res.text() : "서버 응답 없음";
              setError(msg || "게시글을 삭제하지 못했습니다.");
              return;           
            }

            setTimeout(()=>{
              navigate("/user/posts/postList");
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