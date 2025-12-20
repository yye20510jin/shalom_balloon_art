import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/GalleryHero.css";

export default function GalleryHero({
    images = [],
    autoScroll = true,
    intervalMs = 3000, // 자동 이동 주기
    visibleThumbs = 4, // 한 화면에 보이는 썸네일 개수
}) {

    const safeImages = useMemo(() => images.filter(Boolean), [images]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    //autoIndex : "오른쪽 썸네일 창"이 어느 위치를 보여주고 있는지
    const [autoIndex, setAutoIndex] = useState(0);

    //사용자가 클릭/호버하면 자동 정지
    const [isAutoOn, setIsAutoOn] = useState(Boolean(autoScroll));

    const timerRef = useRef(null);

    //이미지가 바뀌거나 비어있을 때 방어
    useEffect(() => {
        if (selectedIndex >= safeImages.length) setSelectedIndex(0);
        if (autoIndex >= safeImages.length) setAutoIndex(0);
    }, [safeImages.length]);

    //자동 스크롤 interval
    useEffect(() => {
        if (!isAutoOn) return;
        if (safeImages.length <= visibleThumbs) return;

        timerRef.current = setInterval(() => {
            setAutoIndex((prev) => {
                const next = prev + 1;
                //끝까지 가면 처음으로(루프)
                return next > safeImages.length - visibleThumbs ? 0 : next;
            });
        }, intervalMs);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isAutoOn, safeImages.length, intervalMs, visibleThumbs]);

    const main = safeImages[selectedIndex];

    //썸네일 한 칸 높이(고정). css에서도 동일하게 맞춰주면 좋다.
    const THUMB_H = 86;

    const handleThumbClick = (i) => {
        setSelectedIndex(i);
        setIsAutoOn(false); //사용자 개입 시 자동 OFF
    };

    const handleMouseEnter = () => setIsAutoOn(false);
    const handleMouseLeave = () => setIsAutoOn(Boolean(autoScroll));

    if (!safeImages.length) {
        return (
            <div style={{ padding: 24, borderRadius: 16, background: "#fff" }}>
                이미지가 없습니다.
            </div>
        );
    }

    return (
        <section className="gallery-hero">
            {/* 왼쪽 메인 */}
            <div className="main">
                <img className="main-img" src={main.src} alt={main.alt ?? "main"} />
            </div>

            {/* 오른쪽 썸네일 */}
            <div className ="thumb-box">
            <div
                className="thumb-rail"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className="thumb-track"
                    style={{
                        transform: `translateY(${-autoIndex * THUMB_H}px)`,
                    }}
                >
                    {safeImages.map((img, i) => {
                        const isActive = i === selectedIndex;
                        return (
                            <button
                                key={img.id ?? `${img.src}-${i}`}
                                type="button"
                                className={`thumb ${isActive ? "active" : ""}`}
                                onClick={() => handleThumbClick(i)}
                            >
                                <img src={img.src} alt={img.alt ?? `thumb-${i}`} />
                            </button>
                        );
                    })}
                </div>

                {/* (선택) 자동 상태 표시: 필요 없으면 삭제 */}
                <div className="thumb-hint">
                    {isAutoOn ? "auto" : "paused"}
                </div>
            </div>
            </div>
        </section>
    );

}