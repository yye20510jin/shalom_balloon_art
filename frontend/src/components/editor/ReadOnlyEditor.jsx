import { useEditor, EditorContent } from "@tiptap/react";
import { baseExtensions } from "./extensions/baseExtensions";

export default function ReadOnlyEditor({contentHtml}){
    const editor = useEditor({
        //editable : 타이핑, 커서 이동, 수정 설정
        editable: false,
        content: contentHtml,
        extensions: baseExtensions,
    });

    if (!editor) return null;

    return <EditorContent editor={editor}/>
}