import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { FontSize } from "../../../hooks/post/toolbar/useFontSize";
import {CustomListItem} from "../../../hooks/post/toolbar/useCustomListItem";
import {CustomTextAlign} from "../../../hooks/post/toolbar/useCustomTextAlign";
import {CustomOrderedList} from "../../../hooks/post/toolbar/useCustomOrderedList";
import { CustomBulletList } from "../../../hooks/post/toolbar/useCustomBulletList";
import { CustomImage } from "../../../hooks/post/toolbar/useCustomImage";

export const baseExtensions = [
  StarterKit.configure({
    bulletList:false,
    orderedList:false,
    listItem:false
  }),
  CustomListItem,
  CustomBulletList,
  CustomOrderedList,
  TextStyle,
  Color,
  FontFamily,
  FontSize,
  CustomTextAlign.configure({
    types:["heading","paragraph"],
  }),
  CustomImage,  
  Youtube.configure({
    controls: true,
    nocookie: true,
  }),
];