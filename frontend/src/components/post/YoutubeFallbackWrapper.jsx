import DOMPurify from "dompurify";
import { useEffect, useRef } from "react";

const sanitize = (dirtyHtml) =>
  DOMPurify.sanitize(dirtyHtml || "", {
    ALLOWED_TAGS: [
      "p","br","strong","em","u","s","blockquote",
      "ul","ol","li","h1","h2","h3","hr",
      "img","a","span","div"
    ],
    ALLOWED_ATTR: [
      "href","src","alt","title",
      "data-youtube-fallback",
      "class"
    ],
  });


export default function YoutubeFallbackWrapper({ id, contentHtml }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    root.replaceChildren();

    const safeHtml = sanitize(contentHtml || "");
    
    const temp = document.createElement("div");
    temp.innerHTML = safeHtml;

    temp.querySelectorAll("[data-youtube-fallback]").forEach((el) => {
      const raw = el.getAttribute("data-youtube-fallback") || el.textContent || "";
      let src = `https://www.youtube-nocookie.com/embed/${raw}`;
      if (!src) return;

      const wrap = document.createElement("div");
      wrap.className = "yt-wrap";

      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.width = "560";
      iframe.height = "315";
      iframe.title = "YouTube video player";
      iframe.frameBorder = "0";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;

      src = `https://www.youtube.com/watch?v=${raw}`;
      const a = document.createElement("a");
      a.href = src;
      a.target = "_blank";
      a.rel = "noreFerrer";
      a.textContent = "유튜브에서 보기";

      wrap.appendChild(iframe);
      wrap.appendChild(a);
      el.replaceWith(wrap);
    });

    root.appendChild(temp);

    return () => {
      root.replaceChildren();
    };
  }, [id, contentHtml]);

  return <div ref={rootRef} className="postViewer" />;
}