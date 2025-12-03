// src/components/PostEditor/usePostSubmit.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../api/authFetch";

export function usePostSubmit() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해 주세요.");
      return;
    }

    const payload = {
      title: title.trim(),
      content: content.trim(),
      imageUrls: imageUrl.length > 0 ? imageUrl : null,
      youtubeUrl: youtubeUrl.trim() || null,
    };

    try {
      setIsSubmitting(true);

      const res = await authFetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!res || !res.ok) {
        const text = res ? await res.text() : "요청 실패";
        throw new Error(text || "게시글 저장에 실패했습니다.");
      }

      setSuccessMessage("게시글이 작성되었습니다.");
      setTimeout(() => {
        navigate("/posts/postList"); // 라우트 이름은 너 프로젝트에 맞게
      }, 800);
    } catch (err) {
      console.error(err);
      setError(err.message || "서버 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    imageUrl,
    setImageUrl,
    youtubeUrl,
    setYoutubeUrl,
    error,
    successMessage,
    isSubmitting,
    handleSubmit,
  };
}
