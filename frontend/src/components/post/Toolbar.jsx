import { useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {CustomOrderedList} from "../../hooks/post/toolbar/useCustomOrderedList";

export default function Toolbar({ editor, onPickImage, onInsertYoutube }) {
  if (!editor) return null;
  
  const editorState = useEditorState({ //editor의 state,selection,transaction 변경을 감지
    editor, //감시 대상
    selector:({editor})=>({
      isBold: editor.isActive("bold"),
      isItalic: editor.isActive("italic"),
      isBulletList: editor.isActive("bulletList"),
      isOrderedList: editor.isActive("orderedList"),

    })
  });

  const Btn = ({ onClick, active, children }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 10px",
        border: "1px solid #ddd",
        background: active ? "#111" : "#fff",
        color: active ? "#fff" : "#111",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );

   return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
      <Btn
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </Btn>
      <Btn
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </Btn>
      <Btn
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • 목록
      </Btn>
      <Btn
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. 목록
      </Btn>

      <Btn onClick={() => {
        editor.chain().focus().setTextAlign("left").run();
        editor.chain().focus().setBulletListAlign("left").run();
        editor.chain().focus().setOrderedListAlign("left").run();
      }}>
        왼쪽
      </Btn>

      <Btn onClick={() => {
        editor.chain().focus().setTextAlign("center").run();
        editor.chain().focus().setBulletListAlign("center").run();
        editor.chain().focus().setOrderedListAlign("center").run();
      }}>
        가운데
      </Btn>

      <Btn onClick={() =>{
        editor.chain().focus().setTextAlign("right").run();
        editor.chain().focus().setBulletListAlign("right").run();
        editor.chain().focus().setOrderedListAlign("right").run();
      }}>
        오른쪽
      </Btn>

      <div style={{ width: 1, background: "#eee", margin: "0 6px" }} />

      <Btn onClick={onPickImage}>이미지</Btn>
      <Btn onClick={onInsertYoutube}>유튜브</Btn>
    </div>
  );
}
