import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch";
import { getJson } from "../../api/getJson";

export function usePostSubmit() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();


  const handleSubmit = async (mode,contentHtml,thumbnailUrl, tagSelected, supplies) => {
    setError("");
    setSuccessMessage("");

    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    
    const payload = {
      title: title.trim(),
      contentHtml,
      thumbnailUrl,
      postTag: tagSelected,
      supplies
    };

    try {
      setIsSubmitting(true);
      const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts${mode === "edit" ? `/${id}` : ""}`,{
        method : mode === "edit" ? "PUT":"POST",
        body : JSON.stringify(payload),
      });

      const data = await getJson(res);

      if (!res.ok) {
        throw new Error(data.message || "게시글 저장에 실패했습니다.");
      }

      if(mode === "create"){
      setSuccessMessage("게시글이 작성되었습니다.");
      setTimeout(() => {
        navigate("/user/posts/postList");
      }, 800);
      }else{
      setSuccessMessage("게시글이 수정되었습니다.");
      setTimeout(() => {
        navigate(`/user/posts/postDetails/${id}`); 
      }, 800);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    id,
    setId,
    title,
    setTitle,
    error,
    successMessage,
    isSubmitting,
    handleSubmit
  };
}
