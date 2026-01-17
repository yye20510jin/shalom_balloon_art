import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostSearch } from "../../hooks/post/usePostSearch";
import leftArrow from "../../assets/leftArrow.png";
import rightArrow from "../../assets/rightArrow.png";
import Navbar from "../../components/common/Navbar";
import "../../styles/post/postList.css";

function PostList() {

  const navigate = useNavigate();
  const { searchText, setSearchText, fnc_searchText, posts, error,
    fnc_allPost, startPage, setStartPage, endPage, loading } = usePostSearch();

  const search = Boolean(searchText.trim());

  useEffect(() => {
    search ? fnc_searchText() : fnc_allPost();
  }, [startPage]);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }); // 시스템 로케일 기준으로 표시
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

  console.log("posts : ",posts);

  return (
    <div>
      <Navbar />
      <div className="PL-top">
        <h2 style={{ textAlign: "center", margin: "0" }}>게시글 목록</h2>
        <div className="PL-topInput">
          <input type="text" value={searchText} onChange={(e) => { setSearchText(e.target.value) }} placeholder="제목을 입력해 주세요" />
          <button type="button" onClick={(e) => {
            setStartPage(0);
            fnc_searchText(e); // 1 : 처음 검색
          }}>검색</button>
        </div>
      </div>
      <div className="container PostList">
        <main>
          <ol className="PL-content">
            {posts.map((post, index) => (
              <li className="PL-post"
                key={post.index}
                onClick={() => navigate(`/user/posts/postDetails/${post.index}`)}
              >
                {/* 이미지 썸네일 */}

                {post.thumbnailUrl &&
                  <div key={post.index} className="PL-imgBox">
                    <img
                      className="PL-img"
                      src={post.thumbnailUrl}
                      alt={post.title}
                    />
                  </div>
                }

                {/* 텍스트 영역 */}
                <div className="PL-text">
                  <p style={{ margin: "10px 0" }} className="PL-number">{startPage === 0 ? "" : startPage}{index + 1}</p>
                  <h3 style={{ margin: "0 0 5px 0" }}>{post.title}</h3>

                  {post.postTag && post.postTag.map((tag) => <span key={tag.tagIndex}>#{tag.tagName} </span> )}

                  <div className="PL-update">
                    작성일: {formatDateTime(post.createdAt)}
                    {post.updatedAt && (
                      <> · 수정일: {formatDateTime(post.updatedAt)}</>
                    )}
                  </div>

                  <p
                    style={{
                      margin: "30px 0",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {post.preview.length >= 160 ? `${post.preview}...` : post.preview}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </main>
        <div className="PL-bt">
          <button style={{ background: "none", marginRight: "0.5rem" }} onClick={() => { setStartPage(prev => prev - 1) }} disabled={startPage <= 0}> <img src={leftArrow} alt="이전" /> </button>
          <div>{startPage + 1} / {endPage}</div>
          <button style={{ background: "none", marginLeft: "0.5rem" }} onClick={() => { setStartPage(prev => prev + 1) }} disabled={endPage <= startPage + 1}> <img src={rightArrow} alt="다음" /></button>
        </div>
      </div>
    </div>
  );
}

export default PostList;