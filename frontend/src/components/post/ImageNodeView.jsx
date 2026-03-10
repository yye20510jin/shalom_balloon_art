import {useRef} from "react";
import { NodeViewWrapper } from "@tiptap/react";

export default function ImageNodeView(props) {
  const { node, selected, editor, getPos, extension,updateAttributes } = props;
  const src = node.attrs.src;
  const startX = useRef(0);
  const startWidth = useRef(0);
  const dragging = useRef(false);
  const imgRef = useRef(null);

  const onPointerdownn = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dragging.current = true;
    startX.current = e.clientX;

    const w = Number(node.attrs.width);
    const domWidth = imgRef.current?.getBoundingClientRect().width; 
    startWidth.current = Number.isFinite(w) && w > 0 ? w : Number.isFinite(domWidth) && domWidth > 0 ? domWidth : 300;

    document.addEventListener("pointermove", onPointermove);
    document.addEventListener("pointerup",onPointerup);
  };

  const onPointermove = (e) => {
    if(!dragging.current) return;
    
    const diff = e.clientX - startX.current;
    const next = Math.max(60,startWidth.current + diff);
    updateAttributes({
      width: next,
    });
  };

  const onPointerup = () => {
    dragging.current = false;
    document.removeEventListener("pointermove", onPointermove);
    document.removeEventListener("pointerup",onPointerup);
  };

  const removeThisImage = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 1) 에디터에서 이 이미지 노드 삭제
    const pos = getPos();
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .run();

      if(typeof extension.options.onRemove === "function"){
          extension.options.onRemove(src);
      }
  };

  const widthPx = Number.isFinite(Number(node.attrs.width)) && Number(node.attrs.width) > 0 ? `${node.attrs.width}px` : "100%";

  return (
    <NodeViewWrapper
      contentEditable={false}
      as="span"
      style={{
        display: "inline-block",
        position: "relative",
        lineHeight: 0,
        outline: selected ? "2px solid #4f46e5" : "none",
        borderRadius: 8,
      }}
      data-drag-handle
    >
      <img
        ref={imgRef}
        src={src}
        alt={node.attrs.alt ?? ""}
        title={node.attrs.title ?? ""}
        style={{
          display: "block",
          maxWidth: "100%",
          height: "auto",
          width : widthPx,
          borderRadius: 8,
        }}
        draggable={false}
      />

      <div
        onPointerDown={(e) => onPointerdownn(e)} 
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 12,
          height: 12,
          background: "#333",
          cursor: "nwse-resize",
        }}
      />

      {/* ✅ 오버레이 X 버튼 */}
      {selected && <button
        type="button"
        onPointerDown={(e) => e.preventDefault()} // 클릭 시 커서 튐/드래그 방지
        onClick={removeThisImage}
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 26,
          height: 26,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          background: "rgba(0,0,0,0.65)",
          color: "white",
          fontSize: 16,
          display: "grid",
          placeItems: "center",
        }}
        aria-label="이미지 삭제"
        title="삭제"
      >
        ×
      </button>
}
    </NodeViewWrapper>
  );
}