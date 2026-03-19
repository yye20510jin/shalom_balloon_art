export function toExtractYouTubeId(input) {
  try {
    const u = new URL(input.trim());

    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return id || null;
    }

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