import { useEffect, useRef } from "react";

// 네가 이미 쓰던 util이 있으면 그걸 써도 됨
function toYouTubeEmbedUrl(input) {
  try {
    const u = new URL(input.trim());

    // youtu.be/<id>
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    const host = u.hostname.replace("www.", "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;

      const shorts = u.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shorts?.[1]) return `https://www.youtube-nocookie.com/embed/${shorts[1]}`;

      const embed = u.pathname.match(/^\/embed\/([^/?]+)/);
      if (embed?.[1]) return `https://www.youtube-nocookie.com/embed/${embed[1]}`;
    }

    return null;
  } catch {
    return null;
  }
}

export default function YoutubeFallbackWrapper({ id, contentHtml }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // ✅ 이전 글 DOM 완전 제거 (섞임 방지 핵심)
    root.replaceChildren();

    // ✅ contentHtml을 DOM으로 파싱 (React DOM/Tiptap DOM 안 건드림)
    const temp = document.createElement("div");
    temp.innerHTML = contentHtml || "";

    // 1) (권장) 너가 예전에 쓰던 fallback 마커가 있다면 그걸 기준으로 변환
    // 예: <span data-youtube-fallback="원본링크"></span>
    temp.querySelectorAll("[data-youtube-fallback]").forEach((el) => {
      const raw = el.getAttribute("data-youtube-fallback") || el.textContent || "";
      const src = toYouTubeEmbedUrl(raw);

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

      wrap.appendChild(iframe);
      el.replaceWith(wrap);
    });

    // 2) 혹시 contentHtml 안에 a 태그로 유튜브 링크만 들어있는 경우도 처리하고 싶으면(선택)
    // temp.querySelectorAll("a").forEach(...) 이런 식으로 확장 가능

    // ✅ 변환 완료된 DOM을 root에 붙임
    // temp 자체를 붙이면 wrapper의 내부 스타일을 한 번에 적용하기 편함
    root.appendChild(temp);

    // cleanup(선택): 어차피 다음 effect 시작에서 replaceChildren하므로 필수는 아님
    return () => {
      root.replaceChildren();
    };
  }, [id, contentHtml]);

  return <div ref={rootRef} className="postViewer" />;
}