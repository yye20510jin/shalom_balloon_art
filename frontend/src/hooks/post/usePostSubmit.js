// src/components/PostEditor/usePostSubmit.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch";

export function usePostSubmit() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();


// -------------- 서버 전송 ----------------

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

      if (!res.ok) {
        const text = res ? await res.text() : "요청 실패";
        throw new Error(text || "게시글 저장에 실패했습니다.");
      }

      if(mode === "create"){
      setSuccessMessage("게시글이 작성되었습니다.");
      setTimeout(() => {
        navigate("/user/posts/postList/list");
      }, 800);
      }else{
      setSuccessMessage("게시글이 수정되었습니다.");
      setTimeout(() => {
        navigate(`/user/posts/postDetails/${id}`); 
      }, 800);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "서버 오류가 발생했습니다.");
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
