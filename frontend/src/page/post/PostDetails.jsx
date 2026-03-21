import { useEffect, useState, useContext } from "react";
import { authFetch } from "../../api/authFetch";
import AuthContext from "../../auth/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { usePostDelete } from "../../hooks/post/usePostDelete";
import SimilarPostList from "../../components/post/SimilarPostList";
import YoutubeFallbackWrapper from "../../components/post/YoutubeFallbackWrapper";
import Navbar from "../../components/common/Navbar";
import PostLike from "../../components/post/PostLike";
import "../../styles/post/PostDetails.css";


function PostDetails() {
  const [post, setPost] = useState([]);      
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
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [id,bootstrapping]);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString(); 
  };

  if (loading) {
    return(
      <div className="container PostDetails">
      <Navbar />
      <div className="PL-noData"><span>게시글을 불러오고 있습니다.</span></div>
      </div>
    );
  }

  if (error) {
    return(
      <div className="container PostDetails">
      <Navbar />
      <div className="PL-noData"><span>{error}</span></div>
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
          
          <div className="PD-date">
            
            {post.updatedAt && (
              <>수정일: {formatDateTime(post.updatedAt)}</>
            )}
            {!post.updatedAt && (
              <>작성일: {formatDateTime(post.createdAt)}</>
            )}
          
          <PostLike id={id} like={like}/>
          </div>
        </div>

      </div>


      {/* ---- main --- */}

      <YoutubeFallbackWrapper id={id} contentHtml={post.contentHtml} />


      {/* ---- footer --- */}

      <SimilarPostList id={id}/>
      

      {roles?.includes("ROLE_ADMIN") && (
        <footer style={{margin:"20px 10px"}}>
          <button style={{marginRight:"10px"}} onClick={() => navigate(`/admin/posts/editPostPage/${id}`)}>
            수정
          </button>
          <button onClick={() => { deleteSubmit(post.index, setError, post.contentHtml) }}>
            삭제
          </button>
        </footer>
      )}
    </div>
  );
}

export default PostDetails;