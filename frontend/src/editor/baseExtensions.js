import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import { CustomYoutube } from "./extensions/CustomYoutube";
import { CustomTextStyle } from "./extensions/CustomTextStyle";
import { DataColor } from "./extensions/DataColor";
import { DataFontFamily } from "./extensions/DataFontFamily";
import { FontSize } from "./extensions/FontSize";
import {CustomListItem} from "./extensions/CustomListItem";
import {CustomTextAlign} from "./extensions/CustomTextAlign";
import {CustomOrderedList} from "./extensions/CustomOrderedList";
import { CustomBulletList } from "./extensions/CustomBulletList";
import { ViewerCustomImage } from "./extensions/ViewerCustomImage";
import { ColorDecorations } from "./extensions/ColorDecorations";

export const baseExtensions = [
  StarterKit.configure({
    bulletList:false,
    orderedList:false,
    listItem:false
  }),
  CustomListItem,
  CustomBulletList,
  CustomOrderedList,
  CustomTextStyle,
  DataColor,
  ColorDecorations,
  DataFontFamily,
  FontSize,
  CustomTextAlign.configure({
    types:["heading","paragraph"],
  }), 
CustomYoutube,
];

export const viewerExtensions = [
  StarterKit,
  CustomTextStyle,
  DataColor,
  ColorDecorations,
  DataFontFamily,
  FontSize,
  CustomTextAlign,
  Youtube,
  ViewerCustomImage,
];