import { Extension } from "@tiptap/core"; 
//Extension.create : 새 확장 정의/기존에 무엇을 상속받지 않는다.
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
                        renderHTML: attributes => { // attributes : { fontSize: "18px", color: "#ff0000", ... }
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