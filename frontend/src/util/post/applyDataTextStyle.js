const ALLOWED_FONTS = new Set(["Arial", "Pretendard", "Noto Sans KR"]);

function isSafeHexColor(v) {
  return typeof v === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
}

function isSafePx(v, min = 10, max = 72) {
  if (typeof v !== "string") return false;
  const m = v.match(/^(\d{1,3})px$/);
  if (!m) return false;
  const n = Number(m[1]);
  return Number.isFinite(n) && n >= min && n <= max;
}

export function applyDataTextStyle(rootEl) {
  rootEl
    .querySelectorAll("span[data-color], span[data-font-family], span[data-font-size], img[data-width]")
    .forEach((el) => {
      const color = el.getAttribute("data-color");
      if (color && isSafeHexColor(color)) {
        el.style.color = color; 
      }

      const ff = el.getAttribute("data-font-family");
      if (ff && ALLOWED_FONTS.has(ff)) {
        el.style.fontFamily = ff.includes(" ") ? `"${ff}"` : ff;
      }

      const fs = el.getAttribute("data-font-size");
      if (fs && isSafePx(fs, 10, 96)) {
        el.style.fontSize = fs;
      }

      const is = el.getAttribute("data-width");
      if(is){
        el.style.width = `${is}px`;
      }
    });
}