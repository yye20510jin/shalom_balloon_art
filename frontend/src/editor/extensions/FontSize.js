import { Extension } from "@tiptap/core"; 
export const FontSize = Extension.create({
    name: "fontSize",

    addGlobalAttributes() {
        return [
            {
                types: ["textStyle"], 
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.getAttribute("data-font-size") || null,
                        renderHTML: attributes => { 
                            if (!attributes.fontSize) return {};
                            return { "data-font-size": attributes.fontSize, };
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