import { Extension } from "@tiptap/core"; 
export const FontSize = Extension.create({
    name: "fontSize",

    addGlobalAttributes() {
        return [
            {
                types: ["textStyle"], // 기존 마크(TextStyle)에 속성을 “얹는”다.
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
                        chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
        };
    },
});