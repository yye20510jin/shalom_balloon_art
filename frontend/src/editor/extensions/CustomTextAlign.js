import TextAlign from "@tiptap/extension-text-align";

export const CustomTextAlign = TextAlign.extend({
    addCommands(){
        const parent = this.parent?.();

        return{
            ...parent,

            setTextAlign:
                align => (props) => {

                    const {editor} = props;

                    if(editor.isActive("orderedList") || editor.isActive("bulletList")){return false;}

                    return parent.setTextAlign(align)(props);
                },
        };
    },

    addGlobalAttributes(){
        return[{
            types: this.options.types ?? ["heading", "paragraph"],
            attributes:{
                textAlign:{
                    default:null,
                    parseHTML: (element) => element.getAttribute("data-align") || null,
                    renderHTML: (attributes) => {
                        if(!attributes.textAlign) return {};
                        return{"data-align" : attributes.textAlign};
                    },
                },
            },
        }];
    },
});