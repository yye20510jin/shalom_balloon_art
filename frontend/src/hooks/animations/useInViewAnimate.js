import { useEffect, useMemo, useRef, useState } from "react";

export function useInViewAnimate({
  effect = "anim-fade-up",      
  once = true,
  repeat = false,            
  useThreshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  base = "anim",
  pre = "anim-pre",           
  extras = "",                
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const t = Math.max(0,Math.min(1,Number(useThreshold)));

    const io = new IntersectionObserver(
      ([entry]) => {
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
    if (!inView) return `${pre} ${extras}`.trim();

    return `${base} ${effect} ${extras}`.trim();
  }, [inView, base, effect, pre, extras]);

  return { ref, inView, className };
}
