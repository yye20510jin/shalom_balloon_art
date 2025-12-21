import { useMemo, useState } from "react";
import "../../styles/HomeGallery.css";

export default function HomeGallery({ images = [] }) {
    const pattern = useMemo(
        () => ["big", "mid", "mid", "wide", "small", "small", "tall", "mid"], []);

    return (
        <section className="home-wrap">
            <div className="home-grid">
                {images.map((img, i) => {
                    const cls = pattern[i % pattern.length];
                    return (
                        <div
                            key={img?.id ?? `${img}-${i}`}
                            className={`home-card ${cls}`}
                            aria-label={`Open image ${i + 1}`}
                        >
                            <div className="contant">{img.alt}</div>
                            <img src={typeof img === "string" ? img : img.src} alt={img.alt} loading="lazy" />

                        </div>
                    );
                })}
            </div>
        </section>
    );
}