import { Extension } from "@tiptap/core";

export const DataColor = Extension.create({
    name: "dataColor",

    addGlobalAttributes(){
        return[
            {
                types:["textStyle"],
                attributes:{
                    color:{
                        default:null,

                        parseHTML: (element) => element.getAttribute("data-color") || null,
                        renderHTML: (attributes) =>{
                            if(!attributes.color) return {};
                            return{"data-color":attributes.color};
                        },
                    },
                },
            },
        ];
    },
    addCommands(){
        return{
            setColor:
            (color) => ({chain}) => chain().setMark("textStyle",{color}).run(),

            unsetColor:
            () => ({chain}) => chain().setMark("textStyle",{color: null}).removeEmptyTextStyle().run(),
        };
    },
});