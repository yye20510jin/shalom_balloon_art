import { useEditor, EditorContent } from "@tiptap/react";
import { viewerExtensions } from "./extensions/baseExtensions";

export default function ReadOnlyEditor({ contentHtml }) {
    const editor = useEditor({
        //editable : 타이핑, 커서 이동, 수정 설정
        editable: false,
        content: contentHtml,
        extensions: viewerExtensions
    });

    if (!editor) return null;

    return <EditorContent editor={editor} />
}