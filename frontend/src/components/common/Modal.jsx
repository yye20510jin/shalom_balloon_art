import { useEffect, useRef } from "react";
import "../../styles/public/Modal.css";

export default function Modal({ open, title, onClose, children, error }) {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);

        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);



    if (!open) return null;

    return (
        <div
            className="modalOverlay"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={onClose}
        >
            <div className="modalPanel" onMouseDown={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2 className="modalTitle">{title}</h2>
                    <button
                        type="button"
                        className="modalClose"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
                {error && <div className="i-errMessage">{error}</div>}
                <div className="modalBody">{children}</div>
            </div>
        </div>
    );
}