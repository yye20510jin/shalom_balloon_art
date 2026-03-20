import { useEditor, EditorContent } from "@tiptap/react";
import {viewerExtensions} from "./baseExtensions";

export default function ReadOnlyEditor({ contentHtml }) {
    const editor = useEditor({
        editable: false,
        content: contentHtml,
        extensions: viewerExtensions
    });

    if (!editor) return null;

    return <EditorContent editor={editor} />
}