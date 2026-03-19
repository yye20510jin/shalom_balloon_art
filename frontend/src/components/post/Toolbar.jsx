import { useEditorState } from "@tiptap/react";
import textCenter from"../../assets/textCenter.png";
import textRight from"../../assets/textRight.png";
import textLeft from"../../assets/textLeft.png";
import img from"../../assets/img.png";
import youtube from"../../assets/youtube.png";
import orderedList from "../../assets/orderedList.png";
import bulletList from "../../assets/bulletList.png";


export default function Toolbar({ editor, onPickImage, onInsertYoutube }) {
  if (!editor) return null;
  const editorState = useEditorState({ 
    editor, 
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
        background: active ? "#d9ed92" : "#fff",
      }}
    >
      {children}
    </button>
  );

   return (
    <div className="Toolbar" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
      <div className="Toolbar button">
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
        <img src={bulletList} alt="• 목록"/>
      </Btn>
      <Btn
        active={editorState.isOrderedList}
        onClick={() => editor.chain().focus().toggleList("orderedList","listItem").run()}
      >
        <img src={orderedList} alt="1. 목록"/>
      </Btn>

      <Btn onClick={() => {
        editor.chain().focus().setTextAlign("left").run();
        editor.chain().focus().setBulletListAlign("left").run();
        editor.chain().focus().setOrderedListAlign("left").run();
      }}>
        <img src={textLeft} alt="왼쪽"/>
      </Btn>

      <Btn onClick={() => {
        editor.chain().focus().setTextAlign("center").run();
        editor.chain().focus().setBulletListAlign("center").run();
        editor.chain().focus().setOrderedListAlign("center").run();
      }}>
        <img src={textCenter} alt="가운데"/>
      </Btn>

      <Btn onClick={() =>{
        editor.chain().focus().setTextAlign("right").run();
        editor.chain().focus().setBulletListAlign("right").run();
        editor.chain().focus().setOrderedListAlign("right").run();
      }}>
        <img src={textRight} alt="오른쪽"/>
      </Btn>
      </div>

      <div style={{ width: 1, background: "#eee"}} />

      <div className="Toolbar content">
      <Btn onClick={onPickImage}><img src={img} alt="이미지"/></Btn>
      <Btn onClick={onInsertYoutube}><img src={youtube} alt="유튜브"/></Btn>
      </div>
    </div>
  );
}
