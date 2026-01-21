import { usePostSubmit } from "../../hooks/post/usePostSubmit";
import Toolbar from"../../components/post/Toolbar";
import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
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
  const {addFile,candidates,removeCandidateUrl} = useLocalImageCandidates();
  
  //태그
  const [tagSelected,setTagSelected] = useState([]);

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
  const { removeOne, removeTiptapImage } = useFirebaseSingleImageRemove();

  // ✅ 에디터 생성
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList:false,
        orderedList:false,
        listItem:false
      }
      ),
      CustomListItem,
      CustomBulletList,
      CustomOrderedList,
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
          // removeTiptapImage(src);
          removeCandidateUrl(src);
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
    setThumbnailUrl(initialValues.thumbnailUrl || "");
    setTagSelected((prev)=>{
      if(!initialValues.postTags) return [];
      const next = [...prev];
      for(const tag of initialValues.postTags){
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
    const url = prompt("YouTube URL을 입력하세요");
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  //서버 전송
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    const contentHtml = editor.getHTML();

    const {finalContentHtml, finalThumbnailUrl} = await prepareSubmitPayload({
      contentHtml,
      thumbnailUrl,
      candidates,
      uploadOne
    });

    await handleSubmit(mode, finalContentHtml, finalThumbnailUrl, tagSelected, supplies);
  };



    // ------------- 이미지 firebase로 전환 -----------------
  
    async function buildUrlMapFromCandidates(candidates, uploadOne){
      //중복 업로드 방지
      const unique = new Map();
      for(const c of candidates){
          if(!c?.previewUrl || !c?.file) continue;
          if(!unique.has(c.previewUrl))unique.set(c.previewUrl,{file:c.file,id:c.id});
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
  
  function replaceImgSrcInHtml(contentHtml, urlMap){
      if(!contentHtml) return contentHtml;
  
      const doc = new DOMParser().parseFromString(contentHtml,"text/html");
      const imgs = doc.querySelectorAll("img");
  
      imgs.forEach((img)=>{
          const src = img.getAttribute("src");
          if(!src) return;
          const replaced = urlMap.get(src);
          if(replaced) img.setAttribute("src",replaced);
      });
  
      return doc.body.innerHTML;
  };
  
  function replaceUrlIfCandidate(url, urlMap){
      if(!url) return url;
      return urlMap.get(url) ?? url;
  };
  
  
  async function prepareSubmitPayload({
      contentHtml,
      thumbnailUrl,
      candidates,
      uploadOne,
  }){
      //업로드 후 맵 생성
      const urlMap = await buildUrlMapFromCandidates(candidates, uploadOne);
  
      //html, thumbnail 치황
      const finalContentHtml = replaceImgSrcInHtml(contentHtml, urlMap);
      const finalThumbnailUrl = replaceUrlIfCandidate(thumbnailUrl,urlMap);
  
      return {finalContentHtml, finalThumbnailUrl};
  };
  

 // --------------------------------------

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
                  onClick={() =>
                    setThumbnailUrl("")
                  }
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

        <input type="text" value={supplies} onChange={(e)=>setSupplies(e.target.value)} placeholder="준비물을 입력 하세요"/>

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