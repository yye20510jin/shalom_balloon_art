import { useEffect, useState, useContext } from "react";
import { authFetch } from "../../api/authFetch";
import AuthContext from "../../auth/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { usePostDelete } from "../../hooks/post/usePostDelete";
import SimilarPostList from "../../components/post/SimilarPostList";
import YoutubeFallbackWrapper from "../../components/post/YoutubeFallbackWrapper";
import Navbar from "../../components/common/Navbar";
import grayHeart from "../../assets/grayHeart.png";
import redHeart from "../../assets/redHeart.png";
import "../../styles/post/PostDetails.css";


function PostDetails() {
  const [post, setPost] = useState([]);      // PostResponseDTO[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [like, setLike] = useState(false);
  const [tags, setTags] = useState([]);

  const { id } = useParams();
  const { roles, bootstrapping} = useContext(AuthContext);

  const navigate = useNavigate();

  const { deleteSubmit } = usePostDelete();

  useEffect(() => {
    const fetchPosts = async () => {
      if (bootstrapping) return;
      
      try {
        const res = await authFetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/${id}`,
          {
            method: "GET",
          }
        );

        let data;
        try {
          data = await res.json(); 
        } catch {
          data = null;
        }

        if (!res.ok) {
          setError(data?.message || "게시글을 불러오지 못했습니다.");
          return;
        }

        setPost(data);
        setLike(data.postLike);
        setTags(data.postTags);

      } catch (e) {
        console.error(e);
        setError("서버 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [id,bootstrapping]);

  const handlePostLike = async (chk) => {
    //chk => 0 : 좋아요 취소, 1 : 좋아요
    try {

      const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/posts/${id}/${chk}`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        console.log(data.message);
        return;
      }

      setLike(prev => !prev);

    } catch (err) {
      console.error(err);
    }


  }

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
    <div className="container PostDetails">
      <Navbar />

      {/* ---- header --- */}

      <div className="PD-header">

        <h3 className="PD-title">{post.title}</h3>

        <div className="PD-headerSub1">
          <div className="PD-tags">
            {tags.map((tag, i) => (
              <span className="PD-tag" key={tag.tagIndex}>
                #{tag.tagName}
              </span>
            ))}
          </div>
          
          <div>
            작성일: {formatDateTime(post.createdAt)}
            {post.updatedAt && (
              <><br /> 수정일: {formatDateTime(post.updatedAt)}</>
            )}
          </div>
          <span className="PD-like">
            {!like ? <button type="button" onClick={() => handlePostLike(1)}><img src={grayHeart} alt="좋아요 취소" /></button>
              : <button type="button" onClick={() => handlePostLike(0)}><img src={redHeart} alt="좋야요" /></button>}
          </span>
        </div>

      </div>


      {/* ---- main --- */}

      <YoutubeFallbackWrapper id={id} contentHtml={post.contentHtml} />


      {/* ---- footer --- */}

      <SimilarPostList id={id}/>
      

      {roles?.includes("ROLE_ADMIN") && (
        <div style={{margin:"20px 10px"}}>
          <button style={{marginRight:"10px"}} onClick={() => navigate(`/admin/posts/editPostPage/${id}`)}>
            수정
          </button>
          <button onClick={() => { deleteSubmit(post.index, setError, post.contentHtml) }}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
}

export default PostDetails;