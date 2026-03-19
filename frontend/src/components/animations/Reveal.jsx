import React from "react";
import { useInViewAnimate } from "../../hooks/animations/useInViewAnimate";

export default function Reveal({
  as: Tag = "div",
  effect = "anim-fade-up",
  once = true,
  repeat = false,
  useThreshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  extras = "",            
  className = "",         
  style,
  children,
  ...rest
}) {
  const { ref, className: animClass } = useInViewAnimate({
    effect,
    once,
    repeat,
    useThreshold,
    rootMargin,
    extras,
  });

  return (
    <Tag
      ref={ref}
      className={`${animClass} ${className}`.trim()}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
