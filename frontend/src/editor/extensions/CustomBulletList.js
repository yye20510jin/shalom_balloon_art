import BulletList from "@tiptap/extension-bullet-list";

export const CustomBulletList = BulletList.extend({
    addAttributes(){
        return{
            ...this.parent?.(),
            align:{
                default:null,
                parseHTML: element => element.getAttribute("data-align") || null,
                renderHTML: attrs => {
                    if(!attrs.align) return {};
                    return{
                        "data-align" : attrs.align,
                    };
                }
            }
        };
    },
    addCommands(){
        return{
            setBulletListAlign:
                (align) => ({chain}) =>
                    chain().focus().updateAttributes("bulletList",{align}).run(),
        };
    }
});