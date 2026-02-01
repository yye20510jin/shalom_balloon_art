import { useEffect, useRef } from "react";

function embedSrcToWatchUrl(src) {
  try {
    const u = new URL(src);
    const parts = u.pathname.split("/").filter(Boolean);
    const id = parts[0] === "embed" ? parts[1] : parts[parts.length - 1];
    if (!id) return null;

    const watch = new URL("https://www.youtube.com/watch");
    watch.searchParams.set("v", id);

    const start = u.searchParams.get("start");
    if (start) watch.searchParams.set("t", start);

    return watch.toString();
  } catch {
    return null;
  }
}

export default function YoutubeFallbackWrapper({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // 중복 방지: 기존 fallback 제거
    root
      .querySelectorAll('[data-youtube-fallback="1"]')
      .forEach((n) => n.remove());

    const iframes = Array.from(root.querySelectorAll("iframe"));

    for (const iframe of iframes) {
      const src = iframe.getAttribute("src");
      const watchUrl = src ? embedSrcToWatchUrl(src) : null;
      if (!watchUrl) continue;

      const wrap = document.createElement("div");
      wrap.setAttribute("data-youtube-fallback", "1");
      wrap.style.marginTop = "8px";

      const a = document.createElement("a");
      a.href = watchUrl;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = "유튜브에서 보기";

      wrap.appendChild(a);

      // DOM 조작
      iframe.insertAdjacentElement("afterend", wrap);
    }
  }, []);

  return <div ref={ref}>{children}</div>;
}
