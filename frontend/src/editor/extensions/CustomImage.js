import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageNodeView from "../../components/post/ImageNodeView";

export const CustomImage = Image.extend({
  addOptions() {
    return {
      ...this.parent?.(),

      onRemove: null, // (src) => Promise<void> 같은 콜백을 바깥에서 주입
    };
  },
  addAttributes(){
 return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element =>
          element.getAttribute("data-width") || null,
        renderHTML: attrs => {
          if (!attrs.width) return {};
          return {
            "data-width":attrs.width,
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
