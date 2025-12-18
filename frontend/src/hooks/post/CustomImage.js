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

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
