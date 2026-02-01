export function toYouTubeEmbedUrl(input) {
  try {
    const u = new URL(input.trim());

    // youtu.be/<id>
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    // youtube.com / www.youtube.com / m.youtube.com
    const host = u.hostname.replace("www.", "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      // /watch?v=<id>
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;

      // /shorts/<id>
      const shorts = u.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shorts?.[1]) return `https://www.youtube-nocookie.com/embed/${shorts[1]}`;

      // /embed/<id> (이미 embed면 그대로)
      const embed = u.pathname.match(/^\/embed\/([^/?]+)/);
      if (embed?.[1]) return `https://www.youtube-nocookie.com/embed/${embed[1]}`;
    }

    return null;
  } catch {
    return null;
  }
} 