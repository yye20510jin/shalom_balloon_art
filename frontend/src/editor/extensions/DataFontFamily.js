import { Extension } from "@tiptap/core";

export const DataFontFamily = Extension.create({
    name: "dataFontFamily",

    addGlobalAttributes(){
        return[{
            types: ["textStyle"],
            attributes:{
                fontFamily : {
                    default : null,
                    parseHTML: (element) => element.getAttribute("data-font-family") || null,
                    renderHTML: (attributes) => {
                        if(!attributes.fontFamily) return {};
                        return{"data-font-family" : attributes.fontFamily};
                    },
                },
            },
        },];
    },
    addCommands(){
        return{
            setFontFamily:
            (fontFamily) => ({chain}) => chain().setMark("textStyle",{fontFamily}).run(),

            unsetFontFamily:
            () => ({chain}) => chain().setMark("textStyle",{fontFamily: null}).removeEmptyTextStyle().run(),
        };
    },
});