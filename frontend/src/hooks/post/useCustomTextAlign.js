import TextAlign from "@tiptap/extension-text-align";

export const CustomTextAlign = TextAlign.extend({
    addCommands(){
        const parent = this.parent?.();

        return{
            ...parent,

            setTextAlign:
                align => (props) => {

                    const {editor} = props;

                    if(editor.isActive("listItem")){return false;}

                    return parent.setTextAlign(align)(props);
                },
        };
    },
});