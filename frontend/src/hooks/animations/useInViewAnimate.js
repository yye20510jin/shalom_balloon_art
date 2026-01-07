import { useEffect, useMemo, useRef, useState } from "react";

export function useInViewAnimate({
  effect = "anim-fade-up",     // anim-fade-in | anim-fade-up | anim-slide-left | ...
  once = true,
  repeat = false,             // once=false일 때 나갔다 들어오면 재실행
  useThreshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  base = "anim",
  pre = "anim-pre",           // 들어오기 전 숨김 클래스
  extras = "",                // anim--fast, anim--delay-200 같은 옵션
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const t = Math.max(0,Math.min(1,Number(useThreshold)));

    const io = new IntersectionObserver(
      ([entry]) => {
        console.log(entry.boundingClientRect.height, entry.rootBounds?.height);
        if (entry.isIntersecting && entry.intersectionRatio >= t) {
          setInView(true);
          if (once) io.unobserve(el);
        } else {
          if (!once && repeat) setInView(false);
        }
      },
      { threshold: [0, t], rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, repeat, useThreshold, rootMargin]);

  const className = useMemo(() => {
    // 아직 안 들어왔으면 숨김(pre)만
    if (!inView) return `${pre} ${extras}`.trim();

    // 들어오면 base + effect
    return `${base} ${effect} ${extras}`.trim();
  }, [inView, base, effect, pre, extras]);

  return { ref, inView, className };
}
