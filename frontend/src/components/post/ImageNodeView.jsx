import {useRef} from "react";
import { NodeViewWrapper } from "@tiptap/react";

export default function ImageNodeView(props) {
  const { node, selected, editor, getPos, extension,updateAttributes } = props;
  const src = node.attrs.src;
  const startX = useRef(0);
  const startWidth = useRef(0);
  const dragging = useRef(false);
  const imgRef = useRef(false);

  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dragging.current = true;
    startX.current = e.clientX;

    const w = Number(node.attrs.width);
    const domWidth = imgRef.current?.getBoundingClientRect().width; 
    startWidth.current = Number.isFinite(w) && w > 0 ? w : Number.isFinite(domWidth) && domWidth > 0 ? domWidth : 300;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup",onMouseUp);
  };

  const onMouseMove = (e) => {
    if(!dragging.current) return;
    
    const diff = e.clientX - startX.current;
    const next = Math.max(60,startWidth.current + diff);
    updateAttributes({
      width: next,
    });
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup",onMouseUp);
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

    // 2) (선택) Firebase/서버에서도 삭제하고 싶으면 콜백 호출
    //    실패해도 에디터 삭제는 이미 됐으니, 여기서만 예외 처리 권장
    try {
      if (typeof extension.options.onRemove === "function") {
        await extension.options.onRemove(src);
      }
    } catch (err) {
      console.error("이미지 파일 삭제 실패:", err);
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
        outline: selected ? "2px solid #4f46e5" : "none", // 선택 강조(원하면 제거)
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
        onMouseDown={(e) => onMouseDown(e)}
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
        onMouseDown={(e) => e.preventDefault()} // 클릭 시 커서 튐/드래그 방지
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