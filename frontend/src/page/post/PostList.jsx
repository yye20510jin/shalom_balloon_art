import { useEffect, useState } from "react";
import { authFetch } from "../../api/authFetch";
import { useNavigate } from "react-router-dom";

function PostList() {
  const [posts, setPosts] = useState([]);      // PostResponseDTO[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await authFetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts`,
          {
            method: "GET",
          }
        );

        if (!res || !res.ok) {
          const msg = res ? await res.text() : "서버 응답 없음";
          setError(msg || "게시글을 불러오지 못했습니다.");
          setLoading(false);
          return;
        }

        const data = await res.json(); 
        setPosts(data);
      } catch (e) {
        console.error(e);
        setError("서버 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString(); // 시스템 로케일 기준으로 표시
  };

  if (loading) {
    return <div style={{ padding: 20 }}>불러오는 중...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        에러: {error}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <div style={{ padding: 20 }}>등록된 게시글이 없습니다.</div>;
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2>게시글 목록</h2>

      {posts.map((post) => (
        <div
          key={post.index}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            display: "flex",
            gap: 16,
          }}
          onClick = {()=>navigate(`/user/posts/postDetails/${post.index}`)}
        >
        {/* 이미지 썸네일 */}

        {post.imageUrl && post.imageUrl.length > 0 &&
          post.imageUrl.map((url) => {
            return (
              <div key={url.index} style={{ flex: "0 0 120px" }}>
                <img
                  src={url.url}
                  alt={post.title}
                  style={{
                    width: "120px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              </div>
            );
          })
        }

          {/* 텍스트 영역 */}
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 8px" }}>{post.title}</h3>

            <div
              style={{
                fontSize: 12,
                color: "#666",
                marginBottom: 8,
              }}
            >
              작성일: {formatDateTime(post.createdAt)}
              {post.updatedAt && (
                <> · 수정일: {formatDateTime(post.updatedAt)}</>
              )}
            </div>

            <p
              style={{
                margin: "0 0 8px",
                whiteSpace: "pre-line",
              }}
            >
              {/* 내용 일부만 미리보기 */}
              {post.content && post.content.length > 80
                ? post.content.slice(0, 80) + "..."
                : post.content}
            </p>

            {/* 유튜브 링크가 있으면 표시 */}
            {post.youtubeUrl && (
              <a
                href={post.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 13, color: "#0066cc" }}
              >
                유튜브 보기 ↗
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;