import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostSearch } from "../../hooks/post/usePostSearch";
import "../../styles/public/Arrow.css";
import Navbar from "../../components/common/Navbar";
import { SearchPostTag } from "../../components/post/SearchPostTag";
import "../../styles/post/postList.css";
import "../../styles/post/postListMedia.css";
import PostLike from "../../components/post/PostLike";

function PostList({mode=""}) {

  const finalMode = mode ?? "";

  const navigate = useNavigate();
  const { fnc_userLikePost, searchText, setSearchText, posts, error,
    fnc_postList, startPage, setStartPage, endPage, loading, searchTags, setSearchTags } = usePostSearch();

  const [likeCount, setLikeCount] = useState(0);
  const [arrowPage, setArrowPage] = useState(0);
  const maxPage = 10;

  const pageNum = arrowPage * maxPage;
  const mapEndPage = endPage - pageNum >= maxPage ? maxPage : Math.max(endPage - pageNum, 0);

  useEffect(() => {

    if (finalMode === "like") {
      fnc_userLikePost();
    } else {
      fnc_postList();
    }

  }, [startPage, mode, likeCount]);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }); 
  };

  if (loading) {
    return <div style={{ padding: 20 }}>불러오는 중...</div>;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="PostList">
      {finalMode !== "like" && <Navbar />}
      <div className="container">
        <div className="PL-top">
          <h2 style={{ textAlign: "center", margin: "0" }}>{finalMode === "like" ? "좋아요한 게시글" : "게시글 목록"}</h2>
          <div style={{display: finalMode === "like" ? "none" : ""}} className="PL-top-flex">
            <div className="PL-topInput">
              <input type="text" value={searchText} onChange={(e) => { setSearchText(e.target.value) }} placeholder="제목을 입력해 주세요" />
              <button className="i-btn" type="button" onClick={(e) => {
                setStartPage(0);
                fnc_postList(e); 
              }}>검색</button>
            </div>
            <div className="PL-topTag">
              {finalMode !== "like" && <SearchPostTag finalMode={finalMode} fnc_postList={fnc_postList} searchTags={searchTags} setSearchTags={setSearchTags} />}
            </div>
          </div>
          {error ? <div className="i-errorMessage PL-noData">{error}</div> : 
          <div className="PL-noData" style={{ padding: 20 }}><span>{finalMode === "like" ? "게시글이 존재하지 않습니다." : "등록된 게시글이 없습니다."}</span></div>}
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="PostList">
    {finalMode !== "like" && <Navbar />}
    <div className="container">
      <div className="PL-top">
        <h2 style={{ textAlign: "center", margin: "0" }}>{finalMode === "like" ? "좋아요한 게시글" : "게시글 목록"}</h2>
        <div style={{display: finalMode === "like" ? "none" : ""}} className="PL-top-flex">
          <div className="PL-topInput">
            <input type="text" value={searchText} onChange={(e) => { setSearchText(e.target.value) }} placeholder="제목을 입력해 주세요" />
            <button className="i-btn" type="button" onClick={(e) => {
              setStartPage(0);
              fnc_postList(e); 
            }}>검색</button>
          </div>
          <div className="PL-topTag">
            {finalMode !== "like" && <SearchPostTag finalMode={finalMode} fnc_postList={fnc_postList} searchTags={searchTags} setSearchTags={setSearchTags} />}
          </div>
        </div>
      </div>
        <main>
          <ol className="PL-content">
            {posts.map((post, index) => (
              <li className={`PL-post ${index % 2 != 0 ? "odd" : "even"}`}
                key={post.index}
                onClick={() => navigate(`/user/posts/postDetails/${post.index}`)}
              >
                {/* 이미지 썸네일 */}

                {post.thumbnailUrl &&
                  <div key={post.index} className="PL-imgBox">
                    <PostLike id={post.index} like={post.postLike} setLikeCount={setLikeCount} />
                    <img
                      className="PL-img"
                      src={post.thumbnailUrl}
                      alt={post.title}
                    />
                  </div>
                }

                <div className="PL-subBox">
                  <span className="PL-update">
                    
                    {post.updatedAt ? (
                      <>수정일: {formatDateTime(post.updatedAt)}</>
                    ) : <>작성일: {formatDateTime(post.createdAt)}</>}
                  </span>

                  {/* 텍스트 영역 */}
                  <div className="PL-text">
                    <h3 style={{ margin: "0 0 5px 0" }}>{post.title}</h3>

                    <div className="PL-getTag">
                      {post.postTag && post.postTag.map((tag) => <span key={tag.tagIndex}>#{tag.tagName} </span>)}
                    </div>

                    <p
                      style={{
                        margin: "30px 0",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {post.supplies}

                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </main>
        <div className="PL-bt">
          <button className={`PL-pageArrow ${pageNum <= 0 ? "color" : ""}`} type="button"
            disabled={pageNum <= 0} onClick={() => setArrowPage(prev => prev - 1)}><div className="arrow-big left"></div></button>
          {Array.from({ length: mapEndPage }).map((_, i) => {
            const page = i + pageNum
            return (
              <div key={page}>
                <button type="button" onClick={() => setStartPage(page)} className={`PL-page ${i === startPage ? "chk" : ""}`} >{page + 1}</button>
              </div>
            )
          }

          )}
          <button className={`PL-pageArrow ${endPage - mapEndPage === 0 || mapEndPage < maxPage ? "color" : ""}`} type="button"
            disabled={endPage - mapEndPage === 0 || mapEndPage < maxPage} onClick={() => setArrowPage(prev => prev + 1)}><div className="arrow-big right"></div></button>
        </div>
      </div>
    </div>
  );
}

export default PostList;