export function toYouTubeEmbedUrl(input) {
  try {
    const u = new URL(input.trim());

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