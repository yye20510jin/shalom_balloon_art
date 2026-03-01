import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { FontSize } from "./extensions/FontSize";
import {CustomListItem} from "./extensions/CustomListItem";
import {CustomTextAlign} from "./extensions/CustomTextAlign";
import {CustomOrderedList} from "./extensions/CustomOrderedList";
import { CustomBulletList } from "./extensions/CustomBulletList";
import { CustomImage } from "./extensions/eCustomImage";
import { ViewerCustomImage } from "./extensions/ViewerCustomImage";

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

export const viewerExtensions = [
  StarterKit,
  TextStyle,
  Color,
  FontFamily,
  FontSize,
  CustomTextAlign,
  Youtube,
  ViewerCustomImage,
];