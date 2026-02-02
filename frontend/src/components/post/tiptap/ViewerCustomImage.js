import Image from "@tiptap/extension-image";

export const ViewerCustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: el => el.style.width?.replace("px", "") || null,
        renderHTML: attrs => (attrs.width ? { style: `width:${attrs.width}px` } : {}),
      },
    };
  },
});