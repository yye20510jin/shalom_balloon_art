import { Extension } from "@tiptap/core";

export const FontSize = Extension.create({
    name: "fontSize",

    addGlobalAttributes() {
        return [
            {
                types: ["textStyle"], // TextStyle 마크에 얹어서 관리
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize?.replace(/['"]/g, "") || null,
                        renderHTML: attributes => {
                            if (!attributes.fontSize) return {};
                            return { style: `font-size: ${attributes.fontSize}` };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontSize:
                size =>
                    ({ chain }) =>
                        chain().setMark("textStyle", { fontSize: size }).run(),

            unsetFontSize:
                () =>
                    ({ chain }) =>
                        chain().setMark("textStyle", { fontSize: null }).run(),
        };
    },
});