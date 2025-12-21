import { useMemo } from "react";
import "../../styles/HomeGallery.css";

export default function HomeGallery({images = [], onOpen}){
    const pattern = useMemo(
        ()=>["big", "mid", "mid", "wide", "small", "small", "tall", "mid"],[]);

    return(
        <section className="home-wrap">
            <div className="home-grid">
                {images.map((img,i) => {
                    const cls = pattern[i % pattern.length];
                    return(
                    <button
                        key={img?.id ?? `${img}-${i}`}
                        className={`home-card ${cls}`}
                        type="button"
                        onClick={()=>onOpen?.(i)}
                        aria-label={`Open image ${i + 1}`}
                    >
                        <img src={typeof img === "string" ? img: img.src} alt={img.title} loading="lazy"/>
                    </button>
                    );
                })}
            </div>
        </section>
    );
}