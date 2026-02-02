import { useEditorState } from "@tiptap/react";

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
        background: active ? "#d9ed92" : "#fff",
        color: "black",
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
        active={editorState.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </Btn>
      <Btn
        active={editorState.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </Btn>
      <Btn
        active={editorState.isBulletList}
        onClick={() => editor.chain().focus().toggleList("bulletList","listItem").run()}
      >
        • 목록
      </Btn>
      <Btn
        active={editorState.isOrderedList}
        onClick={() => editor.chain().focus().toggleList("orderedList","listItem").run()}
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
