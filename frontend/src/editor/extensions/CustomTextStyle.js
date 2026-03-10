import { TextStyle } from "@tiptap/extension-text-style";

export const CustomTextStyle = TextStyle.extend({
  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: element => {
          if (!(element instanceof HTMLElement)) return false;

          const hasStyle = element.hasAttribute("style");
          const hasDataColor = element.hasAttribute("data-color");
          const hasDataFontSize = element.hasAttribute("data-font-size");
          const hasDataFontFamily = element.hasAttribute("data-font-family");

          if (hasStyle || hasDataColor || hasDataFontSize || hasDataFontFamily) {
            return {};
          }

          return false;
        },
      },
    ];
  },
});