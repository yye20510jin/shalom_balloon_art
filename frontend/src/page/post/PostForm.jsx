import { usePostSubmit } from "../../hooks/post/usePostSubmit";
import Toolbar from"../../components/post/Toolbar";
import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { useFirebaseSingleImageUpload } from "../../hooks/firebase/useFirebaseSingleImageUpload";
import { useFirebaseSingleImageRemove } from "../../hooks/firebase/useFirebaseSingleImageRemove";
import { CustomImage } from "../../hooks/post/toolbar/useCustomImage";
import { FontSize } from "../../hooks/post/toolbar/useFontSize";
import {CustomListItem} from "../../hooks/post/toolbar/useCustomListItem";
import {CustomTextAlign} from "../../hooks/post/toolbar/useCustomTextAlign";
import {CustomOrderedList} from "../../hooks/post/toolbar/useCustomOrderedList";
import { CustomBulletList } from "../../hooks/post/toolbar/useCustomBulletList";
import { useLocalImageCandidates } from "../../hooks/post/useLocalImageCandidates";
import PostTag from "../../components/post/PostTag";
import "../../styles/post/PostForm.css";

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
    handleSubmit,
  } = usePostSubmit();

  //이미지 candidates 임시 저장
  const {} = useLocalImageCandidates();
  
  //태그
  const [tagSelected,setTagSelected] = useState([]);

  //썸네일 이미지
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbError, setThumbError] = useState("");
  const thumbInputRef = useRef(null);

  // 파일 input을 버튼으로 열기 위해
  const fileInputRef = useRef(null);

  const { uploadOne, isUploading, error: uploadError, setError: setUploadError } = useFirebaseSingleImageUpload({ folder: "posts" });
  const { removeOne, removeTiptapImage } = useFirebaseSingleImageRemove();

  // ✅ 에디터 생성
  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomBulletList,
      CustomOrderedList,
      CustomListItem,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      CustomTextAlign.configure({
        types:["heading","paragraph"],
      }),
      CustomImage.configure({
        inline: true,
        group:"inline",
        draggable: true,
        allowBase64: false,
        onRemove: (src) => {
          removeTiptapImage(src);
        }
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
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
    setThumbnailUrl(initialValues.thumbnailUrl || "")
    setTagSelected((prev)=>{
      if(!initialValues.postTags) return [];
      const next = [...prev];
      for(const tag of initialValues.postTags){
        const name = tag.tagName;
        next.push(name);
      }
      return next;
    });

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

    setThumbError("");
    setThumbUploading(true);

    try {
      const url = await uploadOne(file);
      setThumbnailUrl(url);
    } catch (err) {
      setThumbError(err.message || "썸네일 업로드 실패");
    } finally {
      setThumbUploading(false);
      e.target.value = "";
    }
  };

  // 이미지 업로드 및 삽입
  const handleImageFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
      const url = await uploadOne(file);

      editor.chain().focus().insertContent([{ type: "image", attrs: { src: url } }, { type: "paragraph" },]).run();
    }

    e.target.value = "";
  };

  // 유튜브 삽입
  const handleInsertYoutube = () => {
    if (!editor) return;
    const url = prompt("YouTube URL을 입력하세요");
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  //서버 전송
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    const contentHtml = editor.getHTML();

    await handleSubmit(mode, contentHtml, thumbnailUrl, tagSelected);
  };



  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>{mode === "edit" ? "게시글 수정" : "새 게시글 작성"}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={onSubmit}>
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

        {/* 썸네일 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              type="button"
              onClick={() => !thumbUploading && thumbInputRef.current?.click()}
            >
              썸네일 선택
            </button>
            {thumbnailUrl && (
              <div style={{ position: "relative" }}>
                <img src={thumbnailUrl} alt="thumbnail"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />

                <button
                  type="button"
                  onClick={async () =>{
                    const ok =  await removeOne(thumbnailUrl);
                    if(!ok) {setThumbError("썸네일 삭제 실패"); return;}
                    setThumbnailUrl("");
                  }}
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    border: "none",
                    borderRadius: "50%",
                    width: 26,
                    height: 26,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: "bold",
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {thumbError && <p style={{ color: "red" }}>{thumbError}</p>}

            <input
              ref={thumbInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleThumbnailChange}
            />
            <PostTag tagSelected={tagSelected} setTagSelected={setTagSelected}/>
          </div>
        </div>

        {/* 툴바 */}
        <Toolbar
          editor={editor}
          onPickImage={() => !isUploading && fileInputRef.current?.click()}
          onInsertYoutube={handleInsertYoutube}
        />

        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
        />

        <select
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

        {/* 에디터 본문 */}
        <div
          className="ed-content"
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            minHeight: 260,
          }}
        >
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
          disabled={!title || !thumbnailUrl || isSubmitting}
          style={{
            marginTop: 16,
            padding: "10px 20px",
            fontSize: 16,
            cursor: isSubmitting ? "default" : "pointer",
          }}
        >
          {isSubmitting ? "저장 중..." : mode === "edit" ? "수정 완료" : "게시글 등록"}
        </button>
      </form>
    </div>
  );
}


export default PostForm;