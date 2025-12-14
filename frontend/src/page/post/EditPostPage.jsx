import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../../components/post/PostForm";
import { authFetch } from "../../api/authFetch";

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 기존 글 + 이미지 정보 조회
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/${id}`, {
          method: "GET",
        });

        if (!res||!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "게시글을 불러오지 못했습니다.");
        }

        const data = await res.json();

        // 백엔드 응답 형태에 맞게 매핑
        const imageUrlsFromServer = (data.imageUrl ? data.imageUrl.map((img) => img.url) : []);

        setInitialValues({
          id: id ? Number(id) : null,
          title: data.title,
          content: data.content,
          youtubeUrl: data.youtubeUrl || "",
          imageUrls: imageUrlsFromServer,
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "게시글 조회 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return <div style={{ padding: 20 }}>로딩 중...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        {error}
      </div>
    );
  }

  if (!initialValues) {
    return (
      <div style={{ padding: 20 }}>
        게시글 정보가 없습니다.
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <PostForm
        mode="edit"
        initialValues={initialValues}
      />
    </div>
  );
}

export default EditPostPage;