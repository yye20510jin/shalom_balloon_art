// src/components/PostEditor/usePostSubmit.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch";

export function usePostSubmit() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e,mode) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해 주세요.");
      return;
    }

    const payload = {
      index: id || null,
      title: title.trim(),
      content: content.trim(),
      imageUrls: imageUrls.length > 0 ? imageUrls : null,
      youtubeUrl: youtubeUrl.trim() || null,
    };

    try {
      setIsSubmitting(true);
      let res;

      if(mode === "create"){
      console.log("payload",payload);
      res = await authFetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      }else if(mode === "edit"){
      res = await authFetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
              
      }else{
        throw new Error("게시글 저장에 실패했습니다.");
      }

      if (!res || !res.ok) {
        const text = res ? await res.text() : "요청 실패";
        throw new Error(text || "게시글 저장에 실패했습니다.");
      }

      if(mode === "create"){
      setSuccessMessage("게시글이 작성되었습니다.");
      setTimeout(() => {
        navigate("/posts/postList"); // 라우트 이름은 너 프로젝트에 맞게
      }, 800);
      }else{
      setSuccessMessage("게시글이 수정되었습니다.");
      setTimeout(() => {
        navigate(`/posts/postDetails/${id}`); // 라우트 이름은 너 프로젝트에 맞게
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
    content,
    setContent,
    imageUrls,
    setImageUrls,
    youtubeUrl,
    setYoutubeUrl,
    error,
    successMessage,
    isSubmitting,
    handleSubmit,
  };
}
