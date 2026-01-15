import ListItem from "@tiptap/extension-list-item";

export const CustomListItem = ListItem.extend({
    addAttributes(){
        return{
            ...this.parent?.(), //parent는 함수
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

    addCommands(){ //에디터에 새 명령을 추가. Btn에서 사용.
        return{
            setListItemAlign:
                (align) => ({chain}) =>
                    chain().focus().updateAttributes("listItem",{align}).run(),
            unsetListItemAlign:
                () => ({chain})=>chain().focus().updateAttributes("listItem",{align:null}).run(),
        };
    },
});