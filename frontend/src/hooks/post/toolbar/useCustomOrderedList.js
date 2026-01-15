import OrderedList from "@tiptap/extension-ordered-list";

export const CustomOrderedList = OrderedList.extend({
    addAttributes(){
        return{
            ...this.parent?.(),
            align:{
                default:null,
                parseHTML: element => element.getAttribute("data-align")|| null,
                renderHTML : attrs => {
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
            setOrderedListAlign:
                (align) => ({chain}) =>
                    chain().focus().updateAttributes("orderedList",{align}).run(),
        };
    }
});