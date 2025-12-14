import ImageUpload from "./ImageUpload";
import YoutubePreview from "./YoutubePreview";
import { usePostSubmit } from "../../hooks/post/usePostSubmit";
import {useEffect} from "react";

function PostForm({
  mode = "create",       
  initialValues                                   
}) {
  const {
    id,
    setId,
    title,
    setTitle,
    content,
    setContent,
    imageUrls,
    setImageUrls,
    youtubeUrl,
    setYoutubeUrl,
    error,
    successMessage,
    isSubmitting,
    handleSubmit,
  } = usePostSubmit();

useEffect(()=>{
    if (initialValues) {
      setId(initialValues.id || "");
      setTitle(initialValues.title || "");
      setContent(initialValues.content || "");
      setYoutubeUrl(initialValues.youtubeUrl || "");
      setImageUrls(initialValues.imageUrls || []);
    }  
},[initialValues]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>새 게시글 작성</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={(e)=>{handleSubmit(e,mode)}}>
        {/* 제목 */}
        <div style={{ marginBottom: 16 }}>
          <label>
            제목
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
              placeholder="제목을 입력하세요"
            />
          </label>
        </div>

        {/* 내용 */}
        <div style={{ marginBottom: 16 }}>
          <label>
            내용
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                marginTop: 4,
                minHeight: 150,
              }}
              placeholder="내용을 입력하세요"
            />
          </label>
        </div>

        {/* 이미지 업로드 */}
        <ImageUpload imageUrls={imageUrls} setImageUrls={setImageUrls} />

        {/* YouTube URL + 미리보기 */}
        <YoutubePreview
          youtubeUrl={youtubeUrl}
          setYoutubeUrl={setYoutubeUrl}
        />

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            cursor: isSubmitting ? "default" : "pointer",
          }}
        >
          {isSubmitting ? "저장 중..." : "게시글 등록"}
        </button>
      </form>
    </div>
  );
}

export default PostForm;