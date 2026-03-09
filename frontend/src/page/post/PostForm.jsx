import { usePostSubmit } from "../../hooks/post/usePostSubmit";
import Toolbar from "../../components/post/Toolbar";
import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { useFirebaseSingleImageUpload } from "../../hooks/firebase/useFirebaseSingleImageUpload";
import { CustomImage } from "../../editor/extensions/CustomImage";
import { useLocalImageCandidates } from "../../hooks/post/useLocalImageCandidates";
import { baseExtensions } from "../../editor/baseExtensions";
import { toYouTubeEmbedUrl } from "../../util/post/ToYouTubeEmbedUrl";
import PostTag from "../../components/post/PostTag";
import "../../styles/post/PostFormContent.css";
import "../../styles/post/PostForm.css";
import "../../styles/post/TiptapExtends.css"

function PostForm({
  mode = "create",
  initialValues
}) {

  const {
    id,
    setId,
    title,
    setTitle,
    error,
    successMessage,
    isSubmitting,
    handleSubmit
  } = usePostSubmit();

  //이미지 candidates 임시 저장
  const { addFile, candidates, removeCandidateUrl } = useLocalImageCandidates();

  //태그
  const [tagSelected, setTagSelected] = useState([]);

  //썸네일 이미지
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbError, setThumbError] = useState("");
  const thumbInputRef = useRef(null);

  //준비물
  const [supplies, setSupplies] = useState("");

  // 파일 input을 버튼으로 열기 위해
  const fileInputRef = useRef(null);

  const { uploadOne, isUploading, error: uploadError, setError: setUploadError } = useFirebaseSingleImageUpload({ folder: "posts" });

  // ✅ 에디터 생성
  const editor = useEditor({
    extensions: [
      ...baseExtensions,
      CustomImage.configure({
        inline: true,
        group: "inline",
        draggable: true,
        allowBase64: false,
        onRemove: removeCandidateUrl,
      }),
    ],
  });

  // ✅ edit 모드 초기값 세팅
  const didSetContentRef = useRef(false);

  useEffect(() => {
    if (!initialValues || !editor) return;
    if (didSetContentRef.current) return;

    setId(initialValues.id || "");
    setTitle(initialValues.title || "");
    setThumbnailUrl(initialValues.thumbnailUrl || "");
    setTagSelected((prev) => {
      if (!initialValues.postTags) return [];
      const next = [...prev];
      for (const tag of initialValues.postTags) {
        const name = tag.tagName;
        next.push(name);
      }
      return next;
    });
    setSupplies(initialValues.supplies || "");

    // 서버에 저장한 contentHtml을 다시 에디터에 주입하는 형태 추천
    if (editor && initialValues.contentHtml) {

      queueMicrotask(() => {
        editor.commands.setContent(initialValues.contentHtml, false);
      });
    }

    didSetContentRef.current = true;
  }, [initialValues, editor]);

  //썸네일 이미지 업로드
  const handleThumbnailChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = addFile(file);
    setThumbnailUrl(url);
    e.target.value = "";
  };

  // 이미지 업로드 및 삽입
  const handleImageFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
      const url = addFile(file);

      editor.chain().focus().insertContent([{ type: "image", attrs: { src: url } }, { type: "paragraph" },]).run();
    }

    e.target.value = "";
  };

  // 유튜브 삽입
  const handleInsertYoutube = () => {
    if (!editor) return;

    const input = prompt("YouTube URL을 입력하세요");
    if (!input) return;

    const embedUrl = toYouTubeEmbedUrl(input);

    if (!embedUrl) {
      alert("유효한 YouTube 링크가 아니거나, embed 변환이 불가능한 URL입니다.");
      return;
    }

    editor.chain().focus().setYoutubeVideo({ src: embedUrl }).run();
  };
  //서버 전송
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    const contentHtml = editor.getHTML();

    const { finalContentHtml, finalThumbnailUrl } = await prepareSubmitPayload({
      contentHtml,
      thumbnailUrl,
      candidates,
      uploadOne
    });

    await handleSubmit(mode, finalContentHtml, finalThumbnailUrl, tagSelected, supplies);
  };



  // ------------- 이미지 firebase로 전환 -----------------

  async function buildUrlMapFromCandidates(candidates, uploadOne) {
    //중복 업로드 방지
    const unique = new Map();
    for (const c of candidates) {
      if (!c?.previewUrl || !c?.file) continue;
      if (!unique.has(c.previewUrl)) unique.set(c.previewUrl, { file: c.file, id: c.id });
    }

    const entries = Array.from(unique.entries());
    //await Promise.all : 여러 개의 비동기 작업을 동시에 실행하고, 전부 끝날 때까지 가디린다.
    const results = await Promise.all(
      entries.map(async ([candidateUrl, { file }]) => {
        const firebaseUrl = await uploadOne(file);
        return [candidateUrl, firebaseUrl];
      })
    );

    return new Map(results);

  };

  function replaceImgSrcInHtml(contentHtml, urlMap) {
    if (!contentHtml) return contentHtml;

    const doc = new DOMParser().parseFromString(contentHtml, "text/html");
    const imgs = doc.querySelectorAll("img");

    imgs.forEach((img) => {
      const src = img.getAttribute("src");
      if (!src) return;
      const replaced = urlMap.get(src);
      if (replaced) img.setAttribute("src", replaced);
    });

    return doc.body.innerHTML;
  };

  function replaceUrlIfCandidate(url, urlMap) {
    if (!url) return url;
    return urlMap.get(url) ?? url;
  };


  async function prepareSubmitPayload({
    contentHtml,
    thumbnailUrl,
    candidates,
    uploadOne,
  }) {
    //업로드 후 맵 생성
    const urlMap = await buildUrlMapFromCandidates(candidates, uploadOne);

    //html, thumbnail 치환
    const finalContentHtml = replaceImgSrcInHtml(contentHtml, urlMap);
    const finalThumbnailUrl = replaceUrlIfCandidate(thumbnailUrl, urlMap);

    return { finalContentHtml, finalThumbnailUrl };
  };


  // --------------------------------------

  return (
    <div className="container PostForm">
      <h1 className="PF-title">{mode === "edit" ? "게시글 수정" : "새 게시글 작성"}</h1>

      {error && <p className="i-errMessage">{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form className="PF-form" onSubmit={onSubmit}>
        {/* 제목 */}
        <div className="PF-titleDiv">
          <label>
            제목
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
          </label>
        </div>

        <div className="PF-toolbar">
          <div className="PF-toolbarTop">
            {/* 툴바 */}
            <Toolbar
              editor={editor}
              onPickImage={() => !isUploading && fileInputRef.current?.click()}
              onInsertYoutube={handleInsertYoutube}
            />
          </div>

          <div className="PF-preview">
            <label id="pt" className="PF-previewText">
              미리보기
              <textarea name="pt" value={supplies} onChange={(e) => setSupplies(e.target.value)} />
            </label>

            {/* 썸네일 */}
            <div className="PF-previewThumb">
              <div className="PF-previewImg" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {thumbnailUrl ? (
                  <div className="PF-thumbnail" style={{ position: "relative" }}>
                    <img src={thumbnailUrl} alt="thumbnail" />
                    <button type="button" onClick={() => setThumbnailUrl("")}> ✕ </button>
                  </div>
                ) : (
                  <button className="i-btn" type="button" onClick={() => !thumbUploading && thumbInputRef.current?.click()}>
                    썸네일 선택
                  </button>
                )}

                {thumbError && <p style={{ color: "red" }}>{thumbError}</p>}

                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleThumbnailChange}
                />

              </div>
            </div>
          </div>

          <div className="PF-toolbarBottom">
            <input
              style={{ marginLeft: "10px" }}
              type="color"
              onChange={(e) =>
                editor.chain().focus().setColor(e.target.value).run()
              }
            />

            <select
              style={{ marginLeft: "10px" }}
              onChange={(e) =>
                editor.chain().focus().setFontFamily(e.target.value).run()
              }
              defaultValue=""
            >
              <option value="" disabled>폰트 선택</option>
              <option value="Arial">Arial</option>
              <option value="Pretendard">Pretendard</option>
              <option value="Noto Sans KR">Noto Sans KR</option>
            </select>

            <select
              style={{ marginLeft: "10px" }}
              onChange={(e) =>
                editor.chain().focus().setFontSize(e.target.value).run()
              }
              defaultValue=""
            >
              <option value="" disabled>크기</option>
              <option value="12px">12</option>
              <option value="14px">14</option>
              <option value="16px">16</option>
              <option value="20px">20</option>
              <option value="24px">24</option>
            </select>

            <PostTag tagSelected={tagSelected} setTagSelected={setTagSelected} />
          </div>
        </div>

        {/* 에디터 본문 */}
        <div className="ed-content">
          <EditorContent editor={editor} />
        </div>

        {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
        {/* hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleImageFileChange}
        />

        {/* 제출 버튼 */}
        <button
          type="submit"
          className={`${title && thumbnailUrl && !isSubmitting ? "i-btn" : ""}`}
          disabled={!title || !thumbnailUrl || isSubmitting}
          style={{ cursor: isSubmitting ? "default" : "pointer" }}>
          {isSubmitting ? "저장 중..." : mode === "edit" ? "수정 완료" : "게시글 등록"}
        </button>
      </form>
    </div>
  );
}


export default PostForm;