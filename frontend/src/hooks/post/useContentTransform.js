import {useCallback} from "react";

export function extractYouTubeId(input) {
  try {
    const u = new URL(input.trim());

    // https://youtu.be/dQw4w9WgXcQ
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return id || null;
    }

    //https://www.youtube.com/watch?v=dQw4w9WgXcQ
    const host = u.hostname.replace("www.", "");
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const v = u.searchParams.get("v");
      if (v) return v;

      const shorts = u.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shorts?.[1]) return shorts[1];

      const embed = u.pathname.match(/^\/embed\/([^/?]+)/);
      if (embed?.[1]) return embed[1];
    }

    return null;
  } catch {
    return null;
  }
}

export function useContentTransform(){
    const replaceYouTubeIframesWithMarkers = useCallback((html)=>{
        const doc = document.implementation.createHTMLDocument("");
        const wrapper = doc.createElement("div");
        wrapper.innerHTML = html || "";

        wrapper.querySelectorAll("iframe").forEach((iframe)=>{
            const src = iframe.getAttribute("src") || "";
            const id = extractYouTubeId(src);
            console.log("youtubeId : " , id);
            if(!id) return;

            const marker = doc.createElement("span");
            marker.setAttribute("data-youtube-fallback",id);
            iframe.replaceWith(marker);
        });
        return wrapper.innerHTML;
    },[]);

    return {replaceYouTubeIframesWithMarkers};
}