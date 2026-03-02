import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

function isSafeHexColor(v) {
  return typeof v === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
}

export const ColorDecorations = Extension.create({
  name: "colorDecorations",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decos = [];

            doc.descendants((node, pos) => {
              if (!node.isText) return;
              
              const textStyle = node.marks.find((m) => m.type.name === "textStyle");
              const color = textStyle?.attrs?.color;

              if (!isSafeHexColor(color)) return;

              const from = pos;
              const to = pos + node.nodeSize;

              decos.push(Decoration.inline(from, to, { style: `color: ${color};` }));
            });

            return DecorationSet.create(doc, decos);
          },
        },
      }),
    ];
  },
});