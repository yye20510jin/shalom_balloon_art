import { useEffect, useState } from "react";
import { authFetch } from "../../api/authFetch";
import {useParams, useNavigate} from "react-router-dom";
import {PostDelete} from "./PostDelete"

function PostDetails() {
  const [post, setPost] = useState([]);      // PostResponseDTO[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {id} = useParams();

  const navigate = useNavigate();

  const{deleteSubmit}=PostDelete();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await authFetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/${id}`,
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
        setPost(data);
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

  if (!post || post.length === 0) {
    return <div style={{ padding: 20 }}>등록된 게시글이 없습니다.</div>;
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2>{post.title}</h2>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            display: "flex",
            gap: 16,
          }}
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
              {post.content}

            </p>

            {/* 유튜브 링크가 있으면 표시 */}
      {post.youtubeUrl && (
        <div style={{ marginTop: 12 }}>
          <p>YouTube 미리보기</p>
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              title="YouTube Preview"
              src={`https://www.youtube.com/embed/${post.youtubeUrl}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allowFullScreen
            />
          </div>
        </div>
      )}
          </div>
        </div>
        <button onClick={()=>navigate(`/posts/editPostPage/${id}`)}>수정</button>
        <button onClick={()=>{deleteSubmit(post.index,setError)}}>삭제</button>
    </div>
  );
}

export default PostDetails;