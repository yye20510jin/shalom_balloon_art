import ListItem from "@tiptap/extension-list-item";

export const CustomListItem = ListItem.extend({
    addAttributes(){
        return{
            ...this.parent?.(), 
            align:{
                default: null,
                parseHTML: (el) => el.getAttribute("data-align") || null,
                renderHTML: (attrs) => {
                    if(!attrs.align) return {};
                    return{"data-align": attrs.align};
                },
            },
        };
    },

    addCommands(){
        return{
            setListItemAlign:
                (align) => ({chain}) =>
                    chain().focus().updateAttributes("listItem",{align}).run(),
            unsetListItemAlign:
                () => ({chain})=>chain().focus().updateAttributes("listItem",{align:null}).run(),
        };
    },
});