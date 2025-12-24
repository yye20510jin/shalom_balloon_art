import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostSearch } from "../../hooks/post/usePostSearch";

function PostList() {

  const navigate = useNavigate();
  const{searchText,setSearchText,fnc_searchText,posts,error,
    fnc_allPost,startPage,setStartPage,endPage,loading} = usePostSearch();

  const search = Boolean(searchText.trim());

  useEffect(() => {
    search ? fnc_searchText() : fnc_allPost();
  }, [startPage]);

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

        <div>
            <input type="text" value={searchText} onChange={(e)=>{setSearchText(e.target.value)}} placeholder="제목을 입력해 주세요" />
            <button type="button" onClick={(e)=>{
              setStartPage(0);
              fnc_searchText(e); // 1 : 처음 검색
              }}>검색</button>
        </div>

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

        {post.thumbnailUrl && 
              <div key={post.index} style={{ flex: "0 0 120px" }}>
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  style={{
                    width: "120px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              </div>
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
              {post.preview}
            </p>
          </div>
        </div>
      ))}
      <button onClick={()=>{setStartPage(prev => prev-1)}} disabled={startPage <= 0}> 이전 </button>
      <div>{startPage+1} / {endPage}</div>
      <button onClick={()=>{setStartPage(prev => prev+1)}} disabled={endPage <= startPage+1}> 다음 </button>
    </div>
  );
}

export default PostList;