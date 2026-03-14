import { useEffect, useState } from "react";
import { getJson } from "../../api/getJson";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../post/PostForm";
import { authFetch } from "../../api/authFetch";

function EditPostPage() {
  const { id } = useParams();
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

        const data = await getJson(res);

        if (!res.ok) {
          setError(data.message || "게시글을 불러오지 못했습니다.");
        }
        
        setInitialValues({
          id: id ? Number(id) : null,
          title: data.title,
          thumbnailUrl : data.thumbnailUrl,
          contentHtml : data.contentHtml,
          postTags : data.postTags,
          supplies : data.supplies
        });
      } catch (err) {
        console.error(err);
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
      <div className="i-errMessage">
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